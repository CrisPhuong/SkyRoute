export type TripType = 'one_way' | 'round_trip';
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface Airport {
  id: string;
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface SearchParams {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
}

export interface FlightSegment {
  from: Airport;
  to: Airport;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  flightNumber: string;
  durationMinutes: number;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  totalAmount: number;
  currency: string;
  stops: number;
  durationMinutes: number;
  departureTime: string;
  arrivalTime: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  segments: FlightSegment[];
  badges: string[];
}

export interface PassengerForm {
  id: string;
  type: 'adult' | 'child' | 'infant_without_seat';
  givenName: string;
  familyName: string;
  bornOn: string;
  email: string;
  phoneNumber: string;
  title: string;
}

export interface ContactDetails {
  email: string;
  phoneNumber: string;
}

export interface BookingOrder {
  id: string;
  bookingReference: string;
  createdAt: string;
  offer: FlightOffer;
  passengers: PassengerForm[];
  contact: ContactDetails;
  totalAmount: number;
  currency: string;
  status: 'confirmed';
}

export interface FilterState {
  stops: 'all' | 'direct' | 'one_plus';
  airlines: string[];
  departureTimeRange: 'all' | 'morning' | 'afternoon' | 'evening';
  sortBy: 'price' | 'duration' | 'departure';
}
