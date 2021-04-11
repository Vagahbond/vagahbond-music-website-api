import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UnauthorizedResponse } from "src/auth/unauthorized-response";
import AffectedResponse from "src/common/dto/affected-response.dto";
import { BadRequestResponse } from "src/common/dto/bad-request-response.dto";
import { PaginationQuery } from "src/common/dto/pagination-query.dto";
import { BufferedFile } from "src/minio-client/file.model";
import { Pagination } from "nestjs-typeorm-paginate";
import { NotEmptyPipe } from "src/common/pipes/not-empty-pipe";
import { UpdateResult } from "typeorm";
import { CreateTourAPIBody } from "./dto/create-tour-api-body.dto";
import { CreateTourDTO } from "./dto/create-tour.dto";
import { TourPagination } from "./dto/pagination-response.dto";
import { Tour } from "./tour.entity";
import { ToursService } from "./tours.service";
import { FindTourDTO } from "./dto/find-tour.dto";
import { UpdateTourAPIBody } from "./dto/update-tour-api-body.dto";
import { UpdateTourDTO } from "./dto/update-tour.dto";


@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
  ) {}

  @ApiOperation({ summary: 'Post a tour' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTourAPIBody, description: 'Tour object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @UseInterceptors(FileInterceptor('imageFile'))
  @UseGuards(AuthGuard('headerapikey'))
  @Post()
  async create(
    @Body() createTourDTO: CreateTourDTO,
    @UploadedFile() imageFile: BufferedFile,
  ): Promise<AffectedResponse> {
    if (!imageFile) {
      throw new BadRequestException('missing imageFile');
    }

    const tour = await this.toursService.create(
      {
        ...createTourDTO,
        events: [],
      },
      imageFile,
    );

    return {
      message: 'Tour successfully created',
      url: `/tours/${tour.id}`,
    };
  }

  @ApiOperation({ summary: 'Get all tours' })
  @ApiOkResponse({ type: [TourPagination], description: 'Tour objects' })
  @Get()
  async find(
    @Query() paginationQuery: PaginationQuery,
  ): Promise<Pagination<Tour>> {
    return this.toursService.paginate({
      page: paginationQuery.page || 1,
      limit: paginationQuery.limit || 10,
      route: '/tours',
    });
  }

  @ApiOperation({ summary: 'Get a tour' })
  @ApiOkResponse({ type: Tour, description: 'Tour object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiParam({ name: 'id', type: FindTourDTO, required: true })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Tour> {
    const tour: Tour | undefined = await this.toursService.findOne({ id });

    if (!tour) {
      throw new NotFoundException('This tour does not exist');
    }

    return tour;
  }

  @ApiOperation({ summary: 'Update a tour' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateTourAPIBody })
  @ApiOkResponse({ type: () => Tour, description: 'Tour object' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @ApiParam({ name: 'id', type: FindTourDTO, required: true })
  @UseInterceptors(FileInterceptor('imageFile'))
  @UseGuards(AuthGuard('headerapikey'))
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(NotEmptyPipe) tourData: UpdateTourDTO,
    @UploadedFile() imageFile: BufferedFile,
  ): Promise<AffectedResponse> {
    const existingTour = await this.toursService.findOne({ id });

    if (!existingTour) {
      throw new NotFoundException('Could not find tour');
    }

    const result: UpdateResult = await this.toursService.update(
      { id },
      tourData,
      existingTour,
      imageFile,
    );

    if (!result.affected || result.affected < 1) {
      throw new HttpException(
        'There was nothing to update',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return {
      message: 'Tour successfully modified.',
      url: `/tours/${id}`,
    };
  }

  @ApiOperation({ summary: 'Delete tour' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid auth token',
  })
  @ApiParam({ name: 'id', type: FindTourDTO, required: true })
  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.toursService.delete({ id });
  }


}
