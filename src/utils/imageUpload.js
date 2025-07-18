import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMBB_API_KEY;

/**
 * Upload image to ImBB
 * @param {File|string} imageFile - File object or base64 string
 * @returns {Promise<string>} - Returns the uploaded image URL
 */
export const uploadImageToImBB = async (imageFile) => {
    try {
        // Convert file to base64 if it's a File object
        let base64Image;
        
        if (imageFile instanceof File) {
            base64Image = await convertFileToBase64(imageFile);
            // Remove the data:image/...;base64, prefix
            base64Image = base64Image.split(',')[1];
        } else if (typeof imageFile === 'string') {
            // If it's already a base64 string, remove prefix if present
            base64Image = imageFile.includes(',') ? imageFile.split(',')[1] : imageFile;
        } else {
            throw new Error('Invalid image format');
        }

        const formData = new FormData();
        formData.append('image', base64Image);
        formData.append('key', IMGBB_API_KEY);

        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error('Failed to upload image to ImBB');
        }
    } catch (error) {
        console.error('Error uploading image to ImBB:', error);
        throw new Error('Failed to upload image. Please try again.');
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

// Default export alias for backward compatibility
export const imageUpload = uploadImageToImBB;
export default uploadImageToImBB;
