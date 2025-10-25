import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './Reports.css';

// Helper functions defined outside the component so they're accessible to all child components
const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { label: 'Pending', class: 'status-pending', icon: 'fa-clock' },
    under_review: { label: 'Under Review', class: 'status-under-review', icon: 'fa-search' },
    released: { label: 'Released', class: 'status-released', icon: 'fa-check-circle' },
    closed: { label: 'Completed', class: 'status-closed', icon: 'fa-flag-checkered' }
  };
  
  const config = statusConfig[status] || { label: status, class: 'status-unknown', icon: 'fa-question-circle' };
  
  return (
    <span className={`status-badge ${config.class}`}>
      <i className={`fas ${config.icon}`}></i>
      {config.label}
    </span>
  );
};

const getUrgencyBadge = (urgency) => {
  const urgencyConfig = {
    low: { label: 'Low', class: 'urgency-low' },
    medium: { label: 'Medium', class: 'urgency-medium' },
    high: { label: 'High', class: 'urgency-high' },
    critical: { label: 'Critical', class: 'urgency-critical' }
  };
  
  const config = urgencyConfig[urgency] || { label: urgency, class: 'urgency-unknown' };
  
  return <span className={`urgency-badge ${config.class}`}>{config.label}</span>;
};

// Individual Report Card Component
const ReportCard = ({ report, onSelect }) => {
  const [currentAfterMedia, setCurrentAfterMedia] = useState(null);
  const [loadingAfterMedia, setLoadingAfterMedia] = useState(false);

  useEffect(() => {
    if (report) {
      loadAfterMedia();
    }
  }, [report]);

  const loadAfterMedia = async () => {
    try {
      setLoadingAfterMedia(true);
      const response = await apiService.getAfterMedia(report.reportNumber);
      if (response.success && response.data.afterMedia.length > 0) {
        // Get the latest after media
        setCurrentAfterMedia(response.data.afterMedia[0]);
      }
    } catch (error) {
      console.error('Error loading after media:', error);
    } finally {
      setLoadingAfterMedia(false);
    }
  };

  const hasBeforeImages = report.images && report.images.length > 0;
  const hasAfterImages = currentAfterMedia && currentAfterMedia.images && currentAfterMedia.images.length > 0;

  return (
    <div className="report-card" onClick={() => onSelect(report)}>
      <div className="card-header">
        <h3 className="report-location">{report.reportLocation}</h3>
        <div className="card-badges">
          {getStatusBadge(report.status)}
          {getUrgencyBadge(report.urgencyLevel)}
        </div>
      </div>

      <div className="before-after-container">
        {/* Before Section */}
        <div className="media-section before-section">
          <div className="section-label">
            <i className="fas fa-camera"></i>
            Before
          </div>
          {hasBeforeImages ? (
            <div className="image-preview">
              <img 
                src={`http://localhost:5000/uploads/images/${report.images[0]}`} 
                alt="Before rescue"
                onError={(e) => {
                  e.target.src = '/placeholder-before.jpg';
                }}
              />
              {report.images.length > 1 && (
                <div className="image-count">+{report.images.length - 1}</div>
              )}
            </div>
          ) : (
            <div className="no-media-placeholder">
              <i className="fas fa-image"></i>
              <span>No before photos</span>
            </div>
          )}
        </div>

        {/* After Section */}
        <div className="media-section after-section">
          <div className="section-label">
            <i className="fas fa-heart"></i>
            After
          </div>
          {loadingAfterMedia ? (
            <div className="loading-media">
              <div className="mini-spinner"></div>
            </div>
          ) : hasAfterImages ? (
            <div className="image-preview">
              <img 
                src={`http://localhost:5000/uploads/after-images/${currentAfterMedia.images[0].filename}`} 
                alt="After care"
                onError={(e) => {
                  e.target.src = '/placeholder-after.jpg';
                }}
              />
              {currentAfterMedia.images.length > 1 && (
                <div className="image-count">+{currentAfterMedia.images.length - 1}</div>
              )}
            </div>
          ) : (
            <div className="no-media-placeholder">
              <i className="fas fa-heartbeat"></i>
              <span>Transformation in progress</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="dog-info">
          <span className="dog-count">
            <i className="fas fa-dog"></i>
            {report.dogCount} {report.dogCount === 1 ? 'dog' : 'dogs'}
          </span>
          <span className="dog-condition">
            Condition: <strong>{report.dogCondition}</strong>
          </span>
        </div>
        <div className="view-details">
          <span>View Story</span>
          <i className="fas fa-arrow-right"></i>
        </div>
      </div>
    </div>
  );
};

// Report Detail Modal Component
const ReportModal = ({ report, onClose }) => {
  const [afterMedia, setAfterMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAfterMedia();
  }, [report]);

  const loadAfterMedia = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAfterMedia(report.reportNumber);
      if (response.success) {
        setAfterMedia(response.data.afterMedia);
      }
    } catch (error) {
      console.error('Error loading after media:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rescue Story - {report.reportLocation}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Report Overview */}
          <div className="report-overview">
            <div className="overview-grid">
              <div className="overview-item">
                <label>Report ID</label>
                <span>{report.reportNumber}</span>
              </div>
              <div className="overview-item">
                <label>Status</label>
                <span>{getStatusBadge(report.status)}</span>
              </div>
              <div className="overview-item">
                <label>Dogs Rescued</label>
                <span>{report.dogCount}</span>
              </div>
              <div className="overview-item">
                <label>Condition</label>
                <span className={`condition-tag ${report.dogCondition}`}>
                  {report.dogCondition}
                </span>
              </div>
              <div className="overview-item">
                <label>Reported On</label>
                <span>{formatDate(report.createdAt)}</span>
              </div>
              <div className="overview-item">
                <label>Initial Urgency</label>
                <span>{getUrgencyBadge(report.urgencyLevel)}</span>
              </div>
            </div>
            
            {report.description && (
              <div className="description-section">
                <h4>Initial Situation</h4>
                <p>{report.description}</p>
              </div>
            )}
          </div>

          {/* Before & After Gallery */}
          <div className="detailed-gallery">
            <div className="gallery-column before-gallery">
              <h3>
                <i className="fas fa-camera"></i>
                Before Rescue
              </h3>
              {report.images && report.images.length > 0 ? (
                <div className="media-grid">
                  {report.images.map((image, index) => (
                    <div key={index} className="media-item">
                      <img 
                        src={`http://localhost:5000/uploads/images/${image}`} 
                        alt={`Before ${index + 1}`}
                        onError={(e) => {
                          e.target.src = '/placeholder-before.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-media">
                  <i className="fas fa-image"></i>
                  <p>No before photos available</p>
                </div>
              )}
            </div>

            <div className="gallery-column after-gallery">
              <h3>
                <i className="fas fa-heart"></i>
                After Care
              </h3>
              {loading ? (
                <div className="loading-media">
                  <div className="mini-spinner"></div>
                  <p>Loading transformation photos...</p>
                </div>
              ) : afterMedia.length > 0 ? (
                <div className="after-media-timeline">
                  {afterMedia.map((media, index) => (
                    <div key={media._id} className="media-update">
                      <div className="update-header">
                        <span className="update-status">{getStatusBadge(media.status)}</span>
                        <span className="update-date">{formatDate(media.createdAt)}</span>
                      </div>
                      
                      {media.adminNotes && (
                        <div className="update-notes">
                          <p>{media.adminNotes}</p>
                        </div>
                      )}

                      {media.images && media.images.length > 0 && (
                        <div className="media-grid">
                          {media.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="media-item">
                              <img 
                                src={`http://localhost:5000/uploads/after-images/${image.filename}`} 
                                alt={`After ${imgIndex + 1}`}
                                onError={(e) => {
                                  e.target.src = '/placeholder-after.jpg';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-media">
                  <i className="fas fa-heartbeat"></i>
                  <p>Transformation photos coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Reports Component
const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchCompletedReports();
  }, []);

  const fetchCompletedReports = async () => {
    try {
      setLoading(true);
      // Fetch only released and closed reports for success stories
      const response = await apiService.getReports(1, 50, 'released,closed');
      
      if (response.success) {
        // Filter to only include reports with images
        const reportsWithImages = response.data.reports.filter(
          report => report.images && report.images.length > 0
        );
        setReports(reportsWithImages);
      }
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-loading">
          <div className="loading-spinner"></div>
          <p>Loading success stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Hero Section */}
      <section className="reports-hero">
        <div className="hero-content">
          <h1>Success Stories</h1>
          <p>Witness the incredible transformations of street dogs we've rescued and cared for</p>
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-number">{reports.length}</span>
              <span className="stat-label">Happy Endings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {reports.reduce((total, report) => total + report.dogCount, 0)}
              </span>
              <span className="stat-label">Dogs Helped</span>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="gallery-section">
        <div className="container">
          {error && (
            <div className="error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {reports.length === 0 ? (
            <div className="no-reports">
              <i className="fas fa-inbox"></i>
              <h3>No Success Stories Yet</h3>
              <p>Check back later to see our amazing transformations!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {reports.map((report) => (
                <ReportCard 
                  key={report._id} 
                  report={report} 
                  onSelect={setSelectedReport}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
};

export default Reports;