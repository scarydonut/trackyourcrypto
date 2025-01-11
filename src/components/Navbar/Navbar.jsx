import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
//import arrow from '../../assets/arrow.png';
import { CoinContext } from '../../context/CoinContext';

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);

const currencyHandler = (event) => {
  switch (event.target.value) {
    case 'usd': {
      setCurrency({ name: 'usd', symbol: '$' });
      break;
    }
    case 'eur': {
      setCurrency({ name: 'eur', symbol: '€' });
      break;
    }
    case 'inr': {
      setCurrency({ name: 'inr', symbol: '₹' });
      break;
    }
    case 'gbp': {
      setCurrency({ name: 'gbp', symbol: '£' });
      break;
    }
    case 'jpy': {
      setCurrency({ name: 'jpy', symbol: '¥' });
      break;
    }
    case 'aud': {
      setCurrency({ name: 'aud', symbol: 'A$' });
      break;
    }
    case 'cad': {
      setCurrency({ name: 'cad', symbol: 'C$' });
      break;
    }
    case 'aed': {
      setCurrency({ name: 'aed', symbol: 'AED' });
      break;
    }
    case 'cny': {
      setCurrency({ name: 'cny', symbol: '¥' });
      break;
    }
    case 'rub': {
      setCurrency({ name: 'rub', symbol: '₽' });
      break;
    }
    case 'zar': {
      setCurrency({ name: 'zar', symbol: 'R' });
      break;
    }
    case 'sgd': {
      setCurrency({ name: 'sgd', symbol: 'S$' });
      break;
    }
    case 'thb': {
      setCurrency({ name: 'thb', symbol: '฿' });
      break;
    }
    default: {
      setCurrency({ name: 'usd', symbol: '$' });
      break;
    }
  }
};

return (
  <div className='navbar'>
    <Link to={'/'}>
        <img src={logo} alt='' className='logo' />
      </Link>
      <ul>
        <Link to={'/'}><li>Home</li></Link>
        <Link to={'/news'}><li>News</li></Link>
        <Link to={'/CryptoTaxCalculator'}><li>CryptoTaxCalculator</li></Link> 
      </ul>
    <div className='nav-right'>
      <select onChange={currencyHandler}>
        <option value='usd'>USD</option>
        <option value='eur'>EUR</option>
        <option value='inr'>INR</option>
        <option value='gbp'>GBP</option>
        <option value='jpy'>JPY</option>
        <option value='aud'>AUD</option>
        <option value='cad'>CAD</option>
        <option value='aed'>AED</option>
        <option value='cny'>CNY</option>
        <option value='rub'>RUB</option>
        <option value='zar'>ZAR</option>       
        <option value='sgd'>SGD</option>
        <option value='thb'>THB</option>
      </select>
    </div>
  </div>
);
};

export default Navbar;
