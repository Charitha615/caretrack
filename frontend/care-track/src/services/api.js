import { API_BASE_URL, DEFAULT_HEADERS, API_ENDPOINTS } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
      ...options,
    };

    try {
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

  async updateReportStatus(reportId, status, adminNotes = '') {
    return this.request(API_ENDPOINTS.REPORTS.UPDATE_STATUS.replace(':reportId', reportId), {
      method: 'PATCH',
      body: JSON.stringify({ status, adminNotes }),
    });
  }

  async getReportByNumber(reportNumber) {
    return this.request(API_ENDPOINTS.REPORTS.TRACK_REPORT.replace(':reportNumber', reportNumber));
  }

  async updateReportStatusWithMedia(reportId, status, adminNotes = '', formData) {
    return this.request(`/reports/admin/update-status-with-media/${reportId}`, {
      method: 'PATCH',
      body: formData, // Use FormData for file uploads
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
    });
  }

  async getAfterMedia(reportNumber) {
    return this.request(`/reports/after-media/${reportNumber}`);
  }

  async getCompleteReport(reportNumber) {
    return this.request(`/reports/complete-report/${reportNumber}`);
  }
}


export const apiService = new ApiService();