import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
  FindConditions,
  FindManyOptions,
} from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { InsertEventDTO } from './dto/insert-event.dto';
import { Event } from './events.entity';
import { FindEventDTO } from './dto/find-event.dto';
import { UpdateEventDTO } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(
    insertEventDTO: InsertEventDTO
  ): Promise<Event> {
    const event = new Event(insertEventDTO);

    return this.eventsRepository.save(event);
  }

  async paginate(
    options: IPaginationOptions,
    searchOptions?: FindConditions<Event> | FindManyOptions<Event>,
  ): Promise<Pagination<Event>> {
    return paginate<Event>(this.eventsRepository, options, searchOptions);
  }

  async find(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  async findOne(event: FindEventDTO): Promise<Event | undefined> {
    return this.eventsRepository.findOne({ id: event.id });
  }

  async findBy(params: UpdateEventDTO): Promise<Event[]> {
    return this.eventsRepository.find(params);
  }

  async update(
    eventIdObject: FindEventDTO,
    updateEventDTO: UpdateEventDTO,
  ): Promise<UpdateResult> {
    return this.eventsRepository.update(eventIdObject, updateEventDTO);
  }

  async delete(eventIdObject: FindEventDTO): Promise<DeleteResult> {
    return this.eventsRepository.delete(eventIdObject.id);
  }


}
