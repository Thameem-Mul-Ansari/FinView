import { useState } from 'react';

const categories = [
  'All',
  'Cryptocurrency',
  'Digital Banking',
  'Investment',
  'Blockchain',
  'Payments',
  'RegTech',
];

export function CategoryFilter() {
  const [selected, setSelected] = useState('All');

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelected(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selected === category
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}