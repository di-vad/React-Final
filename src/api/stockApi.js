import axios from "axios";

const API_KEY = "";
const BASE_URL = "https://www.alphavantage.co/query";

export const fetchStockDetails = async (symbol) => {
  const res = await axios.get(BASE_URL, {
    params: {
      function: "TIME_SERIES_INTRADAY",
      symbol,
      interval: "5min",
      apikey: API_KEY,
    },
  });
  return res.data;
};
