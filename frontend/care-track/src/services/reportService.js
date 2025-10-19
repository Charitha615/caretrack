import { apiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export const reportService = {
  // Report a street dog
  reportStreetDog: async (formData, onUploadProgress = null) => {
    try {
      const response = await apiService.upload(
        API_ENDPOINTS.REPORTS.REPORT_STREET_DOG,
        formData,
        onUploadProgress
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit report' };
    }
  },

  // Get all reports (for authenticated users)
  getReports: async (filters = {}) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.REPORTS.GET_REPORTS, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reports' };
    }
  },

  // Get report by ID
  getReportById: async (reportId) => {
    try {
      const response = await apiService.get(
        API_ENDPOINTS.REPORTS.GET_REPORT_BY_ID.replace(':id', reportId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch report' };
    }
  }
};