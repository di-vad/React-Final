import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStockDetails } from "../api/stockApi";
import { useAppContext } from "../context/AppContext";
import StockChat from "../components/StockChat";
import "./StockDetailsPage.css";
import { getStockQuote } from "../api/fmpApi";

function StockDetailsPage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const { addToWatchlist, addToPortfolio } = useAppContext();

  useEffect(() => {
    const loadData = async () => {
      const data = await getStockQuote(symbol);
      setStockData(data);
    };
    loadData();
  }, [symbol]);

  const price = stockData?.price;

  return (
    <div className="stock-details-container">
      <h1>{symbol} Details</h1>

      {price ? (
        <div className="stock-card">
          <p className="price">
            Latest Price: <strong>${parseFloat(price).toFixed(2)}</strong>
          </p>
          <div className="action-buttons">
            <button
              className="watchlist-btn"
              onClick={() => addToWatchlist(symbol)}
            >
              Add to Watchlist
            </button>
            <button
              className="portfolio-btn"
              onClick={() => addToPortfolio(symbol, 1)}
            >
              Add to Portfolio
            </button>
          </div>
        </div>
      ) : (
        <p>Loading stock data...</p>
      )}

      <div className="news-section">
        <h2>Related News</h2>
        <ul>
          <li>{symbol} breaks resistance at $200</li>
          <li>Analysts forecast strong Q2 earnings</li>
        </ul>
      </div>

      <div className="chat-section">
        <h3>Chat about {symbol}</h3>
        <StockChat room={symbol} />
      </div>
    </div>
  );
}

export default StockDetailsPage;
