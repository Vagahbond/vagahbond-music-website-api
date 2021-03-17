import { BookingMethod } from '../booking-method-enum'

export class InsertEventDTO {
  name: string;

  bookingMethod: BookingMethod;

  bookingurl?: string;

  eventDate: Date;

  location: string;

}

export { BookingMethod }
