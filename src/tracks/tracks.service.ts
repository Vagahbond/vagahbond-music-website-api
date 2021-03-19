import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AudioFileMediaTypes } from "src/media-types";
import { BufferedFile } from "src/minio-client/file.model";
import { MinioClientService } from "src/minio-client/minio-client.service";
import { DeleteResult, FindConditions, FindManyOptions, Repository, UpdateResult } from "typeorm";
import { InsertTrackDTO } from "./dto/insert-track.dto";
import { Track } from "./tracks.entity";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindTrackDTO } from "./dto/find-track.dto";
import { UpdateTrackDTO } from "./dto/update-track.dto";
import { BadRequestResponse } from "src/shared/dto/bad-request-response.dto";

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private minioClientService: MinioClientService,
  ) { }

  async create(
    insertTrackDTO: InsertTrackDTO,
    audioFile: BufferedFile,
  ): Promise<Track> {
    const track = new Track(insertTrackDTO)
    track.audioFileName = await this.uploadTrackFile(audioFile)

    return this.tracksRepository.save(track);
  }

  async find(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findOne(track: FindTrackDTO): Promise<Track | undefined> {
    return this.tracksRepository.findOne({ id: track.id })
  }

  async findBy(params: UpdateTrackDTO): Promise<Track[]> {
    return this.tracksRepository.find(params);
  }

  async update(
    trackIdObject: FindTrackDTO,
    updateTrackDTO: UpdateTrackDTO,
    existingTrack: Track,
    audioFile?: BufferedFile): Promise<UpdateResult> {
    if (audioFile) {
      const audioFileName = await this.uploadTrackFile(audioFile);
      this.minioClientService.delete(existingTrack.audioFileName);
      return this.tracksRepository.update(
        trackIdObject,
        { ...updateTrackDTO, audioFileName }
      );
    }
    return this.tracksRepository.update(trackIdObject, updateTrackDTO)
  }

  async delete(trackIdObject: FindTrackDTO): Promise<DeleteResult> {
    const track = await this.tracksRepository.findOne(trackIdObject);

    if (!track) {
      throw new NotFoundException()
    }

    this.minioClientService.delete(track.audioFileName)
    return this.tracksRepository.delete(track.id)
  }

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Track> | FindManyOptions<Track>
  ): Promise<Pagination<Track>> {
    return paginate<Track>(this.tracksRepository, options, searchOptions)
  }

  async uploadTrackFile(file: BufferedFile): Promise<string> {
    if (!Object.keys(AudioFileMediaTypes).includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid audio file media type ${file.mimetype}`,
      );
    }

    const subFolder = 'tracks';

    const uploadedTrack = await this.minioClientService.upload(file, subFolder);

    return uploadedTrack.path;
  }
}
