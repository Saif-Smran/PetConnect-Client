// Test script to validate ImgBB API key
// This can be run in browser console to test the API key

const testImgBBAPI = async () => {
    console.log('🔍 Testing ImgBB API key...');
    
    try {
        // Create a simple 1x1 pixel image data
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 1, 1);
        
        // Convert to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        // Create form data
        const formData = new FormData();
        formData.append('image', blob, 'test.png');
        
        // Test API key
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ ImgBB API key is working!');
            console.log('📷 Test image uploaded:', result.data.url);
            return true;
        } else {
            console.error('❌ ImgBB API key error:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ ImgBB API test failed:', error);
        return false;
    }
};

// Export for use in components
export { testImgBBAPI };
