# 📸 Camera Capture App

A modern web application for capturing images using your device's camera, built with Node.js and Express, designed for deployment on Azure App Service.

## ✨ Features

- **Real-time Camera Access**: Access your device's camera through the browser
- **High-Quality Image Capture**: Capture photos with optimal resolution
- **Image Gallery**: View and manage all captured photos
- **Responsive Design**: Works on desktop and mobile devices
- **Azure Ready**: Optimized for deployment on Azure App Service
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd camero_nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- A modern web browser with camera support (Chrome, Firefox, Safari, Edge)

## 🌐 Deployment to Azure App Service

### Method 1: Azure CLI Deployment

1. **Install Azure CLI**
   ```bash
   # Install Azure CLI (if not already installed)
   # Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Create a Resource Group**
   ```bash
   az group create --name camera-app-rg --location "East US"
   ```

4. **Create an App Service Plan**
   ```bash
   az appservice plan create --name camera-app-plan --resource-group camera-app-rg --sku B1 --is-linux
   ```

5. **Create the Web App**
   ```bash
   az webapp create --resource-group camera-app-rg --plan camera-app-plan --name your-camera-app-name --runtime "NODE|18-lts"
   ```

6. **Configure the Web App**
   ```bash
   az webapp config appsettings set --resource-group camera-app-rg --name your-camera-app-name --settings WEBSITE_NODE_DEFAULT_VERSION=18.17.0
   ```

7. **Deploy the Application**
   ```bash
   # Initialize git repository (if not already done)
   git init
   git add .
   git commit -m "Initial commit"

   # Add Azure remote
   az webapp deployment source config-local-git --resource-group camera-app-rg --name your-camera-app-name

   # Get the git URL and add it as remote
   git remote add azure <your-git-url-from-previous-command>

   # Deploy
   git push azure main
   ```

### Method 2: GitHub Actions Deployment

1. **Create a GitHub repository** and push your code

2. **Set up GitHub Actions** by creating `.github/workflows/azure-webapps-node.js.yml`:
   ```yaml
   name: Build and deploy Node.js app to Azure Web App - your-camera-app-name

   on:
     push:
       branches:
         - main
     workflow_dispatch:

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
       - uses: actions/checkout@v2

       - name: Set up Node.js version
         uses: actions/setup-node@v1
         with:
           node-version: '18.x'

       - name: npm install and build
         run: |
           npm install
           npm run build --if-present

       - name: Deploy to Azure Web App
         id: deploy-to-webapp
         uses: azure/webapps-deploy@v2
         with:
           app-name: 'your-camera-app-name'
           slot-name: 'production'
           publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE }}
   ```

3. **Get the publish profile** from Azure Portal and add it as a secret named `AZUREAPPSERVICE_PUBLISHPROFILE`

### Method 3: Azure Portal Deployment

1. **Create App Service** in Azure Portal
2. **Go to Deployment Center**
3. **Choose your deployment method** (GitHub, Azure DevOps, etc.)
4. **Configure and deploy**

## 🔧 Configuration

### Environment Variables

You can configure the following environment variables in Azure App Service:

- `PORT`: Server port (default: 3000, Azure will set this automatically)
- `NODE_ENV`: Environment (production/development)

### Azure App Service Settings

In the Azure Portal, configure these settings:

1. **General Settings**:
   - Node version: 18 LTS
   - Startup command: `npm start`

2. **Application Settings**:
   - `WEBSITE_NODE_DEFAULT_VERSION`: 18.17.0

## 📱 Usage

1. **Start Camera**: Click the "Start Camera" button to access your device's camera
2. **Capture Photo**: Use the "Capture Photo" button to take a picture
3. **View Gallery**: Click "Gallery" to see all captured photos
4. **Delete Photos**: Use the delete button in the gallery to remove unwanted photos
5. **Back Navigation**: Use the "Back" button to return to the camera or home screen

## 🛠️ Technical Details

### Backend (Node.js/Express)
- **Framework**: Express.js
- **File Upload**: Multer for handling image uploads
- **Storage**: Local file system (uploads directory)
- **APIs**: RESTful endpoints for image management

### Frontend (HTML/CSS/JavaScript)
- **Camera Access**: WebRTC getUserMedia API
- **Image Capture**: Canvas API for image processing
- **UI Framework**: Pure CSS with modern design
- **Responsive**: Mobile-first design approach

### File Structure
```
camero_nodejs/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── web.config            # IIS configuration for Azure
├── deploy.cmd            # Azure deployment script
├── .deployment           # Azure deployment configuration
├── public/
│   └── index.html        # Main application UI
├── uploads/              # Directory for captured images
└── README.md            # This file
```

## 🔒 Security Considerations

- **HTTPS Required**: Camera access requires HTTPS in production
- **File Size Limits**: 10MB maximum file size for uploads
- **Input Validation**: Server-side validation for uploaded files
- **CORS**: Configured for same-origin requests

## 🐛 Troubleshooting

### Common Issues

1. **Camera not accessible**:
   - Ensure you're using HTTPS in production
   - Check browser permissions for camera access
   - Verify the browser supports getUserMedia API

2. **Deployment fails**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check Azure App Service logs

3. **Images not saving**:
   - Verify uploads directory exists and is writable
   - Check file size limits
   - Review server logs for errors

### Azure App Service Logs

To view logs in Azure:
```bash
az webapp log tail --resource-group camera-app-rg --name your-camera-app-name
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the Azure App Service documentation
- Review the troubleshooting section above

---

**Note**: This application requires HTTPS in production environments due to browser security policies for camera access. Azure App Service provides HTTPS by default.

# camera_nodejs
