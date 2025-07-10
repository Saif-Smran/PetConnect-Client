import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import PetListingHero from '../../components/PetListing/PetListingHero';
import SearchBar from '../../components/PetListing/SearchBar';
import CategoryFilter from '../../components/PetListing/CategoryFilter';
import PetGrid from '../../components/PetListing/PetGrid';
import LoadingSpinner from '../../components/PetListing/LoadingSpinner';
import ErrorMessage from '../../components/PetListing/ErrorMessage';
import EmptyState from '../../components/PetListing/EmptyState';

const fetchPets = async ({ pageParam = 0, queryKey }) => {
  const [_key, { category, search }] = queryKey;
  const limit = 12; // Pets per page
  const params = {
    skip: pageParam,
    limit,
  };
  
  if (category && category !== 'All') {
    params.category = category;
  }

  const response = await axios.get('http://localhost:3000/pets', { params });
  let filtered = response.data;

  // Local filtering by search term
  if (search) {
    filtered = filtered.filter((pet) => {
      const name = pet.petName || pet.name || '';
      const breed = pet.petBreed || pet.breed || '';
      const location = pet.petLocation || pet.location || '';
      
      return name.toLowerCase().includes(search.toLowerCase()) ||
             breed.toLowerCase().includes(search.toLowerCase()) ||
             location.toLowerCase().includes(search.toLowerCase());
    });
  }

  return filtered;
};

const Petlist = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['pets', { category: selectedCategory, search: debouncedSearch }],
    queryFn: fetchPets,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 12) return undefined;
      return pages.length * 12;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPets = data?.pages.flat() || [];
  const totalPets = allPets.length;

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setDebouncedSearch('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <PetListingHero totalPets={totalPets} />

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
        />

        {/* Results Section */}
        {error ? (
          <ErrorMessage
            message={error.message}
            onRetry={() => refetch()}
          />
        ) : allPets.length === 0 && !isLoading ? (
          <EmptyState
            searchTerm={debouncedSearch}
            selectedCategory={selectedCategory}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-base-content/70 text-lg">
                {isLoading ? 'Loading...' : `Found ${totalPets} amazing pets`}
              </p>
            </div>

            {/* Pet Grid */}
            <PetGrid pets={allPets} isLoading={isLoading} />

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={ref} className="mt-12">
                {isFetchingNextPage && <LoadingSpinner />}
              </div>
            )}

            {/* End of Results */}
            {!hasNextPage && allPets.length > 0 && (
              <div className="text-center mt-12 py-8">
                <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-base-content/10">
                  <p className="text-base-content/70 text-lg">
                    🎉 You've seen all our amazing pets!
                  </p>
                  <p className="text-base-content/50 text-sm mt-2">
                    Check back later for more furry friends
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Petlist;
