import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="highlight">WE ARE VETS.</span><br />
            WE TREAT STREET DOGS.<br />
            <span className="highlight">BECAUSE WE CARE.</span>
          </h1>
          <p className="hero-subtitle">
            Providing medical care, love, and hope to street dogs in need. 
            Join us in making a difference, one paw at a time.
          </p>
          <div className="hero-buttons">
            <button className="btn primary">Report a Dog in Need</button>
            <button className="btn secondary">Volunteer Now</button>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Happy rescued dog" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;