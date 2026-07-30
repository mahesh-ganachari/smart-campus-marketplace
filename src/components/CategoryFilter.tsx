import React from 'react';
import { Category } from '@/types';
import { LayoutGrid, BookOpen, Cpu, FlaskConical } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
  categoryCounts: Record<Category | 'All', number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categories: { label: Category | 'All'; icon: React.ElementType }[] = [
    { label: 'All', icon: LayoutGrid },
    { label: 'Books', icon: BookOpen },
    { label: 'Electronics', icon: Cpu },
    { label: 'Lab Equipment', icon: FlaskConical },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 my-6">
      {categories.map(({ label, icon: Icon }) => {
        const isSelected = selectedCategory === label;
        const count = categoryCounts[label] || 0;

        return (
          <button
            key={label}
            onClick={() => onSelectCategory(label)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-600 ring-offset-2'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
            <span>{label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isSelected
                  ? 'bg-indigo-700/80 text-white'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
