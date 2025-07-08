import React from 'react';

const DonationCampaigns = () => {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-11/12 mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-secondary font-bold text-5xl mb-4">
                        💝 Donation Campaigns
                    </h1>
                    <p className="font-primary text-xl opacity-80 max-w-2xl mx-auto">
                        Help us make a difference in the lives of pets in need. Every donation counts!
                    </p>
                </div>

                {/* Coming Soon Content */}
                <div className="card-pet p-12 text-center">
                    <div className="text-6xl mb-6 animate-bounce-gentle">💖</div>
                    <h2 className="font-secondary font-semibold text-3xl mb-4">
                        Building Something Special!
                    </h2>
                    <p className="font-primary text-lg opacity-70 mb-8">
                        We're creating a platform where compassionate hearts can support pets in need. 
                        Your generosity will help provide food, medical care, and shelter for animals.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <div className="bg-primary/10 text-primary px-6 py-3 rounded-lg">
                            <span className="font-secondary font-medium">🏥 Medical Care</span>
                        </div>
                        <div className="bg-secondary/10 text-secondary px-6 py-3 rounded-lg">
                            <span className="font-secondary font-medium">🥘 Food & Nutrition</span>
                        </div>
                        <div className="bg-accent/10 text-accent px-6 py-3 rounded-lg">
                            <span className="font-secondary font-medium">🏠 Shelter & Care</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationCampaigns;
