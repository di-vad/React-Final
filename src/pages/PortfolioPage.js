import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { fetchStockDetails } from "../api/stockApi";
import { Link } from "react-router-dom";
import "./PortfolioPage.css";
import { getStockQuote } from "../api/fmpApi";

function PortfolioPage() {
  const { portfolio, removeFromPortfolio, updatePortfolioQuantity } =
    useAppContext();

  const [prices, setPrices] = useState({});
  const [editedQuantities, setEditedQuantities] = useState({});

  useEffect(() => {
    const loadPrices = async () => {
      const result = {};
      for (const { symbol } of portfolio) {
        const data = await getStockQuote(symbol);
        const latestTime = data["Meta Data"]
          ? Object.keys(data["Time Series (5min)"])[0]
          : null;
        const price = data?.price;
        if (price) {
          result[symbol] = parseFloat(price).toFixed(2);
        }
      }
      setPrices(result);
    };

    if (portfolio.length > 0) {
      loadPrices();
    }
  }, [portfolio]);

  const handleQuantityChange = (symbol, newQty) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [symbol]: newQty,
    }));
  };

  const handleUpdateClick = (symbol) => {
    const qty = parseInt(editedQuantities[symbol]);
    if (!isNaN(qty)) {
      updatePortfolioQuantity(symbol, qty);
    }
  };

  const getTotalValue = (symbol, quantity) => {
    const price = prices[symbol];
    return price ? (price * quantity).toFixed(2) : "...";
  };

  return (
    <div className="portfolio-container">
      <h1>My Portfolio</h1>
      {portfolio.length === 0 ? (
        <p className="empty-msg">Your portfolio is empty.</p>
      ) : (
        <div className="portfolio-cards">
          {portfolio.map(({ symbol, quantity }) => (
            <div key={symbol} className="portfolio-card">
              <Link to={`/stock/${symbol}`} className="symbol-link">
                {symbol}
              </Link>
              <div className="portfolio-info">
                <p>
                  Current Quantity: <strong>{quantity}</strong>
                </p>
                <div className="edit-qty-row">
                  <input
                    type="number"
                    min="0"
                    value={editedQuantities[symbol] ?? quantity}
                    onChange={(e) =>
                      handleQuantityChange(symbol, e.target.value)
                    }
                  />
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateClick(symbol)}
                  >
                    Update
                  </button>
                </div>
                <p>
                  Price: <strong>${prices[symbol] || "..."}</strong>
                </p>
                <p>
                  Total: <strong>${getTotalValue(symbol, quantity)}</strong>
                </p>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromPortfolio(symbol)}
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

export default PortfolioPage;
