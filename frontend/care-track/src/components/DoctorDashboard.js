import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', adminNotes: '' });
  const [afterImages, setAfterImages] = useState(null);
  const [afterVideos, setAfterVideos] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filters, setFilters] = useState({ status: '', page: 1, limit: 10 });

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [filters.status, filters.page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReports(filters.page, filters.limit, filters.status);

      if (response.success) {
        setReports(response.data.reports);
      }
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId) => {
    if (!statusUpdate.status) {
      setError('Status is required');
      return;
    }

    try {
      setUpdating(true);
      setError('');

      // Check if we need to use the media upload endpoint
      const hasAfterMedia = (statusUpdate.status === 'released' || statusUpdate.status === 'closed') &&
        (afterImages?.length > 0 || afterVideos?.length > 0);

      let response;

      if (hasAfterMedia) {
        // Use the media upload endpoint
        const formData = new FormData();
        formData.append('status', statusUpdate.status);
        
        if (statusUpdate.adminNotes) {
          formData.append('adminNotes', statusUpdate.adminNotes);
        }

        // Append after images
        if (afterImages && afterImages.length > 0) {
          for (let i = 0; i < afterImages.length; i++) {
            formData.append('afterImages', afterImages[i]);
          }
        }

        // Append after videos
        if (afterVideos && afterVideos.length > 0) {
          for (let i = 0; i < afterVideos.length; i++) {
            formData.append('afterVideos', afterVideos[i]);
          }
        }

        console.log('Sending form data with status:', statusUpdate.status);
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ', pair[1]);
        }

        response = await apiService.updateReportStatusWithMedia(reportId, formData);
      } else {
        // Use regular status update endpoint
        console.log('Sending regular update with status:', statusUpdate.status);
        response = await apiService.updateReportStatus(
          reportId,
          statusUpdate.status,
          statusUpdate.adminNotes || ''
        );
      }

      if (response.success) {
        await fetchReports(); // Refresh the list
        setSelectedReport(null);
        setStatusUpdate({ status: '', adminNotes: '' });
        setAfterImages(null);
        setAfterVideos(null);
        setError('');
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      under_review: 'status-under-review',
      released: 'status-released',
      closed: 'status-closed'
    };
    return statusClasses[status] || 'status-pending';
  };

  const getUrgencyBadgeClass = (urgency) => {
    const urgencyClasses = {
      low: 'urgency-low',
      medium: 'urgency-medium',
      high: 'urgency-high',
      critical: 'urgency-critical'
    };
    return urgencyClasses[urgency] || 'urgency-medium';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileSelection = (files, setter, maxFiles) => {
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    setter(Array.from(files)); // Convert FileList to Array
    setError('');
  };

  const clearAfterMedia = () => {
    setAfterImages(null);
    setAfterVideos(null);
  };

  const handleStatusChange = (newStatus) => {
    setStatusUpdate({ ...statusUpdate, status: newStatus });
    // Clear media when status changes to non-released/closed
    if (newStatus !== 'released' && newStatus !== 'closed') {
      clearAfterMedia();
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <i className="fas fa-paw"></i>
              <span>CareTrack</span>
            </div>
            <h1>Doctor Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <i className="fas fa-user-md"></i>
              <span>Dr. {user?.email}</span>
            </div>
            <button onClick={logout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-reports">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-info">
              <h3>Total Reports</h3>
              <p className="stat-number">{reports.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-reports">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h3>Pending</h3>
              <p className="stat-number">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon under-review">
              <i className="fas fa-search"></i>
            </div>
            <div className="stat-info">
              <h3>Under Review</h3>
              <p className="stat-number">
                {reports.filter(r => r.status === 'under_review').length}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>Completed</h3>
              <p className="stat-number">
                {reports.filter(r => r.status === 'closed').length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="filter-select"
            >
              <option value="">All Reports</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="released">Released</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button onClick={fetchReports} className="refresh-btn">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        {/* Reports Table */}
        <div className="reports-section">
          <h2>Street Dog Reports</h2>

          {error && (
            <div className="error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report #</th>
                  <th>Reporter</th>
                  <th>Location</th>
                  <th>Dog Count</th>
                  <th>Condition</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td className="report-number">
                      <strong>{report.reportNumber}</strong>
                    </td>
                    <td>
                      <div className="reporter-info">
                        <strong>{report.reporterName}</strong>
                        <span>{report.reporterContact}</span>
                      </div>
                    </td>
                    <td>{report.reportLocation}</td>
                    <td>
                      <span className="dog-count">{report.dogCount}</span>
                    </td>
                    <td>
                      <span className={`condition-badge ${report.dogCondition}`}>
                        {report.dogCondition}
                      </span>
                    </td>
                    <td>
                      <span className={`urgency-badge ${getUrgencyBadgeClass(report.urgencyLevel)}`}>
                        {report.urgencyLevel}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setStatusUpdate({ 
                              status: report.status, 
                              adminNotes: report.adminNotes || '' 
                            });
                            clearAfterMedia();
                          }}
                          className="action-btn update-btn"
                          title="Update Status"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reports.length === 0 && !loading && (
              <div className="no-reports">
                <i className="fas fa-inbox"></i>
                <h3>No reports found</h3>
                <p>There are no reports matching your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Report Details - {selectedReport.reportNumber}</h2>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setStatusUpdate({ status: '', adminNotes: '' });
                  clearAfterMedia();
                }}
                className="close-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Reporter Information</h3>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedReport.reporterName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedReport.reporterEmail}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact:</label>
                    <span>{selectedReport.reporterContact}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address:</label>
                    <span>{selectedReport.reporterAddress || 'Not provided'}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Incident Details</h3>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedReport.reportLocation}</span>
                  </div>
                  <div className="detail-item">
                    <label>Coordinates:</label>
                    <span>{selectedReport.latitude}, {selectedReport.longitude}</span>
                  </div>
                  <div className="detail-item">
                    <label>Description:</label>
                    <span>{selectedReport.description}</span>
                  </div>
                  <div className="detail-item">
                    <label>Additional Notes:</label>
                    <span>{selectedReport.additionalNotes || 'None'}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Dog Information</h3>
                  <div className="detail-item">
                    <label>Dog Count:</label>
                    <span>{selectedReport.dogCount}</span>
                  </div>
                  <div className="detail-item">
                    <label>Condition:</label>
                    <span className={`condition-badge ${selectedReport.dogCondition}`}>
                      {selectedReport.dogCondition}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Urgency:</label>
                    <span className={`urgency-badge ${getUrgencyBadgeClass(selectedReport.urgencyLevel)}`}>
                      {selectedReport.urgencyLevel}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Status Information</h3>
                  <div className="detail-item">
                    <label>Current Status:</label>
                    <span className={`status-badge ${getStatusBadgeClass(selectedReport.status)}`}>
                      {selectedReport.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Reported:</label>
                    <span>{formatDate(selectedReport.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated:</label>
                    <span>{formatDate(selectedReport.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Form with After Media Upload */}
              <div className="status-update-form">
                <h3>Update Status</h3>

                {/* Show media upload only for released/closed status */}
                {(statusUpdate.status === 'released' || statusUpdate.status === 'closed') && (
                  <div className="media-upload-section">
                    <h4>Upload After Media (Optional)</h4>
                    <p className="upload-description">
                      Show the current condition of the dog(s) with photos and videos.
                      These will be visible to the reporter.
                    </p>

                    <div className="file-upload-group">
                      <label>After Images (Max 5):</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileSelection(e.target.files, setAfterImages, 5)}
                        className="file-input"
                      />
                      <small>Upload images showing the current condition</small>
                      {afterImages && afterImages.length > 0 && (
                        <div className="file-preview">
                          <span>{afterImages.length} image(s) selected</span>
                          <button
                            type="button"
                            onClick={() => setAfterImages(null)}
                            className="clear-files-btn"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="file-upload-group">
                      <label>After Videos (Max 2):</label>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={(e) => handleFileSelection(e.target.files, setAfterVideos, 2)}
                        className="file-input"
                      />
                      <small>Upload videos showing the current condition</small>
                      {afterVideos && afterVideos.length > 0 && (
                        <div className="file-preview">
                          <span>{afterVideos.length} video(s) selected</span>
                          <button
                            type="button"
                            onClick={() => setAfterVideos(null)}
                            className="clear-files-btn"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>New Status:</label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="status-select"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="released">Released</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Admin Notes:</label>
                    <textarea
                      value={statusUpdate.adminNotes}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, adminNotes: e.target.value })}
                      placeholder="Add notes about the status update..."
                      rows="3"
                      className="notes-textarea"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    onClick={() => handleStatusUpdate(selectedReport._id)}
                    disabled={!statusUpdate.status || updating}
                    className="update-status-btn"
                  >
                    {updating ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Update Status
                      </>
                    )}
                  </button>

                  {(afterImages || afterVideos) && (
                    <button
                      type="button"
                      onClick={clearAfterMedia}
                      className="clear-media-btn"
                    >
                      Clear Media
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;