import React from 'react';

const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      title: "Understanding Street Dog Behavior",
      excerpt: "Learn how to safely interact with street dogs and understand their body language.",
      date: "Dec 15, 2024",
      image: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      title: "Winter Care for Street Animals",
      excerpt: "Essential tips to help street dogs survive harsh winter conditions.",
      date: "Dec 10, 2024",
      image: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      title: "Success Stories: From Street to Home",
      excerpt: "Heartwarming stories of street dogs who found their forever families.",
      date: "Dec 5, 2024",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="blog-section">
      <div className="container">
        <h2 className="section-title">Latest Blogs & Stories</h2>
        <div className="blog-grid">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <div className="blog-content">
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <span className="blog-date">{blog.date}</span>
                <button className="read-more">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;