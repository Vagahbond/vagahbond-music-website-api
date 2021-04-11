import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ImageFileMediaTypes } from 'src/media-types';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { FindTourDTO } from './dto/find-tour.dto';
import { InsertTourDTO } from './dto/insert-tour.dto';
import { UpdateTourDTO } from './dto/update-tour.dto';
import { Tour } from './tour.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
    private minioClientService: MinioClientService,
  ) {}

  async create(
    insertTourDTO: InsertTourDTO,
    imageFile: BufferedFile,
  ): Promise<Tour> {
    const tour = new Tour(insertTourDTO);

    tour.pictureFilename = await this.minioClientService.uploadFile(
      imageFile,
      ImageFileMediaTypes,
      typeof Tour,
    );
    return this.tourRepository.save(tour);
  }

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Tour> | FindManyOptions<Tour>,
  ): Promise<Pagination<Tour>> {
    return paginate<Tour>(this.tourRepository, options, searchOptions);
  }

  async find(): Promise<Tour[]> {
    return this.tourRepository.find();
  }

  async findOne(findTourDTO: FindTourDTO): Promise<Tour | undefined> {
    return this.tourRepository.findOne(findTourDTO);
  }

  async update(
    tourIdObject: FindTourDTO,
    updateTourDTO: UpdateTourDTO,
    existingTour: Tour,
    picture?: BufferedFile,
  ): Promise<UpdateResult> {
    if (picture) {
      const pictureFilename = await this.minioClientService.uploadFile(
        picture,
        ImageFileMediaTypes,
        typeof Tour as string,
      );
      this.minioClientService.delete(existingTour.pictureFilename);
      return this.tourRepository.update(tourIdObject, {
        ...updateTourDTO,
        pictureFilename,
      });
    }

    return this.tourRepository.update(
      tourIdObject,
      updateTourDTO
    )
  }

  async delete(tourIdObject: FindTourDTO): Promise<DeleteResult> {
    const tour = await this.tourRepository.findOne(tourIdObject)

    if (!tour) {
      throw new NotFoundException('This tour does not exist');
    }

    this.minioClientService.delete(tour.pictureFilename)
    return this.tourRepository.delete(tourIdObject.id)
  }
}
