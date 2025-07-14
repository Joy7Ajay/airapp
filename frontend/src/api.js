const API_URL = 'http://127.0.0.1:5001/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

export const login = async (credentials) => {
  // Note: The backend doesn't have a login endpoint yet.
  // This is a placeholder for now.
  // In a real app, this would return a token.
  const token = 'fake-jwt-token'; // Replace with actual API call
  localStorage.setItem('authToken', token);
  return { token };
  // return await apiRequest('/login', 'POST', credentials);
};

export const signup = async (userData) => {
    // Note: The backend doesn't have a signup endpoint yet.
    // This is a placeholder for now.
    const token = 'fake-jwt-token'; // Replace with actual API call
    localStorage.setItem('authToken', token);
    return { token };
    // return await apiRequest('/signup', 'POST', userData);
};


export const getPassengerPrediction = (historicalData) => {
  return apiRequest('/predict', 'POST', { historical_data: historicalData });
};

export const getAnomalies = (data) => {
  return apiRequest('/detect_anomalies', 'POST', data);
};

export const getInsights = (kpiData) => {
  return apiRequest('/generate_insights', 'POST', { kpi_data: kpiData });
};

export const countPassengers = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return fetch(`${API_URL}/count_passengers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: formData,
  }).then(response => response.json());
};