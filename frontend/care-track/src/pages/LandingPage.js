import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  // Blog data
  const blogs = [
    {
      id: 1,
      title: "THERE ARE MILLIONS OF STREET DOGS LACKING BASIC VET CARE IN SRI LANKA",
      excerpt: "UK vet Dr Janey Lowes was backpacking around Sri Lanka in May 2014 when she noticed the plight of the local street dogs. Although there are an estimated 3 million of them, it's not the dogs themselves that are the issue. In fact, street dogs love their freedom and often have a safe place to sleep and a human guardian who feeds them. The real problem is that they don't have access to even the most basic of veterinary care.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "Dec 15, 2024",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "WE WANT TO TRANSFORM THE LIVES OF STREET DOGS WORLDWIDE",
      excerpt: "We dream of having CareTrack clinics all over the world, in the areas we're needed most. However, we've currently got our work cut out in Sri Lanka - it's been a far more daunting challenge than we ever anticipated. With a steady stream of severely injured patients coming through our hospital, we need all the support we can get to ensure we're able to be there for as long as the animals need us.",
      image: "https://images.gofundme.com/dL88b-1Pi2vLZ70O7Pgn8fF-gnk=/720x405/https://d2g8igdw686xgo.cloudfront.net/68245099_1663717508360354_r.png",
      date: "Dec 10, 2024",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "EMERGENCY RESPONSE: SAVING CRITICAL CASES",
      excerpt: "Every day, our team responds to emergency calls about injured and sick street dogs. From road accidents to severe infections, we provide immediate medical care and long-term rehabilitation. Your support helps us save lives every single day.",
      image: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "Dec 5, 2024",
      readTime: "5 min read"
    }
  ];

  // Gallery images
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Rescued dog receiving care",
      category: "Rescue"
    },
    {
      id: 2,
      src: "https://www.sydneycriminallawyers.com.au/app/uploads/2022/10/street-dogs-kathmandu.png",
      alt: "Vet treating street dog",
      category: "Treatment"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Happy adopted dog",
      category: "Adoption"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Community feeding program",
      category: "Community"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Dog rehabilitation",
      category: "Rehabilitation"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Volunteer with dogs",
      category: "Volunteers"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1558788353-f76d92427f16?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Medical checkup",
      category: "Healthcare"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Successful recovery",
      category: "Success Stories"
    }
  ];

  // Success stories
  const successStories = [
    {
      id: 1,
      name: "Buddy",
      story: "Found with severe injuries, now living happily with a loving family",
      before: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      name: "Luna",
      story: "Malnourished and scared, now healthy and confident",
      before: "https://olddoghaven.org/wp-content/uploads/2024/08/Luna-bichonx-82024-FS-1016x1024.jpeg",
      after: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      name: "Max",
      story: "Rescued from the streets, now a therapy dog bringing joy to others",
      before: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
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
            <Link to="/report" className="btn primary">
              Report a Dog in Need
            </Link>
            <button className="btn secondary">
              Volunteer Now
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Happy rescued dog" 
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Dogs Treated</p>
            </div>
            <div className="stat-item">
              <h3>150+</h3>
              <p>Successful Adoptions</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Active Volunteers</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Emergency Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At CareTrack, we believe every street dog deserves access to quality veterinary care, 
                compassion, and a chance at a better life. We work tirelessly to provide medical treatment, 
                rehabilitation, and finding forever homes for street dogs in need.
              </p>
              <div className="mission-features">
                <div className="feature">
                  <span className="feature-icon">🏥</span>
                  <h4>Medical Care</h4>
                  <p>Emergency treatment and ongoing healthcare</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">❤️</span>
                  <h4>Rehabilitation</h4>
                  <p>Physical and emotional recovery support</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🏠</span>
                  <h4>Adoption</h4>
                  <p>Finding loving forever homes</p>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <img 
                src="https://petmedicurgentcare.com/wp-content/uploads/2023/07/petmedic-peabody-staff.jpg" 
                alt="Vet caring for street dog" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="container">
          <h2 className="section-title">Latest Stories & Updates</h2>
          <p className="section-subtitle">Read about our work and the impact we're making</p>
          <div className="blog-grid">
            {blogs.map(blog => (
              <article key={blog.id} className="blog-card">
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{blog.date}</span>
                    <span className="blog-read-time">{blog.readTime}</span>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <button className="read-more-btn">Read Full Story</button>
                </div>
              </article>
            ))}
          </div>
          <div className="section-actions">
            <button className="btn outline">View All Stories</button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-section">
        <div className="container">
          <h2 className="section-title">Transformation Stories</h2>
          <p className="section-subtitle">See the incredible journeys of dogs we've helped</p>
          <div className="success-grid">
            {successStories.map(story => (
              <div key={story.id} className="success-card">
                <div className="comparison-images">
                  <div className="image-wrapper">
                    <img src={story.before} alt={`${story.name} before`} />
                    <span className="image-label before">Before</span>
                  </div>
                  <div className="image-wrapper">
                    <img src={story.after} alt={`${story.name} after`} />
                    <span className="image-label after">After</span>
                  </div>
                </div>
                <div className="success-content">
                  <h3>{story.name}'s Journey</h3>
                  <p>{story.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Our Work in Pictures</h2>
          <p className="section-subtitle">Capturing moments of care, recovery, and happiness</p>
          <div className="gallery-grid">
            {galleryImages.map(image => (
              <div key={image.id} className="gallery-item">
                <img src={image.src} alt={image.alt} />
                <div className="gallery-overlay">
                  <span className="gallery-category">{image.category}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-actions">
            <button className="btn outline">View Full Gallery</button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join our community of animal lovers and help us save more lives</p>
            <div className="cta-buttons">
              <Link to="/report" className="btn primary large">
                Report a Dog in Need
              </Link>
              <button className="btn secondary large">
                Become a Volunteer
              </button>
              <button className="btn outline large">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for latest updates and success stories</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="btn primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;