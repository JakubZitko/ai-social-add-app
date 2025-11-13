'use client';

import React from 'react';
import { AvatarFilters as AvatarFiltersType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, X, Filter } from 'lucide-react';

interface AvatarFiltersProps {
  filters: AvatarFiltersType;
  onFilterChange: (filters: AvatarFiltersType) => void;
  resultCount: number;
}

export function AvatarFilters({ filters, onFilterChange, resultCount }: AvatarFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  const updateFilter = (key: keyof AvatarFiltersType, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof AvatarFiltersType, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    filters.gender?.length ||
    filters.age?.length ||
    filters.experience?.length ||
    filters.accessories?.length ||
    filters.emotions?.length ||
    filters.skinTone?.length ||
    filters.search ||
    filters.showPopularOnly;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search avatars..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Results and Clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{resultCount}</span> avatars found
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          {/* Gender */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Gender</h4>
            <div className="flex flex-wrap gap-2">
              {['male', 'female', 'non-binary'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => toggleArrayFilter('gender', gender)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.gender?.includes(gender as any)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Age</h4>
            <div className="flex flex-wrap gap-2">
              {['young_adult', 'adult', 'middle_aged', 'senior'].map((age) => (
                <button
                  key={age}
                  onClick={() => toggleArrayFilter('age', age)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.age?.includes(age as any)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {age.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Emotions */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Emotions</h4>
            <div className="flex flex-wrap gap-2">
              {['calm', 'enthusiastic', 'excited', 'smiling', 'serious'].map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleArrayFilter('emotions', emotion)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.emotions?.includes(emotion as any)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Only */}
          <div className="flex items-center">
            <input
              id="popular-only"
              type="checkbox"
              checked={filters.showPopularOnly || false}
              onChange={(e) => updateFilter('showPopularOnly', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="popular-only" className="ml-2 text-sm text-gray-700">
              Show popular avatars only
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
