
import API from "./axiosInstance";

export const getAllTransactions = async () => {
  const res = await API.get("/transactions");
  return res.data;
};

export const getMyTransactions = async () => {
  const res = await API.get("/transactions/my");
  return res.data;
};
