import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Janey Lowes",
      role: "Founder & Chief Veterinarian",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "UK-trained veterinarian with over 10 years of experience in animal welfare and emergency care."
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Operations Manager",
      image: "https://business.okstate.edu/site-files/sarah-johnson-profile-headshot.jpg",
      bio: "Dedicated animal welfare advocate with 8 years of experience in nonprofit management."
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      role: "Senior Veterinarian",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Specialized in orthopedic surgery and emergency medicine for street animals."
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      role: "Volunteer Coordinator",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Passionate about community engagement and volunteer management."
    }
  ];

  const milestones = [
    { year: "2014", event: "CareTrack founded by Dr. Janey Lowes" },
    { year: "2015", event: "First mobile clinic launched in Sri Lanka" },
    { year: "2016", event: "Treated over 1,000 street dogs" },
    { year: "2017", event: "Expanded to emergency response services" },
    { year: "2018", event: "Opened permanent rehabilitation center" },
    { year: "2019", event: "Launched community education programs" },
    { year: "2020", event: "Reached 5,000+ treatments milestone" },
    { year: "2021", event: "Started international volunteer program" },
    { year: "2022", event: "Opened second clinic location" },
    { year: "2023", event: "Celebrated 10,000+ successful treatments" },
    { year: "2024", event: "Launching telemedicine services" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>About CareTrack</h1>
            <p className="hero-subtitle">
              Transforming the lives of street dogs through compassionate veterinary care, 
              community engagement, and sustainable solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                CareTrack began in 2014 when Dr. Janey Lowes, a UK veterinarian, was backpacking 
                through Sri Lanka. She witnessed firsthand the plight of millions of street dogs 
                lacking access to basic veterinary care. What started as a small initiative to 
                help a few animals has grown into a comprehensive animal welfare organization.
              </p>
              <p>
                Today, we operate multiple clinics and mobile units, providing emergency care, 
                sterilization programs, vaccinations, and community education. Our mission 
                extends beyond treatment - we're building a future where every street dog 
                receives the care and compassion they deserve.
              </p>
              <div className="story-stats">
                <div className="story-stat">
                  <h3>10,000+</h3>
                  <p>Dogs Treated</p>
                </div>
                <div className="story-stat">
                  <h3>2,500+</h3>
                  <p>Successful Adoptions</p>
                </div>
                <div className="story-stat">
                  <h3>15+</h3>
                  <p>Countries Reached</p>
                </div>
              </div>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Our team in action" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide comprehensive veterinary care, rehabilitation, and adoption 
                services for street dogs while promoting animal welfare through community 
                education and sustainable practices.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                A world where every street dog has access to quality healthcare, where 
                communities value and protect their canine companions, and where no dog 
                suffers from preventable diseases or neglect.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">💎</div>
              <h3>Our Values</h3>
              <p>
                Compassion, integrity, innovation, and collaboration guide everything we do. 
                We believe in treating every animal with dignity and every community with respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <h4>{milestone.year}</h4>
                  <p>{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            Dedicated professionals committed to animal welfare
          </p>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="container">
          <h2 className="section-title">Our Partners</h2>
          <div className="partners-grid">
            <div className="partner-logo">🐾 Animal Welfare International</div>
            <div className="partner-logo">🏥 Global Vet Alliance</div>
            <div className="partner-logo">🌍 World Animal Protection</div>
            <div className="partner-logo">❤️ Save Animals Foundation</div>
            <div className="partner-logo">🏛️ Sri Lanka Animal Welfare</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Mission</h2>
            <p>Be part of the change for street dogs worldwide</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn primary">
                Get Involved
              </Link>
              <button className="btn secondary">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;