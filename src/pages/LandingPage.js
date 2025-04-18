import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import axios from "axios";
import { searchStocks } from "../api/fmpApi";

const ALPHA_VANTAGE_API_KEY = "ADQP95B7YDPG32Z4";
const MARKET_AUX_API_KEY = "jSLvBsd6SBhuXqFRdRJFDHPyuLvwmn6XxfzJqHat";

function LandingPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [news, setNews] = useState([]);

  const handleSearch = async () => {
    try {
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (err) {
      console.error("FMP search failed:", err);
      setSearchResults([]);
    }
  };

  const fetchMarketNews = async () => {
    try {
      const res = await axios.get("https://api.marketaux.com/v1/news/all", {
        params: {
          api_token: MARKET_AUX_API_KEY,
          symbols: "AAPL,TSLA,GOOGL",
          limit: 5,
          published_after: "2024-01-01",
        },
      });
      setNews(res.data.data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  useEffect(() => {
    fetchMarketNews();
  }, []);

  return (
    <div className="landing-page-container">
      <h1>Stock Project</h1>
      <div>
        <input
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul>
        {searchResults.map((stock) => (
          <li key={stock.symbol}>
            <Link to={`/stock/${stock.symbol}`}>
              {stock.name} ({stock.symbol})
            </Link>
          </li>
        ))}
      </ul>

      <div className="landing-bottom-half">
        <div>
          <h2>Popular Stocks</h2>
          <ul>
            <li>
              <Link to="/stock/AAPL">Apple (AAPL)</Link>
            </li>
            <li>
              <Link to="/stock/GOOGL">Google (GOOGL)</Link>
            </li>
            <li>
              <Link to="/stock/TSLA">Tesla (TSLA)</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2>Latest News</h2>
          <ul>
            {news.length === 0 ? (
              <li>Loading news...</li>
            ) : (
              news.map((article) => (
                <li key={article.uuid}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
