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
import { UnauthorizedResponse } from 'src/auth/unauthorized-response';
import { AuthGuard } from '@nestjs/passport';
import AffectedResponse from 'src/common/dto/affected-response.dto';
import { NotEmptyPipe } from 'src/common/pipes/not-empty-pipe';
import { ReleasesService } from 'src/releases/releases.service';
import { CreateTrackDTO } from './dto/create-track.dto';
import { TrackPagination } from './dto/pagination-response.dto';
import { Track } from './track.entity';
import { TracksService } from './tracks.service';
import { UpdateTrackAPIBody } from './dto/update-track-api-body.dto';
import { FindTrackDTO } from './dto/find-track.dto';
import { UpdateTrackDTO } from './dto/update-track.dto';
import { CreateTrackAPIBody } from './dto/create-track-api-body.dto';
@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly releaseService: ReleasesService,
  ) {}

  @ApiOperation({ summary: 'Post a track' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTrackAPIBody, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @UseInterceptors(FileInterceptor('trackFile'))
  @UseGuards(AuthGuard('headerapikey'))
  @Post()
  async create(
    @Body() createTrackDTO: CreateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<AffectedResponse> {
    if (!trackFile) {
      throw new BadRequestException('missing trackFile');
    }

    const release = await this.releaseService.findOne({
      id: createTrackDTO.release,
    });

    if (!release) {
      throw new NotFoundException('This release does not exist.');
    }

    const track = await this.tracksService.create(
      {
        ...createTrackDTO,
        streamingLinks: [],
        release,
      },
      trackFile,
    );

    return {
      message: 'Track successfully created',
      url: `/track/${track.id}`,
    };
  }

  @ApiOperation({ summary: 'Get all tracks' })
  @ApiOkResponse({ type: [TrackPagination], description: 'Track objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Track>> {
    return this.tracksService.paginate({
      page: paginationQuery.page || 1,
      limit: paginationQuery.limit || 10,
      route: '/tracks',
    });
  }

  @ApiOperation({ summary: 'Get a track' })
  @ApiOkResponse({ type: Track, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiParam({ name: 'id', type: FindTrackDTO, required: true })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    const track: Track | undefined = await this.tracksService.findOne({ id });

    if (!track) {
      throw new NotFoundException('This track does not exist');
    }

    return track;
  }

  @ApiOperation({ summary: 'Update a track' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateTrackAPIBody })
  @ApiOkResponse({ type: () => Track, description: 'Track object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @ApiParam({ name: 'id', type: FindTrackDTO, required: true })
  @UseInterceptors(FileInterceptor('trackFile'))
  @UseGuards(AuthGuard('headerapikey'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(NotEmptyPipe) trackData: UpdateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<AffectedResponse> {
    const existingTrack = await this.tracksService.findOne({ id });

    if (!existingTrack) {
      throw new NotFoundException('Could not find track');
    }

    const result: UpdateResult = await this.tracksService.update(
      { id },
      trackData,
      existingTrack,
      trackFile,
    );

    if (!result.affected || result.affected < 1) {
      throw new HttpException(
        'There was nothing to update',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return {
      message: 'Track successfully modified.',
      url: `/tracks/${id}`,
    };
  }

  @ApiOperation({ summary: 'Delete track' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid auth token',
  })
  @ApiParam({ name: 'id', type: FindTrackDTO, required: true })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.tracksService.delete({ id });
  }
}
