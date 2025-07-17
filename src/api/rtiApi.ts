import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Update this if your backend is hosted elsewhere
  headers: {
    Accept: 'application/json',
  },
});

// Upload PDF for analysis
export const analyzeFromUpload = async (file: File, department: string, year: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('department', department);
  formData.append('year', year);
  const response = await api.post('/analyze-from-upload', formData);
  return response.data;
};

// Scrape URL for analysis
export const analyzeFromUrl = async (url: string, department: string, year: string) => {
  const response = await api.post('/analyze-from-url', {
    url,
    department,
    year,
  });
  return response.data;
};

// Edit Draft using LLM
export const editDraft = (payload: {
  instruction: string;
  language: string;
  current_draft: string;
}) => {
  return api.post('/edit-draft', payload); // Changed to use the shared `api` instance
};

// Finalize and Send RTI
export const finalizeRTI = async (
  final_draft: string,
  department: string,
  year: string,
  pio_email?: string,
  location?: string,
  language: string = 'en'
) => {
  const response = await api.post('/finalize-and-send', {
    final_draft,
    department,
    year,
    pio_email,
    location,
    language,
  });
  return response.data;
};

// Get RTI Drafts List
export const getRTIList = async () => {
  const response = await api.get('/rtis');
  return response.data;
};

// Download RTI File
export const downloadRTI = async (filename: string) => {
  const response = await api.get(`/rtis/${filename}`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
};

// ✅ FIXED: Find Nearby RTI Offices (now using POST instead of GET)
export const findOffices = async (location: string, department: string) => {
  const response = await api.post('/find-offices', {
    location,
    department,
  });
  return response;
};

