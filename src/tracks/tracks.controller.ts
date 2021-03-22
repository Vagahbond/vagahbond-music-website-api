import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UnauthorizedResponse } from "src/auth/dto/unauthorized-response.dto";
import { TokenAuthGuard } from "src/auth/token-auth-guard";
import { BufferedFile } from "src/minio-client/file.model";
import { BadRequestResponse } from "src/shared/dto/bad-request-response.dto";
import { PaginationQuery } from "src/shared/dto/pagination-query.dto";
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateTrackDTO } from "./dto/create-track.dto";
import { TrackPagination } from "./dto/pagination-response.dto";
import { Track } from "./track.entity";
import { TracksService } from "./tracks.service";
import { UpdateTrackAPIBody } from "./dto/update-track-api-body.dto";
import { FindTrackDTO } from "./dto/find-track.dto";
import { UpdateTrackDTO } from "./dto/update-track.dto";
import { UpdateResult } from "typeorm";
import { CreateTrackAPIBody } from "./dto/create-track-api-body.dto";

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
  ) { }

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
  @ApiBearerAuth()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(FileInterceptor('trackFile'))
  @Post()
  async create(
    @Request() isTokenOk: boolean,
    @Body() createTrackDTO: CreateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<Track> {
    if (!trackFile) {
      throw new BadRequestException('missing trackFile');
    }

    

    const track = await this.tracksService.create(
      {
        ...createTrackDTO,
      },
      trackFile,
    );

    return new Track(track);
  }

  @ApiOperation({ summary: 'Get all tracks' })
  @ApiOkResponse({ type: [TrackPagination], description: 'Track objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Track>> {
    return this.tracksService.paginate(
      {
        page: paginationQuery.page || 1,
        limit: paginationQuery.limit || 10,
        route: '/tracks',
      },
    );
  }

  @ApiOperation({ summary: 'Get a track' })
  @ApiOkResponse({ type: () => Track, description: "Track object"})
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @Get(':id')
  async findOne(@Param() findTrackDTO: FindTrackDTO): Promise<Track> {
    const uuidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    if (!uuidRegex.test(findTrackDTO.id)) {
      throw new BadRequestException("Please provide a valid ID.")
    }

    const track: Track | undefined = await this.tracksService.findOne(
      findTrackDTO,
    );

    if (!track) {
      throw NotFoundException;
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
    description: 'Invalid token'
  })
  @ApiBearerAuth()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(FileInterceptor('trackFile'))
  @Put(':id')
  async update(
    @Request() isTokenOk: boolean,
    @Param() findTrackDTO: FindTrackDTO,
    @Body() trackData: UpdateTrackDTO,
    @UploadedFile() trackFile: BufferedFile,
  ): Promise<Track> {
    const existingTrack = await this.tracksService.findOne(findTrackDTO);

    if (!existingTrack) {
      throw new NotFoundException('Could not find track')
    }

    const result: UpdateResult = await this.tracksService.update(
      findTrackDTO,
      trackData,
      existingTrack,
      trackFile,
    )

    if (!result.affected || result.affected < 1) {
      throw new BadRequestException('There was nothing to update')
    }

    const updatedTrack = await this.tracksService.findOne(findTrackDTO);

    if (!updatedTrack) {
      throw new InternalServerErrorException('Could not find updated track.')
    }

    return updatedTrack;
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
  @ApiBearerAuth()
  @UseGuards(TokenAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async delete(
    @Request() isTokenValid: boolean,
    @Param() track: FindTrackDTO,
  ): Promise<void> {
    await this.tracksService.delete(track);
  }
}
