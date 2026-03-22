import { airports } from '../data/airports';
import type { Airport, BookingOrder, FlightOffer, PassengerForm, SearchParams } from '../types';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function searchAirports(query: string): Promise<Airport[]> {
  await wait(150);
  if (!query.trim()) return airports.slice(0, 6);
  const keyword = query.toLowerCase();
  return airports.filter((airport) =>
    `${airport.code} ${airport.city} ${airport.name} ${airport.country}`.toLowerCase().includes(keyword)
  ).slice(0, 8);
}

function buildIso(date: string, hour: number, minute: number) {
  return new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`).toISOString();
}

export async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  await wait(900);

  if (!params.origin || !params.destination) {
    throw new Error('Origin and destination are required.');
  }

  const airlineTemplates = [
    { name: 'Vietnam Airlines', code: 'VN' },
    { name: 'VietJet Air', code: 'VJ' },
    { name: 'Singapore Airlines', code: 'SQ' },
    { name: 'AirAsia', code: 'AK' },
    { name: 'Bamboo Airways', code: 'QH' },
  ];

  const results: FlightOffer[] = Array.from({ length: 10 }).map((_, index) => {
    const airline = airlineTemplates[index % airlineTemplates.length];
    const stops = index % 3 === 0 ? 0 : index % 2 === 0 ? 1 : 2;
    const departureHour = 6 + index;
    const departureMinute = index % 2 === 0 ? 15 : 45;
    const baseDuration = 85 + Math.abs(params.origin!.code.charCodeAt(0) - params.destination!.code.charCodeAt(0)) * 6;
    const durationMinutes = baseDuration + stops * 90 + index * 7;
    const departureTime = buildIso(params.departureDate, departureHour % 24, departureMinute);
    const arrivalTime = new Date(new Date(departureTime).getTime() + durationMinutes * 60000).toISOString();
    const totalAmount = 90 + index * 27 + stops * 40 + (params.cabinClass === 'business' ? 180 : params.cabinClass === 'first' ? 320 : 0);

    return {
      id: `offer-${index + 1}`,
      airline: airline.name,
      airlineCode: airline.code,
      totalAmount,
      currency: 'USD',
      stops,
      durationMinutes,
      departureTime,
      arrivalTime,
      departureAirport: params.origin!,
      arrivalAirport: params.destination!,
      badges: [index === 0 ? 'Best price' : '', stops === 0 ? 'Direct' : '', durationMinutes < 240 ? 'Fastest' : ''].filter(Boolean),
      segments: [
        {
          from: params.origin!,
          to: stops === 0 ? params.destination! : airports[(index + 3) % airports.length],
          departureTime,
          arrivalTime: new Date(new Date(departureTime).getTime() + Math.floor(durationMinutes / (stops + 1)) * 60000).toISOString(),
          airline: airline.name,
          flightNumber: `${airline.code}${102 + index}`,
          durationMinutes: Math.floor(durationMinutes / (stops + 1)),
        },
        ...(stops > 0
          ? [
              {
                from: airports[(index + 3) % airports.length],
                to: params.destination!,
                departureTime: new Date(new Date(departureTime).getTime() + (Math.floor(durationMinutes / (stops + 1)) + 55) * 60000).toISOString(),
                arrivalTime,
                airline: airline.name,
                flightNumber: `${airline.code}${402 + index}`,
                durationMinutes: Math.ceil(durationMinutes / (stops + 1)),
              },
            ]
          : []),
      ],
    };
  });

  return results;
}

export async function createBooking(payload: { offer: FlightOffer; passengers: PassengerForm[]; contact: { email: string; phoneNumber: string } }): Promise<BookingOrder> {
  await wait(1200);

  if (!payload.passengers.length) {
    throw new Error('At least one passenger is required.');
  }

  return {
    id: `order-${Date.now()}`,
    bookingReference: `FB${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString(),
    offer: payload.offer,
    passengers: payload.passengers,
    contact: payload.contact,
    totalAmount: payload.offer.totalAmount,
    currency: payload.offer.currency,
    status: 'confirmed',
  };
}
