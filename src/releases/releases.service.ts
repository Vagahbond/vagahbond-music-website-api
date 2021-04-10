import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { FindReleaseDTO } from './dto/find-release.dto';
import { InsertReleaseDTO } from './dto/insert-release.dto';
import { UpdateReleaseDTO } from './dto/update-release.dto';
import { Release } from './release.entity';

@Injectable()
export class ReleasesService {
  constructor(
    @InjectRepository(Release)
    private releaseRepository: Repository<Release>,
    private minioClientService: MinioClientService,
  ) {}

  async create(
    insertReleaseDTO: InsertReleaseDTO,
    coverFile: BufferedFile,
  ): Promise<Release> {
    const release = new Release(insertReleaseDTO);

    release.coverFileName = await this.uploadReleasePicture(coverFile);

    return this.releaseRepository.save(release);
  }

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Release> | FindManyOptions<Release>,
  ): Promise<Pagination<Release>> {
    return paginate<Release>(this.releaseRepository, options, searchOptions);
  }

  async find(): Promise<Release[]> {
    return this.releaseRepository.find();
  }

  async findOne(release: FindReleaseDTO): Promise<Release | undefined> {
    return this.releaseRepository.findOne({ id: release.id });
  }

  async findBy(params: UpdateReleaseDTO): Promise<Release[]> {
    return this.releaseRepository.find(params);
  }

  async update(
    releaseIdObject: FindReleaseDTO,
    updateReleaseDTO: UpdateReleaseDTO,
    existingRelease: Release,
    coverfile?: BufferedFile,
  ): Promise<UpdateResult> {
    if (coverfile) {
      const coverFileName = await this.uploadReleasePicture(coverfile);
      this.minioClientService.delete(existingRelease.coverFileName);
      return this.releaseRepository.update(releaseIdObject, {
        ...updateReleaseDTO,
        coverFileName,
      });
    }

    return this.releaseRepository.update(releaseIdObject, updateReleaseDTO);
  }

  async delete(releaseIdDTO: FindReleaseDTO): Promise<DeleteResult> {
    const release = await this.releaseRepository.findOne(releaseIdDTO);

    if (!release) {
      throw new NotFoundException('This release does not exist');
    }

    this.minioClientService.delete(release.coverFileName);
    return this.releaseRepository.delete(release.id);
  }

}
