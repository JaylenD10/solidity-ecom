import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Section from './components/Section';
import Product from './components/Product';

// ABIs
import Dappazon from './abis/Dappazon.json';

// Config
import config from './config.json';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [toys, setToys] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [filteredItems, setFilteredItems] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockchainData = async () => {
    // Connect blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    // Connect smart contracts
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon,
      provider
    );
    setDappazon(dappazon);
    // Load products
    const items = [];

    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1);
      items.push(item);
    }
    const electronics = items.filter((item) => item.category === 'electronics');
    const toys = items.filter((item) => item.category === 'toys');
    const clothing = items.filter((item) => item.category === 'clothing');
    const filteredItems = items.filter(
      (item) => item.category === 'clothing' || 'toys' || 'electronics'
    );
    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
    setFilteredItems(filteredItems);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation
        account={account}
        setAccount={setAccount}
        items={filteredItems}
        contract={dappazon}
        setSelectedItem={setSelectedItem}
      />
      <h2>Dappazon Best Sellers</h2>
      {selectedItem && (
        <Section
          title="Search Results"
          items={[selectedItem]}
          togglePop={togglePop}
        />
      )}
      {electronics && clothing && toys && (
        <>
          <Section
            title={'Clothing & Jewelry'}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={'Electronics & Gadgets'}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={'Toys & Gaming'} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          dappazon={dappazon}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;
