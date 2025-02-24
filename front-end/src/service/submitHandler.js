import api from "./api";

export const handleSubmit = async (data, setResults, setLoading) => {
  try {
    setLoading(true);
    const res = await api.post("/analyzer", data);
    setResults(res.data);
    setLoading(false);
  } catch (error) {
    console.error("Error during submission:", error);
    setResults(null);
  }
};
