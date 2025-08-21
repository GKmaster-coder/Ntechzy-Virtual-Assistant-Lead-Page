import axios from "axios";

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/submit`, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
};