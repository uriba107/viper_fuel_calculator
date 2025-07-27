# Viper Fuel Planner

A modern Vue.js application for calculating fuel requirements for F-16 missions, styled with Tailwind CSS.

## Features

- **Modern Design**: Updated from the original PHP/JS version with modern UI components
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Calculation**: Instant fuel calculations as you modify mission parameters
- **Visual Feedback**: Color-coded fuel balance indicators
- **Aircraft Configuration**: Support for F-16C/D variants with CFT options
- **Mission Planning**: Advanced waypoint-based route planning
- **Simulator Support**: Both BMS and DCS configurations

## Original Design Elements Preserved

- **Color Palette**: Maintains the original blue theme (#2567AB) from the PHP version
- **Functionality**: All original calculation logic preserved
- **Layout Structure**: Similar organization to the original PHP-based fuel calculator

## Getting Started

### Development Prerequisites

**For development only** (not required for deployment):
- Node.js (v14 or higher)
- npm or yarn

### Installation (Development)

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

**Note**: Once built, the application is purely client-side (HTML/CSS/JavaScript) and requires no server-side dependencies or runtime environment.

## Deployment to Production

This application is designed to be **client-side only** with no server dependencies, making it easy to deploy to any static hosting service.

### Building for Production

1. **Build the application** (recommended):
   ```bash
   npm run build:prod
   ```
   
   Or use the standard build command:
   ```bash
   npm run build
   ```

2. **Output**: The build process creates a `dist/` folder containing all static files needed for production.

3. **Production Optimizations Applied**:
   - Vue DevTools disabled in production
   - Code minification with esbuild (fast and efficient)
   - Vendor chunk splitting for better caching
   - Vue runs in production mode for better performance
   - FOUC prevention with CSS loading optimizations
   - Critical resource preloading for faster initial load

### Deployment Options

#### Static Hosting Services (Recommended)

**Netlify**
1. Connect your repository to Netlify
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`
4. Deploy automatically on git push

**Vercel**
1. Import project from Git
2. Framework preset: Vite
3. Build command: `npm run build:prod`
4. Output directory: `dist`

**GitHub Pages**
1. Build locally: `npm run build:prod`
2. Push `dist/` contents to `gh-pages` branch
3. Enable GitHub Pages in repository settings

**AWS S3 + CloudFront**
1. Upload `dist/` contents to S3 bucket
2. Configure bucket for static website hosting
3. Set up CloudFront distribution for CDN

#### Traditional Web Hosting

**Nginx (Subdirectory Deployment)**
1. Build with relative paths: `npm run build:relative`
2. Upload `dist/` contents to your target directory
3. Configure nginx location block (see `nginx.conf.example`)
4. Key nginx settings:
   - Correct MIME types for `.js` and `.css` files
   - `try_files` for SPA routing fallback
   - Asset caching and compression

**Apache**
1. Upload all files from `dist/` folder to web root
2. Configure `.htaccess` for MIME types and SPA routing
3. Ensure mod_rewrite is enabled

**Simple HTTP Server (for testing)**
```bash
# Using Python
python -m http.server 8000 --directory dist

# Using Node.js serve
npx serve dist
```

### Production Configuration

**Environment Variables** (optional)
- Create `.env.production` for production-specific settings
- All variables must be prefixed with `VITE_`

**Build Optimization**
- Files are automatically minified and optimized
- CSS is purged and compressed
- Assets are fingerprinted for caching

### Performance Notes

- **No Database Required**: All calculations run in the browser
- **Fast Loading**: Optimized bundle size for quick initial load
- **Offline Ready**: Can be enhanced with PWA features if needed
- **CDN Friendly**: Static assets can be cached globally

### Performance Optimizations

**FOUC Prevention** (Flash of Unstyled Content):
- CSS is bundled into a single file to prevent loading delays
- Inline critical CSS in HTML head for immediate styling
- Loading state shown until app is fully rendered
- Vue app mounts only after DOM and initial styles are ready

**Resource Loading**:
- Critical resources are preloaded for faster initial load
- Vendor libraries are split into separate chunks for better caching
- Module preloading for ES modules reduces load time
- Optimized asset naming for efficient browser caching

### Subdirectory Deployment (Recommended)

For deploying to `https://yourdomain.com/path/to/app/`:

1. **Build with relative paths**:
   ```bash
   npm run build:relative
   ```

2. **Configure nginx** (see `nginx.conf.example`):
   ```nginx
   location /your-path {
       alias /path/to/dist/folder;
       try_files $uri $uri/ /your-path/index.html;
       # ... MIME type configuration
   }
   ```

3. **Upload** the `dist/` contents to your server directory

### Troubleshooting Deployment

- **MIME Type Errors** (`text/html` instead of `application/javascript`):
  - Ensure nginx serves correct MIME types for `.js` files
  - Check that JavaScript files exist and are accessible
  - Verify nginx location block configuration

- **Blank Page**: Check browser console for errors, ensure correct base URL

- **404 Errors on Refresh**: Configure server for SPA routing with `try_files`

- **Asset Loading Issues**: 
  - Use relative paths build: `npm run build:relative`
  - Verify all paths are relative and assets are included in build
  - Check nginx alias path points to correct directory

- **Path Resolution Issues**:
  - For specific subdirectory: Set `VITE_BASE_PATH='/your-path/'` before build
  - For flexible deployment: Use default relative paths (`./`)

## Usage

1. **Aircraft Configuration**
   - Select simulator (BMS/DCS)
   - Choose F-16 variant (C/D)
   - Enable CFT if applicable

2. **Mission Setup**
   - Choose mission type (Air-to-Air or Air-to-Ground)
   - Configure waypoints with distances and flight profiles
   - Set target waypoint for A-G missions

3. **Results**
   - View required fuel, available fuel, and fuel balance
   - See current loadout configuration
   - Get AAR recommendations when needed

## Modern UI Features

- **Card-based Layout**: Clean, organized sections
- **Interactive Elements**: Modern buttons and form controls
- **Visual Indicators**: Color-coded status and warnings
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Better contrast and keyboard navigation

## Technology Stack

- **Vue.js 3**: Modern reactive framework
- **Tailwind CSS 4**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## Credits

Originally written by the [108th VFS](http://108vfs.org/) for use with Falcon Family simulators.
Modernized interface while preserving all original functionality and calculations.
