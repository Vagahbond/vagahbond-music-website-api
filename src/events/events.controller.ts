import { BadRequestException, Body, Controller, Delete, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UnauthorizedResponse } from "src/auth/dto/unauthorized-response.dto";
import { TokenAuthGuard } from "src/auth/token-auth-guard";
import { BufferedFile } from "src/minio-client/file.model";
import { BadRequestResponse } from "src/shared/dto/bad-request-response.dto";
import { PaginationQuery } from "src/shared/dto/pagination-query.dto";
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateEventAPIBody } from "./dto/create-event-api-body.dto";
import { CreateEventDTO } from "./dto/create-event.dto";
import { EventPagination } from "./dto/pagination-response.dto";
import { Event } from "./events.entity";
import { EventsService } from "./events.service";
import { FindEventDTO } from "./dto/find-event.dto";
import { UpdateEventDTO } from "./dto/update-event.dto";
import { UpdateEventAPIBody } from "./dto/update-event-api-body.dto";
import { UpdateResult } from "typeorm";

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @ApiOperation({ summary: 'Post an event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventAPIBody })
  @ApiCreatedResponse({ type: () => Event, description: 'Event object'})
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @ApiBearerAuth()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Post()
  async create(
    @Request() isTokenOk: boolean,
    @Body() createEventDTO: CreateEventDTO,
    @UploadedFile() pictureFile: BufferedFile,
  ): Promise<Event> {
    if (!pictureFile) {
      throw new BadRequestException('Missing picture');
    }

    const event = await this.eventsService.create(
      {
        ...createEventDTO,
      },
      pictureFile,
    );

    return new Event(event);
  }

  @ApiOperation({ summary: 'Get all events' })
  @ApiOkResponse({ type: [EventPagination], description: 'Event objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Event>> {
    return this.eventsService.paginate(
      {
        page: paginationQuery.page ? paginationQuery.page : 1,
        limit: paginationQuery.limit ? paginationQuery.limit : 10,
        route: '/events',
      },
      {
        order: {
          createdAt: 'DESC',
        },
      },
    );
  }


  @ApiOperation({ summary: 'Get an event' })
  @ApiOkResponse({ type: () => Event, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id')
  async findOne(@Param() findEventDTO: FindEventDTO): Promise<Event> {
    const event: Event | undefined = await this.eventsService.findOne(
      findEventDTO,
    );

    if (!event) {
      throw NotFoundException;
    }

    return event;
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateEventAPIBody })
  @ApiOkResponse({ type: () => Event, description: 'Event object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @ApiBearerAuth()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Put(':id')
  async update(
    @Request() isTokenOk: boolean,
    @Param() findEventDTO: FindEventDTO,
    @Body() eventData: UpdateEventDTO,
    @UploadedFile() pictureFile: BufferedFile,
  ): Promise<Event> {
    const existingEvent = await this.eventsService.findOne(findEventDTO);

    if (!existingEvent) {
      throw new NotFoundException('Could not find event');
    }

    const result: UpdateResult = await this.eventsService.update(
      findEventDTO,
      eventData,
      existingEvent,
      pictureFile,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('Nothing to update.');
    }

    // Fetch updated event
    const updatedEvent = await this.eventsService.findOne(findEventDTO);

    if (!updatedEvent) {
      throw new InternalServerErrorException('Could not find event');
    }

    return updatedEvent;
  }

  @ApiOperation({ summary: 'Delete event' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid auth token',
  })
  @ApiBearerAuth()
  @UseGuards(TokenAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async delete(
    @Request() isTokenValid: boolean,
    @Param() event: FindEventDTO,
  ): Promise<void> {
    await this.eventsService.delete(event);
  }
}

  
