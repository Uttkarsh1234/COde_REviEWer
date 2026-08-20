const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('buglens_token') || '';
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('buglens_token', token);
    } else {
      localStorage.removeItem('buglens_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Allows cookie transmission
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP error! Status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the backend server. Please make sure the backend is running at http://localhost:5000.');
      }
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    return this.request('/health', { method: 'GET' });
  }

  // Auth Endpoints
  async register(name, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  getGoogleAuthUrl() {
    return `${this.baseUrl}/auth/google/callback`;
  }

  // Review & Debug Endpoints
  async reviewCode(code, language) {
    return this.request('/input', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }

  // History Endpoints
  async getReviews() {
    return this.request('/review', { method: 'GET' });
  }

  async getReviewById(id) {
    return this.request(`/review/${id}`, { method: 'GET' });
  }

  async deleteReview(id) {
    return this.request(`/review/delete/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
