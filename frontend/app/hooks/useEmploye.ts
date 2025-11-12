import api from "../utils/axiosAuth";

export const EmployeUsers = async () => {
  try {
    const response = await api.get("/employee");
    return response.data;
  } catch (err) {
    if (err instanceof Error) return { user: null, error: err.message };
    return { user: null, error: "Unknown error" };
  }
};