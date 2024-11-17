import React from 'react';
import { Lightbulb } from 'lucide-react';

interface AlternativeMedsProps {
  alternatives: string[];
  onSelect: (medication: string) => void;
}

export function AlternativeMeds({ alternatives, onSelect }: AlternativeMedsProps) {
  if (!alternatives.length) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 sticky top-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-yellow-100 p-2 rounded-full">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Alternative Options
        </h2>
      </div>
      <div className="space-y-2">
        {alternatives.map((med) => (
          <button
            key={med}
            onClick={() => onSelect(med)}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 
                     transition-colors flex items-center gap-3 group"
          >
            <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-400 
                          transition-colors"></div>
            <span className="text-gray-700 group-hover:text-gray-900">{med}</span>
          </button>
        ))}
      </div>
    </div>
  );
}