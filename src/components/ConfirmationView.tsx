import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDateTime } from '../utils/format';

export function ConfirmationView() {
  const { state, dispatch } = useBooking();
  const booking = state.booking;

  if (!booking) return null;

  return (
    <section className="confirmation-shell">
      <div className="confirmation-hero">
        <div className="confirmation-icon">✓</div>
        <p className="eyebrow">Booking confirmed</p>
        <h2>Your reservation is complete</h2>
        <p className="muted">Reference number: {booking.bookingReference}</p>
      </div>

      <div className="confirmation-grid">
        <div className="summary-card">
          <h3>Flight summary</h3>
          <p>{booking.offer.airline}</p>
          <p>{booking.offer.departureAirport.city} to {booking.offer.arrivalAirport.city}</p>
          <p>{formatDateTime(booking.offer.departureTime)} - {formatDateTime(booking.offer.arrivalTime)}</p>
        </div>

        <div className="summary-card">
          <h3>Contact</h3>
          <p>{booking.contact.email}</p>
          <p>{booking.contact.phoneNumber}</p>
          <p>{booking.passengers.length} passenger(s)</p>
        </div>

        <div className="summary-card">
          <h3>Total paid</h3>
          <p className="price-text">{formatCurrency(booking.totalAmount, booking.currency)}</p>
          <p>Status: {booking.status}</p>
        </div>
      </div>

      <div className="confirmation-actions">
        <button className="primary-button" type="button" onClick={() => dispatch({ type: 'RESET_APP' })}>
          Book another trip
        </button>
      </div>
    </section>
  );
}
