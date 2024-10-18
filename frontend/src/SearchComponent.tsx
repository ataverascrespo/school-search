import React, { useState, FormEvent } from 'react';
import { SchoolResult } from './schoolResult';
import { Loading } from './Loading';
import SearchResults from './SearchResults';

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [time, setTime] = useState('');
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);

  var apiURL = import.meta.env.VITE_API_URL;
  
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if both query and time are filled
    if (!isFormValid()) {
      alert('Please fill in both fields before submitting.');
      return; // Prevent form submission if invalid
    }

    setSearchLoading(true);
    setSearched(true);
        
    try {
      const response = await fetch(`${apiURL}/search?query=${query}&time=${time}`);
      const data: SchoolResult[] = await response.json();
      setResults(data);
      setSearchLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const isFormValid = () => {
      return query.trim() !== '' && time.trim() !== '';
  };

  return (
    <div className="container mx-auto p-4">
      
      <h1 className="text-4xl font-bold text-center mt-12">TDSB School Search</h1>
      <h2 className='text-sm mx-4 text-center mb-6'>Search for a school below. LIO rankings are descending, so 1/460 is low but 460/460 is high</h2>

      <form onSubmit={handleSearch} className="flex gap-4 items-baseline">
        <div className="flex flex-col w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a school..."
            className="border  border-gray-300 p-2 rounded-md w-full text-sm lg:text-base"
          />
          <label className='text-xs lg:text-sm px-2 mt-1 italic text-neutral-700' htmlFor="text">School Name</label>
        </div>

        <div className="flex flex-col w-1/3 lg:w-1/6">
          <input type="time" min="6:00" max="16:00" value={time} onChange={(e) => setTime(e.target.value)} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></input>
          <label className='text-xs lg:text-sm px-2 mt-1 italic text-neutral-700' htmlFor="time">Start Time</label>
        </div>

        <button type="submit" className={` text-white p-2 w-1/3 md:w-1/6 rounded-md font-bold ${isFormValid() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}>
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
