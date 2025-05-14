import { useState } from 'react';

const SearchBar = ({ contract, items, setSelectedItem }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(true);

  const handleSearch = async (event) => {
    setQuery(event.target.value);

    if (contract) {
      try {
        const filteredResults = items.filter((item) =>
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setResults(filteredResults);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
  };

  const handleSelectItem = (item) => {
    setQuery(item.name);
    setResults([]);
    setShowResults(false);
    setSelectedItem({ ...item });
  };

  return (
    <div className="nav__searchContainer">
      <input
        type="text"
        className="nav__search"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
      />
      <ul className="nav__results">
        {results.map((item, index) => (
          <li key={index} onClick={() => handleSelectItem(item)}>
            {item.name} - {item.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
