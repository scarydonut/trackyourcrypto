import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Coin from './pages/Coin/Coin';
import Footer from './components/Navbar/Footer/Footer';
import NewsFeed from './components/NewsFeed/NewsFeed';
import Calculator from './components/Calculator/Calculator'; // Import Calculator component

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coin/:coinId' element={<Coin />} />
        <Route path='/news' element={<NewsFeed />} />
        <Route path='/CryptoTaxCalculator' element={<Calculator />} /> {/* Add Calculator route */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;