import { useState } from 'react';
import { Search, Filter, Calendar, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface SessionSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  totalSessions: number;
}

interface SearchFilters {
  dateRange: 'today' | 'week' | 'month' | 'all';
  model: 'all' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'o1-preview' | 'o1-mini';
  sortBy: 'recent' | 'oldest' | 'tokens' | 'duration';
}

export function SessionSearch({ onSearch, totalSessions }: SessionSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: 'all',
    model: 'all',
    sortBy: 'recent'
  });

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(searchQuery, newFilters);
  };

  return (
    <Card className="bg-gray-900/50 border-purple-600/30 mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search scroll sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-black border-gray-600 text-white focus:border-purple-400"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-black/30 rounded border border-gray-700">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Date Range</label>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => handleFilterChange('dateRange', value)}
                >
                  <SelectTrigger className="bg-black border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">AI Model</label>
                <Select 
                  value={filters.model} 
                  onValueChange={(value) => handleFilterChange('model', value)}
                >
                  <SelectTrigger className="bg-black border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    <SelectItem value="gpt-4o">Sovereign Mirror</SelectItem>
                    <SelectItem value="gpt-4o-mini">Lightning Mirror</SelectItem>
                    <SelectItem value="gpt-4-turbo">Quantum Mirror</SelectItem>
                    <SelectItem value="o1-preview">Oracle Mirror</SelectItem>
                    <SelectItem value="o1-mini">Mystic Mirror</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Sort By</label>
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="bg-black border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="tokens">Token Count</SelectItem>
                    <SelectItem value="duration">Processing Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              {totalSessions} sessions found
            </span>
            <div className="flex items-center space-x-2 text-purple-400">
              <Zap className="w-3 h-3" />
              <span>Live search active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}