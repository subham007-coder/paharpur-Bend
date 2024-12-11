const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
const uploadToCloudinary = async (file) => {
    try {
        // Convert file to base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicUrl) => {
    try {
        if (!publicUrl) return;
        
        // Extract public ID from URL
        const publicId = publicUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary }; 