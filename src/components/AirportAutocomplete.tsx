import { useEffect, useState } from 'react';
import { searchAirports } from '../services/mockApi';
import type { Airport } from '../types';

interface Props {
  label: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder: string;
}

export function AirportAutocomplete({ label, value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value ? `${value.city} (${value.code})` : '');
  const [options, setOptions] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const data = await searchAirports(query);
      setOptions(data);
    }, 150);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    setQuery(value ? `${value.city} (${value.code})` : '');
  }, [value]);

  return (
    <div
      className="field autocomplete"
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (!next || !e.currentTarget.contains(next)) {
          setOpen(false);
        }
      }}
    >
      <label>{label}</label>
      <input
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value) onChange(null);
        }}
      />
      {open && options.length > 0 && (
        <div className="dropdown">
          {options.map((airport) => (
            <button
              key={airport.id}
              type="button"
              className="dropdown-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(airport);
                setOpen(false);
              }}
            >
              <span>{airport.city} ({airport.code})</span>
              <small>{airport.name}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
