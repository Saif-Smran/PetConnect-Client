// Quick test to verify donation API endpoints
const axios = require('axios');

async function testDonationEndpoints() {
    try {
        console.log('Testing donation endpoints...');

        // Test getting all donations
        const donationsResponse = await axios.get('http://localhost:3000/donations');
        console.log('✅ All donations endpoint working');
        console.log('Sample donation:', JSON.stringify(donationsResponse.data[0], null, 2));

        if (donationsResponse.data.length > 0) {
            const firstDonation = donationsResponse.data[0];
            
            // Test getting a specific donation
            const singleDonationResponse = await axios.get(`http://localhost:3000/donations/${firstDonation._id}`);
            console.log('✅ Single donation endpoint working');
            console.log('Fields check:');
            console.log('- title:', singleDonationResponse.data.title);
            console.log('- raised:', singleDonationResponse.data.raised);
            console.log('- target:', singleDonationResponse.data.target);
            console.log('- raisedAmount:', singleDonationResponse.data.raisedAmount);
            console.log('- maxDonationAmount:', singleDonationResponse.data.maxDonationAmount);

            // Test recommended donations
            const recommendedResponse = await axios.get(`http://localhost:3000/donations/recommended/${firstDonation._id}`);
            console.log('✅ Recommended donations endpoint working');
            console.log('Recommended count:', recommendedResponse.data.length);
        }

        console.log('All tests passed! 🎉');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testDonationEndpoints();
