import axios from "axios";

const api = axios.create({
  baseURL: "https://airtime-backend.onrender.com/api",
});

export default api;
