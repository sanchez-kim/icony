import { useState } from 'react';
import { SearchBar } from '../IconGallery/SearchBar';
import { IconGallery } from '../IconGallery/IconGallery';

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-5 transition-colors">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <IconGallery searchQuery={searchQuery} />
    </div>
  );
}
