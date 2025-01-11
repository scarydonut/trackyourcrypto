import React, { useEffect, useState } from 'react';
import './NewsFeed.css';

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://cryptopanic.com/api/free/v1/posts/?auth_token=699513d5fb364836d1a76523ff6fd15c2f22bd2b');
        const data = await response.json();
        console.log(data); // Debugging: Inspect API response
        setNews(data.results || []); // Use 'results' based on API structure
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-feed">
      <h2>Latest Cryptocurrency News</h2>
      <ul>
        {news && news.length > 0 ? (
          news.map((article, index) => (
            <li key={index}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3>{article.title}</h3>
                <p>{article.description || 'No description available.'}</p>
              </a>
            </li>
          ))
        ) : (
          <p>No news available at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default NewsFeed;