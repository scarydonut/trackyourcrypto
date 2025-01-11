import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { fetchCryptoCoins, fetchCryptoPriceHistory } from "../../api/coingecko";
import { CoinContext } from "../../context/CoinContext";

const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 500px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
  color: black;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
  color: black;
`;

const Input = styled.input`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
`;

const Select = styled.select`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
`;

const Result = styled.h2`
  margin-top: 20px;
  font-size: 1.5em;
  color: black;
`;

const Calculator = () => {
  const { currency } = useContext(CoinContext);
  const [buyDate, setBuyDate] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [fees, setFees] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [totalGainOrLoss, setTotalGainOrLoss] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [totalCapitalGainsTax, setTotalCapitalGainsTax] = useState(0);
  const [taxOwed, setTaxOwed] = useState(0);
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState({});
  const [historicalPrices, setHistoricalPrices] = useState({
    buyPrice: 0,
    sellPrice: 0,
  });
  const [buyQuantity, setBuyQuantity] = useState(0);
  const [sellQuantity, setSellQuantity] = useState(0);

  useEffect(() => {
    const fetchCryptoAssets = async () => {
      try {
        const response = await fetchCryptoCoins();
        if (response) {
          setCoins(response);
          setSelectedCoin(response[0]); // Default to the first asset
        } else {
          throw new Error("Failed to fetch crypto assets");
        }
      } catch (error) {
        console.error("Error fetching crypto assets:", error);
      }
    };
    fetchCryptoAssets();
  }, []);

  useEffect(() => {
    const fetchHistoricalPrices = async () => {
      if (!selectedCoin.id || !buyDate || !sellDate) return;

      try {
        const buyPriceResponse = await fetchCryptoPriceHistory(
          selectedCoin.id,
          buyDate
        );
        const sellPriceResponse = await fetchCryptoPriceHistory(
          selectedCoin.id,
          sellDate
        );

        const buyPrice =
        buyPriceResponse?.market_data?.current_price?.usd ?? 0;
      const sellPrice =
        sellPriceResponse?.market_data?.current_price?.usd ?? 0;

      setHistoricalPrices({
        buyPrice,
        sellPrice,
      });
    } catch (error) {
      console.error("Error fetching historical prices:", error);
      setHistoricalPrices({
        buyPrice: 0,
        sellPrice: 0,
      });
    }
  };

    fetchHistoricalPrices();
  }, [selectedCoin, buyDate, sellDate]);

  useEffect(() => {
    calculateGainLoss();
  }, [historicalPrices, fees, buyQuantity, sellQuantity]);

  useEffect(() => {
    calculateTax();
  }, [totalGainOrLoss, annualIncome, taxRate]);

  const calculateGainLoss = () => {
    const { buyPrice, sellPrice } = historicalPrices;
    if (!buyPrice || !sellPrice || buyQuantity <= 0 || sellQuantity <= 0) {
      setTotalGainOrLoss(0);
      return;
    }

    const buyTotal = buyPrice * buyQuantity;
    const sellTotal = sellPrice * sellQuantity;
    const gainLoss = sellTotal - buyTotal - fees;

    setTotalGainOrLoss(parseFloat(gainLoss.toFixed(2)));
  };

  const calculateTax = () => {
    if (totalGainOrLoss <= 0) {
      setTotalCapitalGainsTax(0);
      setTaxOwed(0);
      return;
    }

    let taxPercentage = 0;
    if (annualIncome > 18200) {
      taxPercentage = 19;
      if (annualIncome > 45001) {
        taxPercentage = 32.5;
      }
      if (annualIncome > 120001) {
        taxPercentage = 37;
      }
      if (annualIncome > 180001) {
        taxPercentage = 45;
      }
    }

    setTaxRate(taxPercentage);

    let totalTax = (totalGainOrLoss * taxPercentage) / 100;
    setTotalCapitalGainsTax(parseFloat(totalTax.toFixed(2)));

    // Assume some deductions or adjustments for simplicity
    const deductions = 1000; // Example deduction
    const adjustedTax = totalTax - deductions;
    setTaxOwed(Math.max(0, adjustedTax.toFixed(2))); // Tax owed can't be negative
  };

  const handleAssetChange = (e) => {
    const selectedCoinId = e.target.value;
    const selectedCoinData = coins.find((coin) => coin.id === selectedCoinId);
    setSelectedCoin(selectedCoinData || {});
  };

  const handleBuyDateChange = (e) => {
    setBuyDate(e.target.value);
  };

  const handleSellDateChange = (e) => {
    setSellDate(e.target.value);
  };

  const handleBuyQuantityChange = (e) => {
    setBuyQuantity(e.target.value);
  };

  const handleSellQuantityChange = (e) => {
    setSellQuantity(e.target.value);
  };

  const convertCurrency = (amount) => {
    const rates = {
      usd: 1,
      eur: 0.96,
      inr: 85.16,
      gbp: 0.80,
      jpy: 157.30,
      aud: 1.61,
      cad: 1.44,
      aed: 3.67,
      cny: 7.30,
      rub: 100.00,
      zar: 18.68,
      sgd: 1.36,
      thb: 34.14,
    };
    return (amount * rates[currency.name]).toFixed(2);
  };

  return (
    <CalculatorContainer>
      <Title>Crypto Tax Calculator</Title>
      <Label>
        Select Asset:
        <Select value={selectedCoin.id} onChange={handleAssetChange}>
          {coins.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </Select>
      </Label>
      {selectedCoin.current_price && (
        <Result>Current Price: {currency.symbol}{convertCurrency(selectedCoin.current_price)}</Result>
      )}
      <Label>
        Buy Date:
        <Input
          type="date"
          value={buyDate}
          onChange={handleBuyDateChange}
          placeholder="Buy Date"
        />
      </Label>
      <Label>
        Sell Date:
        <Input
          type="date"
          value={sellDate}
          onChange={handleSellDateChange}
          placeholder="Sell Date"
        />
      </Label>
      <Label>
        Buy Quantity:
        <Input
          type="number"
          min={0}
          value={buyQuantity}
          onChange={handleBuyQuantityChange}
          placeholder="Buy Quantity"
        />
      </Label>
      <Label>
        Sell Quantity:
        <Input
          type="number"
          min={0}
          value={sellQuantity}
          onChange={handleSellQuantityChange}
          placeholder="Sell Quantity"
        />
      </Label>
      <Label>
        Annual Income:
        <Input
          type="number"
          min={0}
          value={annualIncome}
          onChange={(e) => setAnnualIncome(e.target.value)}
          placeholder="Annual Income"
        />
      </Label>
      <Label>
        Fees:
        <Input
          type="number"
          min={0}
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          placeholder="Fees"
        />
      </Label>
      <Result>Total Gain or Loss: {currency.symbol}{convertCurrency(totalGainOrLoss)} </Result>
      <Result>Tax Rate: {taxRate}%</Result>
      <Result>Total Capital Gains Tax You Will Pay: {currency.symbol}{convertCurrency(totalCapitalGainsTax)} </Result>
      <Result>Tax Owed: {currency.symbol}{convertCurrency(taxOwed)} </Result>
    </CalculatorContainer>
  );
};

export default Calculator;