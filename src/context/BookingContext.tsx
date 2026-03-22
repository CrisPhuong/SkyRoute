import { createContext, useContext, useMemo, useReducer } from 'react';
import type { BookingOrder, FlightOffer, FilterState, PassengerForm, SearchParams } from '../types';

type State = {
  currentStep: 'search' | 'results' | 'passengers' | 'confirmation';
  searchParams: SearchParams;
  results: FlightOffer[];
  selectedOffer: FlightOffer | null;
  filters: FilterState;
  passengers: PassengerForm[];
  contact: { email: string; phoneNumber: string };
  booking: BookingOrder | null;
};

type Action =
  | { type: 'SET_SEARCH_PARAMS'; payload: SearchParams }
  | { type: 'SET_RESULTS'; payload: FlightOffer[] }
  | { type: 'SET_SELECTED_OFFER'; payload: FlightOffer }
  | { type: 'SET_FILTERS'; payload: FilterState }
  | { type: 'SET_PASSENGERS'; payload: PassengerForm[] }
  | { type: 'SET_CONTACT'; payload: { email: string; phoneNumber: string } }
  | { type: 'SET_BOOKING'; payload: BookingOrder }
  | { type: 'GO_TO_STEP'; payload: State['currentStep'] }
  | { type: 'RESET_APP' };

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const initialState: State = {
  currentStep: 'search',
  searchParams: {
    tripType: 'one_way',
    origin: null,
    destination: null,
    departureDate: today.toISOString().split('T')[0],
    returnDate: nextWeek.toISOString().split('T')[0],
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy',
  },
  results: [],
  selectedOffer: null,
  filters: {
    stops: 'all',
    airlines: [],
    departureTimeRange: 'all',
    sortBy: 'price',
  },
  passengers: [],
  contact: {
    email: '',
    phoneNumber: '',
  },
  booking: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, currentStep: 'results', selectedOffer: null, booking: null };
    case 'SET_SELECTED_OFFER':
      return { ...state, selectedOffer: action.payload, currentStep: 'passengers' };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.payload };
    case 'SET_CONTACT':
      return { ...state, contact: action.payload };
    case 'SET_BOOKING':
      return { ...state, booking: action.payload, currentStep: 'confirmation' };
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used inside BookingProvider');
  return context;
}
