import React from 'react';
import { 
  PetListingHero, 
  SearchBar, 
  CategoryFilter, 
  PetCard, 
  PetGrid, 
  LoadingSpinner, 
  ErrorMessage, 
  EmptyState 
} from '../components/PetListing';

/**
 * Demo component showing how to use the modular PetListing components
 * 
 * Usage Examples:
 * 
 * 1. PetListingHero - Main hero section with stats
 * <PetListingHero totalPets={150} />
 * 
 * 2. SearchBar - Search input with clear functionality
 * <SearchBar
 *   searchTerm={searchTerm}
 *   onSearchChange={handleSearchChange}
 *   onClearSearch={handleClearSearch}
 * />
 * 
 * 3. CategoryFilter - Filter buttons for pet categories
 * <CategoryFilter
 *   selectedCategory={selectedCategory}
 *   onCategoryChange={handleCategoryChange}
 *   isLoading={isLoading}
 * />
 * 
 * 4. PetCard - Individual pet card component
 * <PetCard pet={petData} />
 * 
 * 5. PetGrid - Grid layout for multiple pets
 * <PetGrid pets={petsArray} isLoading={isLoading} />
 * 
 * 6. LoadingSpinner - Loading indicator
 * <LoadingSpinner />
 * 
 * 7. ErrorMessage - Error state with retry button
 * <ErrorMessage
 *   message="Failed to load pets"
 *   onRetry={retryFunction}
 * />
 * 
 * 8. EmptyState - Empty state with filters
 * <EmptyState
 *   searchTerm={searchTerm}
 *   selectedCategory={selectedCategory}
 *   onClearFilters={clearFiltersFunction}
 * />
 * 
 * Benefits of Modular Design:
 * - Easy to maintain and update individual components
 * - Reusable across different pages
 * - Better code organization
 * - Easier testing
 * - Better performance (only re-render what changes)
 * - More flexible styling and customization
 */

const PetListingComponentDemo = () => {
  // Sample data for demonstration
  const samplePet = {
    _id: '1',
    name: 'Buddy',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    location: 'New York, NY',
    age: '2 years',
    weight: '25 lbs',
    gender: 'Male',
    breed: 'Golden Retriever',
    size: 'Large',
    description: 'A friendly and energetic dog who loves to play fetch and go on walks.',
    adopted: false
  };

  const samplePets = [samplePet, { ...samplePet, _id: '2', name: 'Luna' }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">PetListing Components Demo</h1>
          <p className="text-lg text-base-content/70 mb-8">
            Showcasing the modular components used in the PetListing page
          </p>
        </div>

        {/* Hero Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
          <PetListingHero totalPets={150} />
        </section>

        {/* Search Bar Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Search Bar</h2>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              searchTerm=""
              onSearchChange={() => {}}
              onClearSearch={() => {}}
            />
          </div>
        </section>

        {/* Category Filter Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Category Filter</h2>
          <CategoryFilter
            selectedCategory="Dog"
            onCategoryChange={() => {}}
            isLoading={false}
          />
        </section>

        {/* Pet Card Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Pet Card</h2>
          <div className="max-w-sm mx-auto">
            <PetCard pet={samplePet} />
          </div>
        </section>

        {/* Pet Grid Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Pet Grid</h2>
          <PetGrid pets={samplePets} isLoading={false} />
        </section>

        {/* Loading Spinner Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Loading Spinner</h2>
          <LoadingSpinner />
        </section>

        {/* Error Message Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Error Message</h2>
          <ErrorMessage
            message="Failed to load pets from the server"
            onRetry={() => alert('Retry clicked!')}
          />
        </section>

        {/* Empty State Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Empty State</h2>
          <EmptyState
            searchTerm="unicorn"
            selectedCategory="Dog"
            onClearFilters={() => alert('Clear filters clicked!')}
          />
        </section>
      </div>
    </div>
  );
};

export default PetListingComponentDemo;
