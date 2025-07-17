import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

/**
 * Test if ImBB API key is valid
 * @returns {Promise<boolean>} - Returns true if API key is valid
 */
export const testImBBApiKey = async () => {
    try {
        if (!IMGBB_API_KEY) {
            console.error('IMGBB_API_KEY not found in environment variables');
            return false;
        }
        
        // Create a small test image (1x1 pixel PNG)
        const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8buwAAAABJRU5ErkJggg==';
        
        const formData = new FormData();
        formData.append('image', testImage);
        formData.append('key', IMGBB_API_KEY);
        
        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data.success;
    } catch (error) {
        console.error('ImBB API key test failed:', error);
        return false;
    }
};

/**
 * Upload image to ImBB
 * @param {File|string} imageFile - File object or base64 string
 * @returns {Promise<string>} - Returns the uploaded image URL
 */
export const uploadImageToImBB = async (imageFile) => {
    try {
        // Check if API key is available
        if (!IMGBB_API_KEY) {
            console.error('IMGBB_API_KEY is not defined in environment variables');
            throw new Error('Image upload service is not configured. Please check your environment variables.');
        }

        console.log('Starting image upload to ImBB...');
        
        // Convert file to base64 if it's a File object
        let base64Image;
        
        if (imageFile instanceof File) {
            console.log('Converting file to base64...');
            base64Image = await convertFileToBase64(imageFile);
            // Remove the data:image/...;base64, prefix
            base64Image = base64Image.split(',')[1];
        } else if (typeof imageFile === 'string') {
            // If it's already a base64 string, remove prefix if present
            base64Image = imageFile.includes(',') ? imageFile.split(',')[1] : imageFile;
        } else {
            throw new Error('Invalid image format');
        }

        console.log('Uploading to ImBB API...');
        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('key', IMGBB_API_KEY);

        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('ImBB API response:', response.data);

        if (response.data.success) {
            console.log('Image uploaded successfully:', response.data.data.url);
            return response.data.data.url;
        } else {
            console.error('ImBB API returned error:', response.data);
            throw new Error('Failed to upload image to ImBB');
        }
    } catch (error) {
        console.error('Error uploading image to ImBB:', error);
        
        // Provide more specific error messages
        if (error.response) {
            console.error('ImBB API error response:', error.response.data);
            throw new Error(`Upload failed: ${error.response.data.error?.message || 'Unknown API error'}`);
        } else if (error.request) {
            throw new Error('Network error: Could not connect to image upload service');
        } else {
            throw new Error(error.message || 'Failed to upload image. Please try again.');
        }
    }
};

/**
 * Convert File to base64
 * @param {File} file - File object
 * @returns {Promise<string>} - Base64 string
 */
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

/**
 * Validate image file
 * @param {File} file - File object to validate
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) {
        return { isValid: false, error: 'No file selected' };
    }

    if (file.size > maxSize) {
        return { isValid: false, error: 'Image size should be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' };
    }

    return { isValid: true };
};

// Alias export for backward compatibility
export const imageUpload = uploadImageToImBB;
