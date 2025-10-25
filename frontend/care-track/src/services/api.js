import { API_BASE_URL, DEFAULT_HEADERS, API_ENDPOINTS } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // For FormData, we don't want to set Content-Type header
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        ...(!isFormData && DEFAULT_HEADERS), // Only set default headers for non-FormData requests
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type header for FormData requests
    if (isFormData && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }

    try {
      console.log('API Request:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
      });

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Reports endpoints
  async getReports(page = 1, limit = 10, status = '') {
    let endpoint = `${API_ENDPOINTS.REPORTS.GET_REPORTS}?page=${page}&limit=${limit}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.request(endpoint);
  }

  async getPubReports(page = 1, limit = 10, status = '') {
    let endpoint = `${API_ENDPOINTS.REPORTS.GET_PUB_REPORT}?page=${page}&limit=${limit}`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    return this.request(endpoint);
  }

  async updateReportStatus(reportId, status, adminNotes = '') {
    return this.request(API_ENDPOINTS.REPORTS.UPDATE_STATUS.replace(':reportId', reportId), {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
  }

  async getReportByNumber(reportNumber) {
    return this.request(API_ENDPOINTS.REPORTS.TRACK_REPORT.replace(':reportNumber', reportNumber));
  }

  // FIXED: Update report status with media
  async updateReportStatusWithMedia(reportId, formData) {
    return this.request(`/reports/admin/update-status-with-media/${reportId}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        // Completely empty - let browser set Content-Type with boundary
      },
    });
  }

  async getAfterMedia(reportNumber) {
    return this.request(`/reports/after-media/${reportNumber}`);
  }

  async getCompleteReport(reportNumber) {
    return this.request(`/reports/complete-report/${reportNumber}`);
  }

  // Test endpoint for debugging FormData
  async testFormData(formData) {
    return this.request('/reports/test-formdata', {
      method: 'POST',
      body: formData,
      headers: {
        // No headers for FormData
      },
    });
  }
}

export const apiService = new ApiService();