// API Base URL configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  REPORTS: {
    REPORT_STREET_DOG: '/reports/report-street-dog',
    GET_REPORTS: '/reports/admin/reports',
    GET_PUB_REPORT:'/reports/public/reports',
    GET_REPORT_BY_ID: '/reports/:id',
    UPDATE_STATUS: '/reports/admin/update-status/:reportId',
    TRACK_REPORT: '/reports/track-report/:reportNumber'
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  }
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API Service configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3
};