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

export const EmployeUsersById = async (id_users: number) => {
  try {
    const response = await api.get(`/employee/${id_users}`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    if (err instanceof Error) return { user: null, error: err.message };
    return { user: null, error: "Unknown error" };
  }
};