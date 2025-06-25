// require('dotenv').config();
// const axios = require('axios');

// import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.formstack.com/api/v2',
  headers: { 'Authorization': `Bearer ${process.env.b7305d010398e68f8f5ab1a048d703ef}` }
});


// GET: Retrieve form data
async function getForm(formId) {
    try {
      const response = await api.get(`/form/${formId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
    }
  }
  
  // POST: Submit form data
  async function submitForm(formId, data) {
    try {
      const response = await api.post(`/form/${formId}/submission`, data);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  
  // PUT: Update form fields
  async function updateField(formId, fieldId, data) {
    try {
      const response = await api.put(`/form/${formId}/field/${fieldId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating field:', error);
    }
  }
  
  // DELETE: Remove form submission
  async function deleteSubmission(submissionId) {
    try {
      await api.delete(`/submission/${submissionId}`);
      console.log('Submission deleted successfully');
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  }

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
      return Promise.reject(error);
    }
  );