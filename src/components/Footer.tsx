export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <p className="footer-brand-name">SkyRoute</p>
            <p className="footer-tagline">
              Find the best flights at the best prices.
            </p>
          </div>
          <nav className="footer-col" aria-label="Company">
            <p className="footer-heading">Company</p>
            <ul className="footer-links">
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
            </ul>
          </nav>
          <nav className="footer-col" aria-label="Support">
            <p className="footer-heading">Support</p>
            <ul className="footer-links">
              <li>
                <a href="#">Help centre</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
            </ul>
          </nav>
          <nav className="footer-col" aria-label="Explore">
            <p className="footer-heading">Explore</p>
            <ul className="footer-links">
              <li>
                <a href="#">Flights</a>
              </li>
              <li>
                <a href="#">Hotels</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 SkyBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
