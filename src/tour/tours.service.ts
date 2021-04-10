import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "src/minio-client/minio-client.service";
import { Repository } from "typeorm";
import { InsertTourDTO } from "./dto/insert-tour.dto";
import { Tour } from "./tour.entity";

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

    tour.pictureFilename = await this.minioClientService.uploadFile(imageFile, ImageFileMediaTypes, typeof Tour)
    return this.tourRepository.save(tour)
  }
}