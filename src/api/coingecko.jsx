import axios from "axios";
import moment from "moment";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const API_KEY = "CG-ttM9rCtJXffS1wTCtJVidrXf";

export const fetchCryptoPriceHistory = async (id, date) => {
  const formattedDateString = moment(date, "YYYY-MM-DD").format("DD-MM-YYYY");

  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/${id}/history?date=${formattedDateString}`,
      {
        headers: {
          "x-cg-demo-api-key": API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto prices", error);
    throw error;
  }
};

export const fetchCryptoCoins = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets?vs_currency=usd`, {
      headers: {
        "x-cg-demo-api-key": API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching crypto prices", error);
    throw error;
  }
};