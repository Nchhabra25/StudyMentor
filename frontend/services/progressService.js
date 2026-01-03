import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.PROGRESS.GET_DASHBOARD
    );

    // 🔥 Return EXACTLY what backend sends
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch data" };
  }
};

const progressService = {
  getDashboardData,
};

export default progressService;
