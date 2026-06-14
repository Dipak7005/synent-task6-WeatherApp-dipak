import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, cities = [] }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Keyboard shortcut: Pressing '/' focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle clicking outside the suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setFocused(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setQuery(cityName);
    onSearch(cityName);
    setFocused(false);
  };

  const filteredCities = query.trim()
    ? cities.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      )
    : cities.slice(0, 5); // Default list when empty

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div className="search-bar-wrapper">
          <Search size={18} className="text-on-surface-variant" style={{ color: 'var(--on-surface-variant)' }} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search for cities... (Press '/' to focus)"
          />
          <span className="search-shortcut">/</span>
        </div>
      </form>

      {focused && filteredCities.length > 0 && (
        <div ref={dropdownRef} className="suggestions-dropdown">
          {filteredCities.map((city, idx) => (
            <div
              key={idx}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(city.name)}
            >
              <span>{city.name}</span>
              <span className="suggestion-country">{city.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
