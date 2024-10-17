import React, { useState, FormEvent } from 'react';
import { SchoolResult } from './schoolResult';
import { Loading } from './Loading';
import SearchResults from './SearchResults';

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);

  var apiURL = import.meta.env.VITE_API_URL;
  
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    setSearchLoading(true);
    setSearched(true);
        
    try {
      const response = await fetch(`${apiURL}/search?query=${query}`);
      const data: SchoolResult[] = await response.json();
      setResults(data.reverse());
      setSearchLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a school..."
          className="border border-gray-300 p-2 rounded-md w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-1/3 md:w-1/6 rounded-md">
          Search
        </button>
      </form>

      {
        isSearchLoading
            ? <Loading/>
            : (
                <div className="mt-4">
                    {searched && results.length > 0 ? (
                    <ul>
                        <SearchResults results={results}></SearchResults>
                    </ul>
                    ) : (
                        searched && <p>No results found</p> // Only show if searched
                    )}
                </div>
            )
    }
    </div>
  );
};

export default SearchComponent;
