import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { fetchStockDetails } from "../api/stockApi";
import "./WatchlistPage.css";
import { getStockQuote } from "../api/fmpApi";

function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useAppContext();
  const [stockPrices, setStockPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      const results = {};
      for (const symbol of watchlist) {
        const data = await getStockQuote(symbol);
        const latestTime = data["Meta Data"]
          ? Object.keys(data["Time Series (5min)"])[0]
          : null;
        const price = data?.price;
        if (price) {
          results[symbol] = parseFloat(price).toFixed(2);
        }
      }
      setStockPrices(results);
    };

    if (watchlist.length > 0) {
      fetchPrices();
    }
  }, [watchlist]);

  return (
    <div className="watchlist-container">
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="empty-msg">Your watchlist is empty.</p>
      ) : (
        <div className="watchlist-cards">
          {watchlist.map((symbol) => (
            <div key={symbol} className="watchlist-card">
              <Link to={`/stock/${symbol}`} className="symbol-link">
                {symbol}
              </Link>
              <div className="price">
                Price: ${stockPrices[symbol] || "..."}
              </div>
              <button
                onClick={() => removeFromWatchlist(symbol)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistPage;
