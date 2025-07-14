import React, { useState } from 'react';

const filters = ['Week', 'Month', 'Year'];

const FilterBar = () => {
  const [selected, setSelected] = useState('Week');

  return (
    <div className="flex justify-center gap-4 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setSelected(filter)}
          className={`px-4 py-2 rounded font-semibold border transition-colors duration-200 ${selected === filter ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar; 