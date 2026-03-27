import { Search } from 'lucide-react';
import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {  
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    // console.log('🔍 Searching:', keyword);
    onSearch(keyword.trim() || '');  
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setKeyword('');           
    onSearch('');           
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-200 max-w-3xl">
      <Search className="text-gray-400 w-5 h-5" />
      <input 
        type="text" 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for jobs, companies..."
        className="flex-1 outline-none text-gray-500 text-sm"
      />
       <button 
          onClick={handleSearch} 
          className="bg-theme hover:bg-theme-hover text-white px-6 py-2 rounded-xl text-sm font-medium transition-all"
        >
          Search
        </button>
      {keyword && (
        <button 
          onClick={handleClear} 
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Clear
        </button>
      )}
    </div>
  );
}