import axios from "axios";

// Create an axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://learnify-nexus-gpt.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Cache for GET requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Add a request interceptor to include auth token and handle caching
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle caching for GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
        // Return cached response
        return Promise.reject({
          __CACHE__: true,
          data: cachedResponse.data
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors and caching
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.__CACHE__) {
      return Promise.resolve({ data: error.data });
    }

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden access
          console.error("Access forbidden");
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Server error");
          break;
        default:
          console.error("An error occurred");
      }
    }
    return Promise.reject(error);
  }
); 
