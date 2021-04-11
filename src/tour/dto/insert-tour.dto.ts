import { Event } from "src/events/events.entity";

export class InsertTourDTO {
  readonly name: string;

  readonly description: string;

  readonly startDate: Date;

  readonly endDate: Date;

  readonly events: Event[]
}