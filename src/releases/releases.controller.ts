import {
  BadRequestException,
  Body,
  Controller,
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
import { AuthGuard } from '@nestjs/passport';
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
import { UnauthorizedResponse } from 'src/auth/unauthorized-response';
import AffectedResponse from 'src/common/dto/affected-response.dto';
import { BadRequestResponse } from 'src/common/dto/bad-request-response.dto';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BufferedFile } from 'src/minio-client/file.model';
import { NotEmptyPipe } from 'src/common/pipes/not-empty-pipe';
import { DeleteDateColumn, UpdateResult } from 'typeorm';
import { CreateReleaseApiBody } from './dto/create-release-api-body.dto';
import { CreateReleaseDTO } from './dto/create-release.dto';
import { ReleasePagination } from './dto/pagination-response.dto';
import { ReleasesService } from './releases.service';
import { Release } from './release.entity';
import { FindReleaseDTO } from './dto/find-release.dto';
import { UpdateReleaseAPIBody } from './dto/update-release-api-body.dto';
import { UpdateReleaseDTO } from './dto/update-release.dto';

@Controller('releases')
export class ReleaseController {
  constructor(private readonly releasesService: ReleasesService) {}

  @ApiOperation({ summary: 'Post a release' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateReleaseApiBody, description: 'Release object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @UseInterceptors(FileInterceptor('coverFile'))
  @UseGuards(AuthGuard('headerapikey'))
  @Post()
  async create(
    @Body() createReleaseDTO: CreateReleaseDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<AffectedResponse> {
    if (!coverFile) {
      throw new BadRequestException('missing coverFile');
    }

    const release = await this.releasesService.create(
      {
        ...createReleaseDTO,
        tracks: [],
      },
      coverFile,
    );

    return {
      message: 'Release successfully created',
      url: `/releases/${release.id}`,
    };
  }

  @ApiOperation({ summary: 'Get all releases' })
  @ApiOkResponse({ type: [ReleasePagination], description: 'Release objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Release>> {
    return this.releasesService.paginate({
      page: paginationQuery.page || 1,
      limit: paginationQuery.limit || 10,
      route: '/releases',
    });
  }

  @ApiOperation({ summary: 'Get a release' })
  @ApiOkResponse({ type: Release, description: 'Release object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiParam({ name: 'id', type: FindReleaseDTO, required: true })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Release> {
    const release = await this.releasesService.findOne({ id });

    if (!release) {
      throw new NotFoundException('This release does not exist');
    }

    return release;
  }

  @ApiOperation({ summary: 'Update a release' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateReleaseAPIBody })
  @ApiOkResponse({ type: () => Release, description: 'Release object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @ApiParam({ name: 'id', type: FindReleaseDTO, required: true })
  @UseInterceptors(FileInterceptor('coverFile'))
  @UseGuards(AuthGuard('headerapikey'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(NotEmptyPipe) releaseData: UpdateReleaseDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<AffectedResponse> {
    const existingRelease = await this.releasesService.findOne({ id });

    if (!existingRelease) {
      throw new NotFoundException('Could not find release');
    }

    const result: UpdateResult = await this.releasesService.update(
      { id },
      releaseData,
      existingRelease,
      coverFile,
    );

    if (!result.affected || result.affected < 1) {
      throw new HttpException(
        'There was nothing to update',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return {
      message: 'Release successfully modified.',
      url: `/releases/${id}`,
    };
  }

  @ApiOperation({ summary: 'Delete release' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid auth token',
  })
  @ApiParam({ name: 'id', type: FindReleaseDTO, required: true })
  @HttpCode(204)
  @DeleteDateColumn(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.releasesService.delete({ id });
  }
}
