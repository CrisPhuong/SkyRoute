import { useState } from "react";
import { useBooking } from "../context/BookingContext";
import { searchFlights } from "../services/mockApi";
import { AirportAutocomplete } from "./AirportAutocomplete";

export function SearchForm() {
  const { state, dispatch } = useBooking();
  const [form, setForm] = useState(state.searchParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.origin || !form.destination) {
      setError("Please select both origin and destination.");
      return;
    }

    if (form.origin.code === form.destination.code) {
      setError("Origin and destination must be different.");
      return;
    }

    if (!form.departureDate) {
      setError("Please choose a departure date.");
      return;
    }

    if (form.tripType === "round_trip" && !form.returnDate) {
      setError("Please choose a return date.");
      return;
    }

    try {
      setLoading(true);
      dispatch({ type: "SET_SEARCH_PARAMS", payload: form });
      const results = await searchFlights(form);
      dispatch({ type: "SET_RESULTS", payload: results });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="hero-banner panel-dark">
        <div>
          <p className="eyebrow light">Flight booking take-home</p>
          <h1>Find flights that feel like a real product</h1>
          <p className="hero-subtitle">Find the flight that best suits you.</p>
        </div>
      </div>

      <form className="search-panel" onSubmit={handleSubmit}>
        <div className="trip-tabs">
          <button
            type="button"
            className={form.tripType === "one_way" ? "active" : ""}
            onClick={() => setForm({ ...form, tripType: "one_way" })}
          >
            One-way
          </button>
          <button
            type="button"
            className={form.tripType === "round_trip" ? "active" : ""}
            onClick={() => setForm({ ...form, tripType: "round_trip" })}
          >
            Round-trip
          </button>
        </div>

        <div className="search-bar-grid">
          <AirportAutocomplete
            label="Flying from"
            value={form.origin}
            onChange={(origin) => setForm({ ...form, origin })}
            placeholder="City or airport"
          />

          <AirportAutocomplete
            label="Flying to"
            value={form.destination}
            onChange={(destination) => setForm({ ...form, destination })}
            placeholder="City or airport"
          />

          <label className="field search-field">
            <span>Departure</span>
            <input
              type="date"
              value={form.departureDate}
              onChange={(e) =>
                setForm({ ...form, departureDate: e.target.value })
              }
            />
          </label>

          {form.tripType === "round_trip" ? (
            <label className="field search-field">
              <span>Return</span>
              <input
                type="date"
                value={form.returnDate}
                onChange={(e) =>
                  setForm({ ...form, returnDate: e.target.value })
                }
              />
            </label>
          ) : (
            <div className="field search-field disabled-field">
              <span>Return</span>
              <input value="Add return" disabled />
            </div>
          )}

          <label className="field search-field compact-field">
            <span>Adults</span>
            <input
              type="number"
              min="1"
              max="9"
              value={form.adults}
              onChange={(e) =>
                setForm({ ...form, adults: Number(e.target.value) })
              }
            />
          </label>

          <label className="field search-field compact-field">
            <span>Children</span>
            <input
              type="number"
              min="0"
              max="8"
              value={form.children}
              onChange={(e) =>
                setForm({ ...form, children: Number(e.target.value) })
              }
            />
          </label>

          <label className="field search-field compact-field">
            <span>Infants</span>
            <input
              type="number"
              min="0"
              max="4"
              value={form.infants}
              onChange={(e) =>
                setForm({ ...form, infants: Number(e.target.value) })
              }
            />
          </label>

          <label className="field search-field compact-field">
            <span>Cabin</span>
            <select
              value={form.cabinClass}
              onChange={(e) =>
                setForm({
                  ...form,
                  cabinClass: e.target.value as typeof form.cabinClass,
                })
              }
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </label>
        </div>

        <div className="search-actions">
          <div className="search-hint">
            Production-style UI, responsive layout, and full end-to-end demo
            flow
          </div>
          <button
            className="primary-button search-cta"
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching flights..." : "Search"}
          </button>
        </div>

        {error && <p className="error-text search-error">{error}</p>}
      </form>
    </section>
  );
}
