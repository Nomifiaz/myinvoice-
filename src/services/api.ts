import axios from "axios";

const API_BASE_URL = "http://localhost:5010/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data: any) => api.post("/register", data),
  login: (data: any) => api.post("/login", data),
};

export const businessService = {
  getBusiness: () => api.get("/businesses"),
  registerBusiness: (data: any) => api.post("/businesses", data),
};

export const productService = {
  getProducts: () => api.get("/getProduct"),
  addProduct: (data: any) => api.post("/add", data),
};

export const invoiceService = {
  getInvoices: () => api.get("/invoice"),
  getInvoiceById: (id: string | number) => api.get(`/invoice/${id}`),
  createInvoice: (data: any) => api.post("/invoice", data),
};

export default api;
