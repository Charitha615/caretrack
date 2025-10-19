import React, { useState } from 'react';
import { reportService } from '../services/reportService';
import './ReportForm.css';

const ReportForm = () => {
    const [formData, setFormData] = useState({
        reporterName: '',
        reporterEmail: '',
        reporterContact: '',
        reporterAddress: '',
        reportLocation: '',
        latitude: '',
        longitude: '',
        description: '',
        dogCount: 1,
        dogCondition: 'unknown',
        urgencyLevel: 'medium',
        additionalNotes: ''
    });
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleVideoChange = (e) => {
        setVideos(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setUploadProgress(0);

        try {
            const submitData = new FormData();
            
            // Append form data
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });
            
            // Append images
            images.forEach(image => {
                submitData.append('images', image);
            });
            
            // Append videos
            videos.forEach(video => {
                submitData.append('videos', video);
            });

            const response = await reportService.reportStreetDog(
                submitData,
                (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                }
            );

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: `Report submitted successfully! Reference Number: ${response.data.report.reportNumber}`,
                    reportNumber: response.data.report.reportNumber
                });
                resetForm();
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Submission failed. Please try again.'
            });
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setFormData({
            reporterName: '',
            reporterEmail: '',
            reporterContact: '',
            reporterAddress: '',
            reportLocation: '',
            latitude: '',
            longitude: '',
            description: '',
            dogCount: 1,
            dogCondition: 'unknown',
            urgencyLevel: 'medium',
            additionalNotes: ''
        });
        setImages([]);
        setVideos([]);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setMessage({ type: 'info', text: 'Getting your location...' });
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }));
                    setMessage({ type: 'success', text: 'Location captured successfully!' });
                },
                (error) => {
                    let errorMessage = 'Failed to get location. ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Please enable location permissions.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        default:
                            errorMessage += 'An unknown error occurred.';
                    }
                    setMessage({ type: 'error', text: errorMessage });
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );
        } else {
            setMessage({ type: 'error', text: 'Geolocation is not supported by this browser.' });
        }
    };

    return (
        <div className="report-form-container">
            <div className="report-form-wrapper">
                <div className="form-header">
                    <h1>Report a Street Dog in Need</h1>
                    <p>Help us save lives by reporting street dogs that need medical attention or care</p>
                </div>

                {message && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                        {message.reportNumber && (
                            <div className="reference-number">
                                Reference: <strong>{message.reportNumber}</strong>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="report-form">
                    {/* Personal Information Section */}
                    <div className="form-section">
                        <h3>Your Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="reporterName"
                                    value={formData.reporterName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="reporterEmail"
                                    value={formData.reporterEmail}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contact Number *</label>
                                <input
                                    type="tel"
                                    name="reporterContact"
                                    value={formData.reporterContact}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Address</label>
                                <input
                                    type="text"
                                    name="reporterAddress"
                                    value={formData.reporterAddress}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Information Section */}
                    <div className="form-section">
                        <h3>Dog Location</h3>
                        <div className="form-group">
                            <label>Location Description *</label>
                            <input
                                type="text"
                                name="reportLocation"
                                value={formData.reportLocation}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Near Central Park, behind McDonald's, etc."
                            />
                        </div>

                        <div className="location-coordinates">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Latitude</label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        placeholder="Auto-detected or enter manually"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Longitude</label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        placeholder="Auto-detected or enter manually"
                                    />
                                </div>
                            </div>
                            <button 
                                type="button" 
                                className="location-btn"
                                onClick={getCurrentLocation}
                            >
                                📍 Use My Current Location
                            </button>
                        </div>
                    </div>

                    {/* Dog Information Section */}
                    <div className="form-section">
                        <h3>Dog Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Number of Dogs *</label>
                                <select
                                    name="dogCount"
                                    value={formData.dogCount}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Dog Condition *</label>
                                <select
                                    name="dogCondition"
                                    value={formData.dogCondition}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="unknown">Unknown</option>
                                    <option value="healthy">Healthy</option>
                                    <option value="injured">Injured</option>
                                    <option value="sick">Sick</option>
                                    <option value="malnourished">Malnourished</option>
                                    <option value="critical">Critical Condition</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Urgency Level *</label>
                                <select
                                    name="urgencyLevel"
                                    value={formData.urgencyLevel}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="low">Low - Monitoring needed</option>
                                    <option value="medium">Medium - Requires attention</option>
                                    <option value="high">High - Urgent care needed</option>
                                    <option value="critical">Critical - Emergency</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                placeholder="Please describe the dog's condition, behavior, appearance, and any visible injuries or issues..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Additional Notes</label>
                            <textarea
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Any other important information..."
                            />
                        </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="form-section">
                        <h3>Photos & Videos</h3>
                        <div className="form-row">
                            <div className="form-group file-upload">
                                <label>Upload Photos</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <small>Maximum 10 photos. Supported formats: JPG, PNG, WebP</small>
                                {images.length > 0 && (
                                    <div className="file-preview">
                                        <strong>{images.length} photo(s) selected</strong>
                                    </div>
                                )}
                            </div>

                            <div className="form-group file-upload">
                                <label>Upload Videos</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                />
                                <small>Maximum 5 videos. Supported formats: MP4, MOV, AVI</small>
                                {videos.length > 0 && (
                                    <div className="file-preview">
                                        <strong>{videos.length} video(s) selected</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload Progress */}
                    {loading && uploadProgress > 0 && (
                        <div className="upload-progress">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <span>Uploading: {uploadProgress}%</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Submitting Report...
                                </>
                            ) : (
                                'Submit Report'
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            className="reset-btn"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Reset Form
                        </button>
                    </div>
                </form>

                <div className="form-footer">
                    <p>
                        <strong>Note:</strong> Our team will review your report and take appropriate action. 
                        For emergencies, please call our helpline: <strong>+1-800-CARE-DOG</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportForm;