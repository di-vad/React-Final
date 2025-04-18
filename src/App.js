import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StockDetailsPage from "./pages/StockDetailsPage";
import WatchlistPage from "./pages/WatchlistPage";
import PortfolioPage from "./pages/PortfolioPage";
import ChatPage from "./pages/ChatPage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/stock/:symbol" element={<StockDetailsPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
