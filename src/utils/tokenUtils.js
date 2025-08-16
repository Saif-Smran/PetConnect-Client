// Utility to decode JWT token payload (for debugging)
export const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

// Check if token is a valid Firebase ID token
export const isValidFirebaseToken = (token) => {
    if (!token) return false;
    
    try {
        // Firebase ID tokens have 3 parts separated by dots
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        // Decode header to check algorithm and kid
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        // console.log('🔍 Token header:', header);
        
        // Firebase ID tokens should use RS256 and have a "kid" claim
        return header.alg === 'RS256' && header.kid;
    } catch (error) {
        console.error('Error checking token validity:', error);
        return false;
    }
};

// Get a fresh Firebase ID token
export const getFreshFirebaseToken = async (user) => {
    if (!user) {
        throw new Error('User not authenticated');
    }
    
    try {
        // console.log('🔄 Getting fresh Firebase ID token...');
        const token = await user.getIdToken(true); // Force refresh
        
        // Validate the token
        if (!isValidFirebaseToken(token)) {
            console.error('❌ Invalid Firebase token received');
            throw new Error('Invalid Firebase ID token received');
        }
        
        // const decoded = decodeJWT(token);
        
        // console.log('🔐 Fresh Firebase Token Info:', {
        //     uid: decoded?.sub,
        //     email: decoded?.email,
        //     name: decoded?.name,
        //     exp: decoded?.exp,
        //     expiresAt: new Date(decoded?.exp * 1000).toISOString(),
        //     issuer: decoded?.iss
        // });
        
        // Store the fresh token
        localStorage.setItem('firebase_id_token', token);
        
        return token;
    } catch (error) {
        console.error('Error getting fresh token:', error);
        throw error;
    }
};
