import { Tour } from 'src/tour/tour.entity';
import { BookingMethod } from '../booking-method-enum';

export class InsertEventDTO {
  name: string;

  bookingMethod: BookingMethod;

  bookingurl?: string;

  eventDate: Date;

  location: string;

  tour: Tour;
}

export { BookingMethod };
