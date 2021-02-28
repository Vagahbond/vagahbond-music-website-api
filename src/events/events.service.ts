import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { ImageFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "src/minio-client/minio-client.service";
import { 
  DeleteResult, 
  Repository, 
  UpdateResult, 
  FindConditions, 
  FindManyOptions 
} from "typeorm";
import { InsertEventDTO } from "./dto/insert-event.dto";
import { Event } from './events.entity'
import { FindEventDTO } from './dto/find-event.dto'
import { UpdateEventDTO } from './dto/update-event.dto'
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private EventsRepository: Repository<Event>,
    private minioClientService: MinioClientService,
  ) { }

  async create(
    insertEventDTO: InsertEventDTO,
    picture: BufferedFile,
  ): Promise<Event> {
    const event = new Event(insertEventDTO)
    event.pictureFilename = await this.uploadPictureCover(picture);

    return this.EventsRepository.save(event);
  }


  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Event> | FindManyOptions<Event>,
  ): Promise<Pagination<Event>> {
    return paginate<Event>(this.EventsRepository, options, searchOptions);
  }

  async find(): Promise<Event[]> {
    return this.EventsRepository.find();
  }

  async findOne(event: FindEventDTO): Promise<Event | undefined> {
    return this.EventsRepository.findOne({ id: event.id })
  }

  async findBy(params: UpdateEventDTO): Promise<Event[]> {
    return this.EventsRepository.find(params);
  }

  async update(
    eventIdObject: FindEventDTO,
    updateEventDTO: UpdateEventDTO,
    existingEvent: Event,
    picture?: BufferedFile): Promise<UpdateResult> {
    if (picture) {
      //upload pic
      const pictureFilename = await this.uploadPictureCover(picture);
      this.minioClientService.delete(existingEvent.pictureFilename);
      return this.EventsRepository.update(
        eventIdObject,
        { ...updateEventDTO, pictureFilename }
      );
    }

    return this.EventsRepository.update(eventIdObject, updateEventDTO)
  }

  async delete(eventIdObject: FindEventDTO): Promise<DeleteResult> {
    const event = await this.EventsRepository.findOne(eventIdObject);

    if (!event) {
      throw new BadRequestException();
    }

    this.minioClientService.delete(event.pictureFilename);
    return this.EventsRepository.delete(event.id);
  }

  async uploadPictureCover(file: BufferedFile): Promise<string> {
    if (!Object.keys(ImageFileMediaTypes).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid cover_file media type: ${file.mimetype}`,
      );
    }

    const subFolder = 'events';

    const uploadedImage = await this.minioClientService.upload(file, subFolder);

    return uploadedImage.path;
  }
}
