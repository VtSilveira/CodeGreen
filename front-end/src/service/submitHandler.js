import api from "./api";

export const handleSubmit = async (data, setResults) => {
  const res = await api.post("/analyzer", data);
  console.log(res.data);
  setResults(res.data);
};
