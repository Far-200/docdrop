import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page home-page">
      <header className="hero">
        <div className="container">
          <p className="hero-badge">Fast • Simple • Student-Friendly</p>

          <h1 className="hero-title">DocDrop</h1>

          <p className="hero-subtitle">
            Upload documents, choose print options, get an order ID, and track
            your print request without the chaos.
          </p>

          <div className="hero-actions">
            <Link to="/create-order" className="btn btn-primary">
              Create New Order
            </Link>

            <Link to="/track-order" className="btn btn-secondary">
              Track Order
            </Link>

            <Link to="/admin" className="btn btn-secondary">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="features" className="section">
          <div className="container">
            <h2 className="section-title">Why DocDrop?</h2>

            <div className="feature-grid">
              <article className="feature-card">
                <h3>Easy Upload</h3>
                <p>
                  Submit your document in a few clicks without messy manual
                  handling.
                </p>
              </article>

              <article className="feature-card">
                <h3>Print Preferences</h3>
                <p>
                  Choose copies, color mode, orientation, binding, and more.
                </p>
              </article>

              <article className="feature-card">
                <h3>Order Tracking</h3>
                <p>
                  Use your order ID to keep track of the current print status.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
