import { BookingMethod } from '../events.entity'

export class InsertEventDTO {
  name: string;

  bookingMethod: BookingMethod;

  bookingurl?: string;

  eventDate: Date;

  location: string;

}