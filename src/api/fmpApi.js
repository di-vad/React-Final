import axios from "axios";

const BASE_URL = "https://financialmodelingprep.com/api/v3";
const API_KEY = "";

export const getStockQuote = async (symbol) => {
  const res = await axios.get(`${BASE_URL}/quote/${symbol.toUpperCase()}`, {
    params: { apikey: API_KEY },
  });
  return res.data[0];
};

export const searchStocks = async (query) => {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: {
      query,
      limit: 10,
      exchange: "NASDAQ",
      apikey: API_KEY,
    },
  });
  return res.data;
};
