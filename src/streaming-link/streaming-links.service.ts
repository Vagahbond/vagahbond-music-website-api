import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { FindStreamingLinkDTO } from "./dto/find-streaming-link.dto";
import { InsertStreamingLinkDTO } from "./dto/insert-streaming-link.dto";
import { StreamingLink } from "./streaming-link.entity";

@Injectable()
export class StreamingLinkService {
  constructor(
    @InjectRepository(StreamingLink)
    private readonly streamingRepository: Repository<StreamingLink>,
    ) {}

  async create(
    insertStreamingLinkDTO: InsertStreamingLinkDTO,
  ): Promise<StreamingLink> {    
    return this.streamingRepository.save(insertStreamingLinkDTO);
  }

  async delete(streamingLinkIdObject: FindStreamingLinkDTO): Promise<DeleteResult> {
    const streamingLink = await this.streamingRepository.findOne(streamingLinkIdObject);
    
    if (!streamingLink) {
      throw new NotFoundException('This streaming link does not exist.');
    }

    return this.streamingRepository.delete(streamingLink.id); 
  }
}
