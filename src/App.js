import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Header from './components/Header';
import Options from './components/Options';
import CoinListing from './components/CoinListing';
import useLocalStorage from './hooks/useLocalStorage';


const App = () => {
  const [coins, setCoins] = useState([]);
  const [limit, setLimit] = useLocalStorage(100, "limit");
  const [currency, setCurrency] = useLocalStorage("GBP", "currency");
  const [orderBy, setOrderBy] = useLocalStorage("current_price", "orderBy");

  useEffect(() => {
    const makeRequest = async () => {
      const n_pages = limit / 100;
      let data = [];

      for (let page = 1; page <= n_pages; ++page) {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?page=${page}&vs_currency=${currency}&per_page=100&&sparkline=false`);
        const results = await response.json();

        data.push(...results);
      }
      data.sort((e1, e2) => e2[orderBy] - e1[orderBy])
      setCoins(data);
    }

    makeRequest();
  }, [limit, currency, orderBy]);

  return (
    <div className="App">
      <Stack spacing={2}>
          <Header/>
          <Options 
            limit={limit} 
            handleLimit={(val) => setLimit(val)}
            currency={currency}
            handleCurrency={(val) => setCurrency(val)}
            orderBy={orderBy}
            handleOrderBy={(val) => setOrderBy(val)}
          />
          <CoinListing coins={coins}/>
      </Stack>
    </div>
  );
}

export default App;