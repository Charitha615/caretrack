import React from 'react';

const LandingPage = () => {
  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          <span style={{ color: '#ffd700' }}>WE ARE VETS.</span><br />
          WE TREAT STREET DOGS.<br />
          <span style={{ color: '#ffd700' }}>BECAUSE WE CARE.</span>
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          maxWidth: '600px'
        }}>
          Providing medical care, love, and hope to street dogs in need. 
          Join us in making a difference, one paw at a time.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button style={{
            padding: '1rem 2rem',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Report a Dog in Need
          </button>
          <button style={{
            padding: '1rem 2rem',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Volunteer Now
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '3rem', color: '#2c5530', marginBottom: '0.5rem' }}>500+</h3>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Dogs Treated</p>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', color: '#2c5530', marginBottom: '0.5rem' }}>150+</h3>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Successful Adoptions</p>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', color: '#2c5530', marginBottom: '0.5rem' }}>50+</h3>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Active Volunteers</p>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', color: '#2c5530', marginBottom: '0.5rem' }}>24/7</h3>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Emergency Care</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;