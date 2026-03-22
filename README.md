# Flight Booking App - ReactJS Only

This project is a fully usable front-end booking flow built with ReactJS and TypeScript.

## What is included

- flight search form
- airport auto-suggest
- results listing
- filters by stops, airlines, departure time
- sorting by price, duration, departure time
- passenger details form with validation
- booking confirmation screen
- responsive layout
- loading and empty states

## Important note

This version is intentionally built with ReactJS only, so it uses a mocked service layer in `src/services/mockApi.ts`.

That makes the full flow usable locally without needing a backend or exposing a Duffel API key in the browser.

If you want to connect to the real Duffel API later, the clean way is:

1. keep this React UI as-is
2. replace `mockApi.ts` with real API functions
3. send requests through a backend or BFF layer so the API key stays secret

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Suggested folder structure

- `src/components`: UI pieces and step views
- `src/context`: booking state with Context + useReducer
- `src/data`: local airport data
- `src/services`: mocked API layer
- `src/types`: shared TypeScript types
- `src/utils`: formatting helpers

## Architecture decisions

### 1. State management

I used React Context + `useReducer` because the app has one shared booking flow with predictable transitions:

- search
- results
- passengers
- confirmation

This keeps the app simple and avoids adding another state library unless the project grows much larger.

### 2. Component structure

The app is split by booking steps and shared controls:

- `SearchForm`
- `ResultsView`
- `PassengerFormView`
- `ConfirmationView`
- `AirportAutocomplete`

That separation makes it easier to swap the mock service with a real API later.

### 3. Data strategy

This project uses a local mock service layer to simulate real API latency and responses.

Why:

- React-only front ends should not expose secret third-party API keys
- the assessment asked for usable features, so a mock flow is safer than a broken direct integration
- a later backend integration becomes a service replacement instead of a full rewrite

## Competitor analysis summary

Patterns worth adopting from common OTA products like Expedia, Booking, Trip.com, and AirAsia:

- strong search focus above the fold
- simple filters on the left or in a drawer
- cards that make price the main decision anchor
- short labels like Direct, Best price, Fastest
- clear next step CTA on every result

Patterns avoided in this version:

- too many upsell banners too early
- overly dense result cards
- hidden fees or confusing fare breakdowns
- forcing account creation before booking

## AI tools used

Used Claude to speed up:

- project scaffolding
- component planning
- TypeScript typing
- mock data generation
- documentation drafting

The business logic, flow structure, file organization, and implementation decisions were still reviewed and adjusted manually.

## What I would improve next

- route-based step navigation with React Router
- persistent state in localStorage
- unit tests for reducers and formatting helpers
- backend integration for real Duffel search and order creation
- more advanced airline and price filters
