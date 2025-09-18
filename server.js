const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'captured-image-' + uniqueSuffix + '.jpg');
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle image upload from camera
app.post('/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No image file received' 
            });
        }

        console.log('Image saved:', req.file.filename);
        res.json({ 
            success: true, 
            message: 'Image captured successfully',
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving image' 
        });
    }
});

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Get list of captured images
app.get('/images', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir)
            .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
            .map(file => ({
                filename: file,
                url: `/uploads/${file}`,
                timestamp: fs.statSync(path.join(uploadsDir, file)).mtime
            }))
            .sort((a, b) => b.timestamp - a.timestamp);

        res.json({ success: true, images: files });
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reading images' 
        });
    }
});

// Delete an image
app.delete('/images/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, message: 'Error deleting image' });
    }
});

// Health check endpoint for Azure
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Camera capture server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the camera capture app`);
});

module.exports = app;

