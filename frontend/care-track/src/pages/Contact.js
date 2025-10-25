import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  const contactInfo = [
    {
      icon: '📞',
      title: 'Emergency Hotline',
      details: ['+94 77 123 4567', '24/7 Available'],
      description: 'For urgent animal rescue and medical emergencies'
    },
    {
      icon: '📧',
      title: 'Email Us',
      details: ['info@caretrack.org', 'support@caretrack.org'],
      description: 'General inquiries and support'
    },
    {
      icon: '🏢',
      title: 'Visit Our Clinic',
      details: ['123 Animal Care Road', 'Colombo 00500, Sri Lanka'],
      description: 'Monday - Friday: 8:00 AM - 6:00 PM'
    },
    {
      icon: '🌐',
      title: 'Social Media',
      details: ['@CareTrackSL', 'Facebook/Instagram/Twitter'],
      description: 'Follow us for updates and stories'
    }
  ];

  const faqs = [
    {
      question: "How can I report a street dog in need?",
      answer: "You can use our online reporting form, call our emergency hotline, or visit any of our clinics. Please provide as much detail as possible about the dog's location and condition."
    },
    {
      question: "Do you offer volunteer opportunities?",
      answer: "Yes! We welcome volunteers for various roles including animal care, administrative work, and community outreach. Training is provided for all positions."
    },
    {
      question: "What services do you provide for street dogs?",
      answer: "We offer emergency medical care, sterilization programs, vaccinations, rehabilitation, and adoption services. All treatments are provided free of charge."
    },
    {
      question: "How can I donate to support your work?",
      answer: "You can donate through our website, bank transfer, or in-person at our clinics. We also accept in-kind donations like medical supplies and pet food."
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1>Get In Touch</h1>
            <p className="hero-subtitle">
              We're here to help street dogs and the communities that care for them. 
              Reach out to us for emergencies, volunteering, or general inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <div className="contact-details">
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
                <p className="contact-description">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-container">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Inquiry Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="emergency">Emergency Report</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="donation">Donation</option>
                    <option value="adoption">Adoption</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your inquiry..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn primary submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <h2 className="section-title">Find Our Clinics</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-content">
                <h3>CareTrack Main Clinic</h3>
                <p>123 Animal Care Road, Colombo 00500</p>
                <p>📞 +94 77 123 4567</p>
                <p>🕐 Mon-Fri: 8:00 AM - 6:00 PM</p>
                <p>🕐 Sat-Sun: 9:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="clinic-list">
            <div className="clinic-card">
              <h4>Colombo Main Clinic</h4>
              <p>123 Animal Care Road, Colombo 00500</p>
              <p>+94 77 123 4567</p>
            </div>
            <div className="clinic-card">
              <h4>Kandy Branch</h4>
              <p>456 Pet Care Lane, Kandy 20000</p>
              <p>+94 81 234 5678</p>
            </div>
            <div className="clinic-card">
              <h4>Galle Mobile Unit</h4>
              <p>Mobile Service - Southern Province</p>
              <p>+94 91 345 6789</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="emergency-banner">
        <div className="container">
          <div className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <div className="emergency-text">
              <h3>Emergency Animal Rescue</h3>
              <p>If you see a street dog in immediate danger or needing urgent medical attention, call our 24/7 hotline immediately</p>
            </div>
            <div className="emergency-contact">
              <div className="emergency-number">+94 77 123 4567</div>
              <button className="btn emergency-btn">Call Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;