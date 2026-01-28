const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

/**
 * Loads the uploads documentation from YAML file
 * @returns {Object} Swagger specification object for uploads API
 */
function getUploadsDocumentation() {
    try {
        const uploadsYamlPath = path.join(__dirname, 'uploads.documentation.yml');
        console.log(`Looking for uploads documentation at: ${uploadsYamlPath}`);

        const fileContent = fs.readFileSync(uploadsYamlPath, 'utf8');
        const uploadsYaml = yaml.load(fileContent);

        return uploadsYaml;
    } catch (error) {
        console.error('Error loading uploads documentation:', error);
        return {
            openapi: '3.0.0',
            info: {
                title: 'Uploads API Documentation',
                description: 'Error loading documentation: ' + error.message,
                version: '1.0.0'
            },
            paths: {}
        };
    }
}

/**
 * Sets up the uploads documentation routes in the Express app
 * @param {Object} app - Express application instance
 */
function setupUploadsDocumentation(app) {
    const uploadsSpec = getUploadsDocumentation();

    // Add custom options for better integration with the home page
    const options = {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            url: null, // Ensure no redirection
            spec: uploadsSpec // Use inline spec
        }
    };

    // Use a different instance of swagger-ui for uploads endpoints
    const uploadsUiAssets = swaggerUi.serveFiles(uploadsSpec, options);
    app.use('/api-docs/uploads', uploadsUiAssets);
    app.get('/api-docs/uploads', (req, res) => {
        res.send(swaggerUi.generateHTML(uploadsSpec, options));
    });
}

module.exports = {
    getUploadsDocumentation,
    setupUploadsDocumentation
}; 