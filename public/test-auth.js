// Test Firebase token authentication
// Run this in your browser console when logged in

async function testFirebaseAuth() {
    try {
        // Get current user
        const user = firebase.auth().currentUser;
        if (!user) {
            console.error('❌ No user logged in');
            return;
        }
        
        console.log('👤 Current user:', user.email);
        
        // Get fresh token
        const token = await user.getIdToken(true);
        console.log('🔐 Fresh token obtained:', token.substring(0, 20) + '...');
        
        // Test server endpoint
        const response = await fetch('http://localhost:3000/auth/test', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Server response:', data);
        } else {
            const error = await response.json();
            console.error('❌ Server error:', error);
        }
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testFirebaseAuth();
