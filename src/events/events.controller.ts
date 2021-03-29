import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { BufferedFile } from "src/minio-client/file.model";
import { BadRequestResponse } from "src/common/dto/bad-request-response.dto";
import { PaginationQuery } from "src/common/dto/pagination-query.dto";
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
import { NotEmptyPipe } from "src/common/pipes/not-empty-pipe";
import AffectedResponse from "src/common/dto/affected-response.dto";
import { AuthGuard } from "@nestjs/passport";
import { UnauthorizedResponse } from "src/auth/unauthorized-response"

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) { }

  @ApiOperation({ summary: 'Post an event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventAPIBody })
  @ApiCreatedResponse({ type: () => Event, description: 'Event object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(AuthGuard('headerapikey'))
  @Post()
  async create(
    @Request() isTokenOk: boolean,
    @Body() createEventDTO: CreateEventDTO,
    @UploadedFile() pictureFile: BufferedFile,
  ): Promise<AffectedResponse> {
    if (!pictureFile) {
      throw new BadRequestException('Missing picture file');
    }

    const event = await this.eventsService.create(
      {
        ...createEventDTO,
      },
      pictureFile,
    );

    return {
      message: "Event successfully created.",
      url: `/events/${event.id}`
    };
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
  @ApiOkResponse({ type: Event, description: 'Event object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid identifier',
  })
  @ApiParam({ name: 'id', type: String, required: true })
  @Get(':id')
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<Event> {
    const res =  await this.eventsService.findOne({ id })

    if (!res) {
      throw new NotFoundException("This event does not exist");
    }
    return res;
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
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(AuthGuard('headerapikey'))
  @Put(':id')
  async update(
    @Request() isTokenOk: boolean,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(NotEmptyPipe) eventData: UpdateEventDTO,
    @UploadedFile() pictureFile: BufferedFile,
  ): Promise<AffectedResponse> {
    const existingEvent = await this.eventsService.findOne({id});

    if (!existingEvent) {
      throw new NotFoundException('Could not find event');
    }

    const result: UpdateResult = await this.eventsService.update(
      {id},
      eventData,
      existingEvent,
      pictureFile,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new HttpException('Nothing to update.', HttpStatus.NOT_MODIFIED);
    }
    return {
      message: "Event successfully modified.",
      url: `/events/${id}`
    };
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
  @HttpCode(204)
  @UseGuards(AuthGuard('headerapikey'))
  @Delete(':id')
  async delete(
    @Request() isTokenValid: boolean,
    @Param() event: FindEventDTO,
  ): Promise<void> {
    await this.eventsService.delete(event);
  }
}


