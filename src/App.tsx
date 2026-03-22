import { BookingProvider, useBooking } from "./context/BookingContext";
import { ConfirmationView } from "./components/ConfirmationView";
import { PassengerFormView } from "./components/PassengerFormView";
import { ResultsView } from "./components/ResultsView";
import { SearchForm } from "./components/SearchForm";
import { Footer } from "./components/Footer";
import "./styles.css";

function Shell() {
  const { state } = useBooking();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-wrap">
            <p className="brand">SkyRoute</p>
            <p className="muted">Flight booking</p>
          </div>
          <nav className="steps">
            <span className={state.currentStep === "search" ? "active" : ""}>
              Search
            </span>
            <span className={state.currentStep === "results" ? "active" : ""}>
              Results
            </span>
            <span
              className={state.currentStep === "passengers" ? "active" : ""}
            >
              Passengers
            </span>
            <span
              className={state.currentStep === "confirmation" ? "active" : ""}
            >
              Confirmation
            </span>
          </nav>
        </div>
      </header>

      <main className="page-container page-container-grow">
        {state.currentStep === "search" && <SearchForm />}
        {state.currentStep === "results" && <ResultsView />}
        {state.currentStep === "passengers" && <PassengerFormView />}
        {state.currentStep === "confirmation" && <ConfirmationView />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <Shell />
    </BookingProvider>
  );
}
