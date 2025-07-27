# Deployment Configuration Files

This folder contains server configuration files for deploying the F-16 Fuel Calculator Vue.js application to production.

## Files Included

- **`nginx.conf.example`** - Nginx configuration examples for various deployment scenarios
- **`.htaccess`** - Apache configuration for shared hosting or Apache servers

## Quick Start

### For Nginx Servers

1. Choose the appropriate configuration from `nginx.conf.example`:
   - **Subdirectory deployment** (recommended): For URLs like `https://yourdomain.com/fuel-calc/`
   - **Root domain deployment**: For URLs like `https://yourdomain.com/`
   - **Full server block**: For dedicated domains/subdomains

2. Copy the relevant configuration to your nginx configuration file
3. Update paths and domain names to match your setup
4. Test configuration: `nginx -t`
5. Reload nginx: `systemctl reload nginx`

### For Apache Servers

1. Upload the `.htaccess` file to the same directory as your built application files
2. Ensure required Apache modules are enabled:
   ```bash
   sudo a2enmod rewrite headers expires deflate mime
   sudo systemctl restart apache2
   ```

## Deployment Steps

### 1. Build the Application

```bash
# For relative paths (recommended)
npm run build:relative

# Or standard build
npm run build
```

### 2. Upload Files

Upload all contents of the `dist/` folder to your web server directory.

### 3. Configure Server

**Nginx:**
- Add appropriate location block or server block to your nginx config
- Update file paths to match your server setup

**Apache:**
- Copy `.htaccess` to the same directory as your uploaded files
- Ensure proper file permissions (typically 644)

## Key Features

Both configurations provide:

- **SPA Routing**: Handles Vue.js client-side routing
- **MIME Types**: Correct content-type headers for JavaScript/CSS files
- **Caching**: Optimized caching for static assets
- **Compression**: Gzip compression for better performance
- **Security Headers**: Basic security headers protection
- **Asset Optimization**: Long-term caching for versioned assets

## Troubleshooting

### Common Issues

**JavaScript files loading as HTML (MIME type error):**
- Nginx: Check that location blocks for `.js` files are configured
- Apache: Ensure `mod_mime` is enabled

**404 errors on page refresh:**
- Check SPA routing configuration
- Nginx: Verify `try_files` directive
- Apache: Ensure `mod_rewrite` is enabled

**Assets not loading:**
- Verify file paths in configuration match your server structure
- Check file permissions (files should be readable by web server)

**Performance issues:**
- Enable compression (gzip)
- Verify caching headers are set correctly
- Check that static assets have long cache times

### Testing Your Configuration

**Test MIME types:**
```bash
curl -I https://yourdomain.com/path/to/app.js
# Should show: Content-Type: application/javascript
```

**Test SPA routing:**
```bash
curl https://yourdomain.com/fuel-calc/some-route
# Should return the main index.html content
```

**Test compression:**
```bash
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com/path/to/app.js
# Should show: Content-Encoding: gzip
```

## Security Notes

- Both configurations include basic security headers
- Consider adding SSL/TLS encryption for production deployments
- Review and adjust security headers based on your security requirements
- The configurations prevent access to sensitive files and directories

## Performance Optimization

The configurations are optimized for:
- **Fast loading**: Proper caching and compression
- **Efficient delivery**: Long-term caching for static assets
- **SPA performance**: No caching for HTML to ensure updates are delivered
- **Bandwidth optimization**: Gzip compression for text-based files

## Customization

Feel free to modify these configurations based on your specific needs:
- Adjust cache times based on your update frequency
- Add additional security headers if required
- Modify compression settings based on your server capabilities
- Update file paths and domain names for your environment

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Apache Documentation](https://httpd.apache.org/docs/)
- [Vue.js Deployment Guide](https://cli.vuejs.org/guide/deployment.html) 