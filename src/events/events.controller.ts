import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BufferedFile } from 'src/minio-client/file.model';
import { BadRequestResponse } from 'src/common/dto/bad-request-response.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import { NotEmptyPipe } from 'src/common/pipes/not-empty-pipe';
import AffectedResponse from 'src/common/dto/affected-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedResponse } from 'src/auth/unauthorized-response';
import { ToursService } from 'src/tour/tours.service';
import { CreateEventDTO } from './dto/create-event.dto';
import { EventPagination } from './dto/pagination-response.dto';
import { Event } from './events.entity';
import { EventsService } from './events.service';
import { FindEventDTO } from './dto/find-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly tourService: ToursService
    ) {}

  @ApiOperation({ summary: 'Post an event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventDTO })
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
    @Body() createEventDTO: CreateEventDTO,
    @UploadedFile() pictureFile: BufferedFile,
  ): Promise<AffectedResponse> {
    if (!pictureFile) {
      throw new BadRequestException('Missing picture file');
    }

    const tour = await this.tourService.findOne({
      id: createEventDTO.tour
    })

    if (!tour) { 
      throw new NotFoundException('This tour does not exist.');
    }

    const event = await this.eventsService.create({
      ...createEventDTO,
      tour
    });

    return {
      message: 'Event successfully created.',
      url: `/events/${event.id}`,
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
  @ApiParam({ name: 'id', type: FindEventDTO, required: true })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    const res = await this.eventsService.findOne({ id });

    if (!res) {
      throw new NotFoundException('This event does not exist');
    }
    return res;
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateEventDTO })
  @ApiOkResponse({ type: () => Event, description: 'Event object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @ApiParam({ name: 'id', type: FindEventDTO, required: true })
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(AuthGuard('headerapikey'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(NotEmptyPipe) eventData: UpdateEventDTO,
  ): Promise<AffectedResponse> {

    const result: UpdateResult = await this.eventsService.update(
      { id },
      eventData,
    );

    // There is always at least one field updated (UpdatedAt)
    if (!result.affected || result.affected < 1) {
      throw new HttpException('Nothing to update.', HttpStatus.NOT_MODIFIED);
    }
    return {
      message: 'Event successfully modified.',
      url: `/events/${id}`,
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
  @ApiParam({ name: 'id', type: FindEventDTO, required: true })
  @HttpCode(204)
  @UseGuards(AuthGuard('headerapikey'))
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.eventsService.delete({ id });
  }
}
