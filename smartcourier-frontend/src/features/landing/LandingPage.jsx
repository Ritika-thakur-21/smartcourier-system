import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Globe, ArrowRight, MapPin, Package, FastForward, CheckCircle, BarChart3, Users, Zap, MessageSquare, Share2, Mail, Phone, Star, Send } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">


        <div className="hero-glow"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} />
              <span>SmartCourier 2.0 is Live</span>
            </div>

            <h1 className="hero-title">
              Send Parcels Anywhere, <br />
              <span className="highlight">Track Every Step.</span>
            </h1>

            <p className="hero-subtitle">
              Domestic and international deliveries — book in minutes,
              get real-time updates, and manage everything from one place.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn-primary">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/track" className="btn-secondary">
                <MapPin size={20} /> Track Shipment
              </Link>
            </div>

            <div className="hero-features">
              <span><CheckCircle size={14} className="text-success" /> Pan India</span>
              <span><CheckCircle size={14} className="text-success" /> International</span>
              <span><CheckCircle size={14} className="text-success" /> Real-time Tracking</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-image-container">
              <img src="https://images.pexels.com/photos/7843932/pexels-photo-7843932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="SmartCourier Delivery" className="hero-main-img" />
              <div className="img-glow"></div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="stat-value">100<span className="highlight">+</span></h3>
            <p className="stat-label">Parcels Delivered</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-value">50<span className="highlight">+</span></h3>
            <p className="stat-label">Countries Served</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-value">98<span className="highlight">%</span></h3>
            <p className="stat-label">On-Time Delivery</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Why use SmartCourier?</h2>
            <p className="features-subtitle">Simple booking, live tracking, and instant email updates — everything you need in one place.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Clock size={28} />
              </div>
              <div className="feature-info">
                <h3>Same-Day Dispatch</h3>
                <p>Book before 3PM and your parcel gets picked up the same day. We deliver across India and internationally.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ color: 'var(--success)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <Shield size={28} />
              </div>
              <div className="feature-info">
                <h3>Safe & Insured</h3>
                <p>Every shipment is handled with care. Fragile items, documents, and valuables are all covered.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                <Globe size={28} />
              </div>
              <div className="feature-info">
                <h3>Global Delivery</h3>
                <p>Ship internationally to 50+ countries. Our network handles customs clearance and cross-border logistics for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-overlay"></div>
          <h2 className="cta-title">Ready to ship your first parcel?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '2rem', fontSize: '1.05rem' }}>Domestic or International — we deliver everywhere.</p>
          <Link to="/register" className="btn-white">
            Create a Free Account
          </Link>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section">
        <div className="feedback-container">
          <div className="feedback-content">
            <div className="feedback-header">
              <h2 className="section-title">We value your feedback</h2>
              <p className="section-subtitle">Help us improve your shipping experience. Share your thoughts with us.</p>
            </div>

            <div className="feedback-form-wrapper">
              <div className="feedback-stats">
                <div className="feedback-stat">
                  <h4>4.8/5</h4>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--brand)" color="var(--brand)" />)}
                  </div>
                  <p>Average customer rating</p>
                </div>
                <div className="feedback-stat">
                  <h4>10k+</h4>
                  <p>Happy customers worldwide</p>
                </div>
              </div>

              <form className="feedback-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="Full Name" className="feedback-input" />
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea placeholder="How was your experience?" className="feedback-input" rows="4"></textarea>
                </div>
                <div className="rating-selector">
                  <p>Rate your experience:</p>
                  <div className="stars-input">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        size={24}
                        className={`star-hover ${(hoverRating || rating) >= i ? 'active' : ''}`}
                        fill={(hoverRating || rating) >= i ? "var(--brand)" : "none"}
                        color={(hoverRating || rating) >= i ? "var(--brand)" : "var(--border-medium)"}
                        onMouseEnter={() => setHoverRating(i)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(i)}
                      />
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Submit Feedback <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>SERVICES</h3>
              <ul>
                <li><a href="#">Express Parcel</a></li>
                <li><a href="#">Warehousing</a></li>
                <li><a href="#">Part Truckload</a></li>
                <li><a href="#">Full Truckload</a></li>
                <li><a href="#">International</a></li>
                <li><a href="#">TransportOne</a></li>
                <li><a href="#">Data Intelligence</a></li>
                <li><a href="#">Software Platform</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>SOLUTIONS</h3>
              <ul>
                <li><a href="#">D2C Brands</a></li>
                <li><a href="#">Personal Courier</a></li>
                <li><a href="#">B2B Enterprises</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>PARTNERS</h3>
              <ul>
                <li><a href="#">Franchise Opportunities</a></li>
                <li><a href="#">Delivery Partner</a></li>
                <li><a href="#">Fleet Owner</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>COMPANY</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Governance</a></li>
                <li><a href="#">Investor Relations</a></li>
                <li><a href="#">ODR Portal</a></li>
                <li><a href="#">Press Release</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>GET IN TOUCH</h3>
              <ul>
                <li><a href="#">Support</a></li>
                <li><a href="#">Raise a query</a></li>
                <li><a href="#">Rate Calculator</a></li>
                <li><a href="#">Developer Documentation</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>POLICIES</h3>
              <ul>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Fraud Disclaimer</a></li>
                <li><a href="#">ONDC Disclaimer</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-info">
              <h4>Information Security Policy</h4>
              <p>SmartCourier is committed to safeguarding the confidentiality, integrity and availability of all physical and electronic information assets of the organization. We ensure that the regulatory, operational and contractual requirements are fulfilled.</p>
              <div className="footer-disclaimer">
                <p><strong>Disclaimer</strong></p>
                <p>Operational metrics listed are as of September, 2025</p>
              </div>
            </div>
            <div className="footer-social">
              <div className="social-icons">
                <a href="#"><MessageSquare size={20} /></a>
                <a href="#"><Share2 size={20} /></a>
                <a href="#"><Globe size={20} /></a>
                <a href="#"><Mail size={20} /></a>
                <a href="#"><Phone size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
