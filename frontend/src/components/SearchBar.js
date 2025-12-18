'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&type=all`
      );
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      router.push(`/product/${suggestion.slug}`);
    } else if (suggestion.type === 'category') {
      router.push(`/shop?category=${suggestion.slug}`);
    } else if (suggestion.type === 'brand') {
      router.push(`/shop?tag=${suggestion.title}`);
    } else {
      setQuery(suggestion.title);
      router.push(`/shop?search=${encodeURIComponent(suggestion.title)}`);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container} ref={searchRef}>
      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className={styles.clearBtn}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchBtn} title="Search">
          🔍
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className={styles.suggestionsBox} ref={suggestionsRef}>
          {loading ? (
            <div className={styles.loading}>
              <span className={styles.spinner}></span>
              Loading suggestions...
            </div>
          ) : (
            <>
              {/* Group by type */}
              {suggestions.length > 0 && (
                <>
                  {/* Products */}
                  {suggestions.some((s) => s.type === 'product') && (
                    <div className={styles.group}>
                      <div className={styles.groupTitle}>Products</div>
                      {suggestions
                        .filter((s) => s.type === 'product')
                        .map((suggestion, index) => (
                          <button
                            key={`${suggestion.id}-product`}
                            type="button"
                            className={`${styles.suggestion} ${
                              selectedIndex ===
                              suggestions.findIndex((s) => s === suggestion)
                                ? styles.selected
                                : ''
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.image && (
                              <img
                                src={suggestion.image}
                                alt={suggestion.title}
                                className={styles.suggestionImage}
                              />
                            )}
                            <div className={styles.suggestionContent}>
                              <div className={styles.suggestionTitle}>
                                {suggestion.title}
                              </div>
                              <div className={styles.suggestionPrice}>
                                ₹{suggestion.price?.toFixed(2)}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Categories */}
                  {suggestions.some((s) => s.type === 'category') && (
                    <div className={styles.group}>
                      <div className={styles.groupTitle}>Categories</div>
                      {suggestions
                        .filter((s) => s.type === 'category')
                        .map((suggestion) => (
                          <button
                            key={`${suggestion.id}-category`}
                            type="button"
                            className={`${styles.suggestion} ${styles.category}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <span className={styles.icon}>📂</span>
                            {suggestion.title}
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Brands */}
                  {suggestions.some((s) => s.type === 'brand') && (
                    <div className={styles.group}>
                      <div className={styles.groupTitle}>Brands</div>
                      {suggestions
                        .filter((s) => s.type === 'brand')
                        .map((suggestion) => (
                          <button
                            key={`${suggestion.id}-brand`}
                            type="button"
                            className={`${styles.suggestion} ${styles.brand}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <span className={styles.icon}>🏷️</span>
                            {suggestion.title}
                            <span className={styles.count}>
                              {suggestion.count}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Search Query */}
                  {suggestions.some((s) => s.type === 'search') && (
                    <div className={styles.group}>
                      {suggestions
                        .filter((s) => s.type === 'search')
                        .map((suggestion) => (
                          <button
                            key="search-query"
                            type="button"
                            className={`${styles.suggestion} ${styles.search}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <span className={styles.icon}>🔍</span>
                            Search for "{suggestion.title}"
                            <span className={styles.count}>
                              {suggestion.count} results
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
