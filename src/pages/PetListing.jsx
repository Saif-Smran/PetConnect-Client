import React from 'react';

const PetListing = () => {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-11/12 mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-secondary font-bold text-5xl mb-4">
                        🐾 Pet Listing
                    </h1>
                    <p className="font-primary text-xl opacity-80 max-w-2xl mx-auto">
                        Discover amazing pets looking for their forever homes. Find your perfect companion today!
                    </p>
                </div>

                {/* Coming Soon Content */}
                <div className="card-pet p-12 text-center">
                    <div className="text-6xl mb-6 animate-bounce-gentle">🚧</div>
                    <h2 className="font-secondary font-semibold text-3xl mb-4">
                        Coming Soon!
                    </h2>
                    <p className="font-primary text-lg opacity-70 mb-8">
                        We're working hard to bring you an amazing pet listing experience. 
                        Stay tuned for adorable pets looking for loving homes!
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <div className="bg-primary/10 text-primary px-6 py-3 rounded-lg">
                            <span className="font-secondary font-medium">🔍 Advanced Search</span>
                        </div>
                        <div className="bg-secondary/10 text-secondary px-6 py-3 rounded-lg">
                            <span className="font-secondary font-medium">📱 Mobile Friendly</span>
                        </div>
                        <div className="bg-accent/10 text-accent px-6 py-3 rounded-lg">
                            <span className="font-secondary font-medium">❤️ Favorite Pets</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetListing;
