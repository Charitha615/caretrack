import React from 'react';

const BeforeAfter = () => {
  const transformations = [
    {
      before: "https://images.unsplash.com/photo-1544568800-5d14ce4b7e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Buddy"
    },
    {
      before: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      after: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Luna"
    }
  ];

  return (
    <section className="before-after-section">
      <div className="container">
        <h2 className="section-title">Transformations</h2>
        <p className="section-subtitle">See the incredible journeys of street dogs we've helped</p>
        <div className="transformations-grid">
          {transformations.map((trans, index) => (
            <div key={index} className="transformation-card">
              <div className="comparison">
                <div className="image-container">
                  <img src={trans.before} alt={`${trans.name} before`} />
                  <span className="label before">Before</span>
                </div>
                <div className="image-container">
                  <img src={trans.after} alt={`${trans.name} after`} />
                  <span className="label after">After</span>
                </div>
              </div>
              <h3 className="dog-name">{trans.name}'s Journey</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;