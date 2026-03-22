import { useMemo, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { createBooking } from '../services/mockApi';
import type { PassengerForm } from '../types';
import { formatCurrency, formatDateTime, formatDuration } from '../utils/format';

function buildPassengers(adults: number, children: number, infants: number): PassengerForm[] {
  const rows: PassengerForm[] = [];
  for (let i = 0; i < adults; i += 1) {
    rows.push({ id: `adult-${i}`, type: 'adult', givenName: '', familyName: '', bornOn: '', email: '', phoneNumber: '', title: 'Mr' });
  }
  for (let i = 0; i < children; i += 1) {
    rows.push({ id: `child-${i}`, type: 'child', givenName: '', familyName: '', bornOn: '', email: '', phoneNumber: '', title: 'Child' });
  }
  for (let i = 0; i < infants; i += 1) {
    rows.push({ id: `infant-${i}`, type: 'infant_without_seat', givenName: '', familyName: '', bornOn: '', email: '', phoneNumber: '', title: 'Infant' });
  }
  return rows;
}

export function PassengerFormView() {
  const { state, dispatch } = useBooking();
  const { searchParams, selectedOffer, passengers: savedPassengers, contact } = state;
  const initialPassengers = useMemo(
    () => (savedPassengers.length ? savedPassengers : buildPassengers(searchParams.adults, searchParams.children, searchParams.infants)),
    [savedPassengers, searchParams.adults, searchParams.children, searchParams.infants]
  );
  const [passengers, setPassengers] = useState(initialPassengers);
  const [contactForm, setContactForm] = useState(contact);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!selectedOffer) return null;

  function updatePassenger(id: string, field: keyof PassengerForm, value: string) {
    setPassengers((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function validate() {
    if (!contactForm.email || !contactForm.phoneNumber) return 'Contact email and phone number are required.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactForm.email)) return 'Please enter a valid email address.';

    for (const passenger of passengers) {
      if (!passenger.givenName || !passenger.familyName || !passenger.bornOn) {
        return 'Every passenger must have first name, last name, and date of birth.';
      }
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      dispatch({ type: 'SET_PASSENGERS', payload: passengers });
      dispatch({ type: 'SET_CONTACT', payload: contactForm });
      const booking = await createBooking({ offer: selectedOffer!, passengers, contact: contactForm });
      dispatch({ type: 'SET_BOOKING', payload: booking });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="results-search-summary">
        <div>
          <p className="eyebrow">Traveller details</p>
          <h2>Complete your booking</h2>
          <p className="muted">Fill in contact information and passenger names exactly as shown on official documents.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 'results' })}>
          Back to results
        </button>
      </div>

      <div className="booking-layout">
        <form className="passenger-form" onSubmit={handleSubmit}>
          <section className="sub-panel passenger-section">
            <h3>Contact details</h3>
            <div className="two-column-grid">
              <label className="field">
                <span>Email</span>
                <input value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="name@example.com" />
              </label>
              <label className="field">
                <span>Phone number</span>
                <input value={contactForm.phoneNumber} onChange={(e) => setContactForm({ ...contactForm, phoneNumber: e.target.value })} placeholder="+84 912 345 678" />
              </label>
            </div>
          </section>

          {passengers.map((passenger, index) => (
            <section key={passenger.id} className="sub-panel passenger-section">
              <div className="passenger-header">
                <h3>Passenger {index + 1}</h3>
                <span className="pill-tag">{passenger.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="three-column-grid">
                <label className="field">
                  <span>Title</span>
                  <input value={passenger.title} onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)} />
                </label>
                <label className="field">
                  <span>First name</span>
                  <input value={passenger.givenName} onChange={(e) => updatePassenger(passenger.id, 'givenName', e.target.value)} />
                </label>
                <label className="field">
                  <span>Last name</span>
                  <input value={passenger.familyName} onChange={(e) => updatePassenger(passenger.id, 'familyName', e.target.value)} />
                </label>
                <label className="field">
                  <span>Date of birth</span>
                  <input type="date" value={passenger.bornOn} onChange={(e) => updatePassenger(passenger.id, 'bornOn', e.target.value)} />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input value={passenger.email} onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)} />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input value={passenger.phoneNumber} onChange={(e) => updatePassenger(passenger.id, 'phoneNumber', e.target.value)} />
                </label>
              </div>
            </section>
          ))}

          {error && <p className="error-text">{error}</p>}

          <div className="form-submit-row">
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? 'Confirming booking...' : 'Confirm booking'}
            </button>
          </div>
        </form>

        <aside className="summary-card sticky-summary">
          <p className="eyebrow">Your selected flight</p>
          <h3>{selectedOffer.airline}</h3>
          <div className="summary-route">
            <div>
              <div className="time-lg">{formatDateTime(selectedOffer.departureTime)}</div>
              <div className="airport-meta">{selectedOffer.departureAirport.code} · {selectedOffer.departureAirport.city}</div>
            </div>
            <div className="journey-compact">
              <span>{formatDuration(selectedOffer.durationMinutes)}</span>
              <span>{selectedOffer.stops === 0 ? 'Direct' : `${selectedOffer.stops} stop`}</span>
            </div>
            <div>
              <div className="time-lg">{formatDateTime(selectedOffer.arrivalTime)}</div>
              <div className="airport-meta">{selectedOffer.arrivalAirport.code} · {selectedOffer.arrivalAirport.city}</div>
            </div>
          </div>
          <div className="summary-divider" />
          <div className="summary-row"><span>Total travellers</span><strong>{passengers.length}</strong></div>
          <div className="summary-row"><span>Total amount</span><strong>{formatCurrency(selectedOffer.totalAmount, selectedOffer.currency)}</strong></div>
        </aside>
      </div>
    </section>
  );
}
