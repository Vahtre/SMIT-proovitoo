import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Valuuta } from 'src/requests/ValuutaRequests';
import { getAllValuutas } from 'src/requests/ValuutaRequests';
import ValuutaDropdown from 'src/components/ValuutaDropdown';

const KonverteerimineView: React.FC = () => {
  const [amount, setAmount] = useState<number | string>('1');
  const [currencies, setCurrencies] = useState<Valuuta[]>([]);
  const [toCurrency, setToCurrency] = useState<Valuuta | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    getAllValuutas().then((data) => {
      setCurrencies(data);
    });
  }, []);

  useEffect(() => {
    handleConvert();
    //this should be correct, because we call convertion each time we change something
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, toCurrency, changed]);

  const handleConvert = () => {
    if (toCurrency) {
      const toCurrencyRate = toCurrency.kurss;
      const convertedAmount = changed
        ? (amount as number) / toCurrencyRate
        : (amount as number) * toCurrencyRate;
      setResult(Number(convertedAmount.toFixed(2)));
    }
  };

  const toggleDirection = () => {
    setChanged(!changed);
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <div className="converter">
        <h1 style={{ color: 'blue' }}>Valuuta konverteerija</h1>
        {!changed ? (
          <>
            <div className="input-container">
              <TextField
                type="number"
                placeholder="Sisesta suumma"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ marginBottom: '20px' }}
              />
            </div>

            <div style={{ color: 'red' }}></div>

            <div>
              <ValuutaDropdown
                selectedCurrency={toCurrency}
                onChange={(currency) => {
                  setToCurrency(currency);
                  setResult(null);
                  handleConvert();
                }}
                currencies={currencies}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              style={{
                marginTop: '20px',
                height: '36px',
                fontWeight: 600,
                backgroundColor: 'green',
              }}
              onClick={toggleDirection}
            >
              Vaheta järjekorda
            </Button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <ValuutaDropdown
                selectedCurrency={toCurrency}
                onChange={(currency) => {
                  setToCurrency(currency);
                  setResult(null);
                  handleConvert();
                }}
                currencies={currencies}
              />
            </div>
            <div className="input-container">
              <div style={{ color: 'red' }}></div>
              <TextField
                type="number"
                placeholder="Enter amount"
                value={amount}
                fullWidth
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              style={{
                marginTop: '20px',
                height: '36px',
                fontWeight: 600,
                backgroundColor: 'green',
              }}
              onClick={toggleDirection}
            >
              Vaheta järjekorda
            </Button>
          </>
        )}

        {result !== null && (
          <div className="result-container" style={{ color: 'black' }}>
            {toCurrency !== null && (
              <h2>
                {amount} {changed ? toCurrency.nimetus : 'EUR'} = {result}{' '}
                {changed ? 'EUR' : toCurrency.nimetus}
              </h2>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default KonverteerimineView;
