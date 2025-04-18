import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const storedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const storedPortfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
    setWatchlist(storedWatchlist);
    setPortfolio(storedPortfolio);
  }, []);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);
    }
  };

  const updatePortfolioQuantity = (symbol, quantity) => {
    if (quantity <= 0) {
      removeFromPortfolio(symbol);
    } else {
      setPortfolio((prev) =>
        prev.map((item) =>
          item.symbol === symbol ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  };

  const addToPortfolio = (symbol, quantity) => {
    const existing = portfolio.find((item) => item.symbol === symbol);
    if (existing) {
      setPortfolio((prev) =>
        prev.map((item) =>
          item.symbol === symbol
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setPortfolio((prev) => [...prev, { symbol, quantity }]);
    }
  };

  const removeFromPortfolio = (symbol) => {
    setPortfolio((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  return (
    <AppContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        portfolio,
        addToPortfolio,
        removeFromPortfolio,
        updatePortfolioQuantity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
