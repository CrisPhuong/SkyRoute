import { useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDateTime, formatDuration, getTimeBucket } from '../utils/format';

export function ResultsView() {
  const { state, dispatch } = useBooking();
  const { results, filters, searchParams } = state;
  const airlines = [...new Set(results.map((item) => item.airline))];

  const filtered = useMemo(() => {
    const next = results.filter((offer) => {
      if (filters.stops === 'direct' && offer.stops !== 0) return false;
      if (filters.stops === 'one_plus' && offer.stops === 0) return false;
      if (filters.airlines.length && !filters.airlines.includes(offer.airline)) return false;
      if (filters.departureTimeRange !== 'all' && getTimeBucket(offer.departureTime) !== filters.departureTimeRange) return false;
      return true;
    });

    return next.sort((a, b) => {
      if (filters.sortBy === 'price') return a.totalAmount - b.totalAmount;
      if (filters.sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    });
  }, [results, filters]);

  return (
    <section>
      <div className="results-search-summary">
        <div>
          <p className="eyebrow">Flight results</p>
          <h2>
            {searchParams.origin?.code} to {searchParams.destination?.code}
          </h2>
          <p className="muted">
            {searchParams.departureDate} · {searchParams.adults + searchParams.children + searchParams.infants} traveller(s) · {searchParams.cabinClass.replace('_', ' ')}
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 'search' })}>
          Change search
        </button>
      </div>

      <div className="results-layout">
        <aside className="filters-card">
          <div className="filter-section">
            <h3>Filter by</h3>
          </div>

          <label className="filter-field">
            <span>Stops</span>
            <select value={filters.stops} onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { ...filters, stops: e.target.value as typeof filters.stops } })}>
              <option value="all">All flights</option>
              <option value="direct">Direct only</option>
              <option value="one_plus">1+ stop</option>
            </select>
          </label>

          <label className="filter-field">
            <span>Departure time</span>
            <select value={filters.departureTimeRange} onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { ...filters, departureTimeRange: e.target.value as typeof filters.departureTimeRange } })}>
              <option value="all">Any time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </label>

          <div className="filter-section">
            <p className="filter-title">Airlines</p>
            <div className="checkbox-list">
              {airlines.map((airline) => {
                const checked = filters.airlines.includes(airline);
                return (
                  <label key={airline} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const nextAirlines = checked ? filters.airlines.filter((value) => value !== airline) : [...filters.airlines, airline];
                        dispatch({ type: 'SET_FILTERS', payload: { ...filters, airlines: nextAirlines } });
                      }}
                    />
                    <span>{airline}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="results-column">
          <div className="results-toolbar">
            <div className="results-count">{filtered.length} available flight{filtered.length === 1 ? '' : 's'}</div>
            <label className="sort-box">
              <span>Sort by</span>
              <select value={filters.sortBy} onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { ...filters, sortBy: e.target.value as typeof filters.sortBy } })}>
                <option value="price">Price</option>
                <option value="duration">Duration</option>
                <option value="departure">Departure time</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">No flights match your current filters.</div>
          ) : (
            filtered.map((offer) => (
              <article key={offer.id} className="flight-card booking-card">
                <div className="flight-top-row">
                  <div>
                    <p className="airline-name">{offer.airline}</p>
                    <p className="route-line">{offer.departureAirport.city} to {offer.arrivalAirport.city}</p>
                  </div>
                  <div className="badge-row">
                    {offer.badges.map((badge) => (
                      <span className="badge" key={badge}>{badge}</span>
                    ))}
                  </div>
                </div>

                <div className="flight-content-row">
                  <div className="time-block align-left">
                    <div className="time-lg">{formatDateTime(offer.departureTime)}</div>
                    <div className="airport-meta">{offer.departureAirport.code} · {offer.departureAirport.city}</div>
                  </div>

                  <div className="journey-block">
                    <div className="journey-duration">{formatDuration(offer.durationMinutes)}</div>
                    <div className="journey-line">
                      <span className="journey-dot" />
                      <span className="journey-track" />
                      <span className="journey-dot" />
                    </div>
                    <div className="journey-stops">{offer.stops === 0 ? 'Direct flight' : `${offer.stops} stop${offer.stops > 1 ? 's' : ''}`}</div>
                  </div>

                  <div className="time-block align-left">
                    <div className="time-lg">{formatDateTime(offer.arrivalTime)}</div>
                    <div className="airport-meta">{offer.arrivalAirport.code} · {offer.arrivalAirport.city}</div>
                  </div>

                  <div className="price-column bordered-price">
                    <div className="price-caption">Total price</div>
                    <strong className="price-text">{formatCurrency(offer.totalAmount, offer.currency)}</strong>
                    <button className="primary-button full-width" type="button" onClick={() => dispatch({ type: 'SET_SELECTED_OFFER', payload: offer })}>
                      See deal
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
