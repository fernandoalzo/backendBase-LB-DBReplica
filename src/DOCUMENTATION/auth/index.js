const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

/**
 * Loads the auth documentation from YAML file
 * @returns {Object} Swagger specification object for auth API
 */
function getAuthDocumentation() {
    try {
        const authYamlPath = path.join(__dirname, 'auth.documentation.yml');
        console.log(`Looking for auth documentation at: ${authYamlPath}`);

        const fileContent = fs.readFileSync(authYamlPath, 'utf8');
        const authYaml = yaml.load(fileContent);

        return authYaml;
    } catch (error) {
        console.error('Error loading auth documentation:', error);
        return {
            openapi: '3.0.0',
            info: {
                title: 'Authentication API Documentation',
                description: 'Error loading documentation: ' + error.message,
                version: '1.0.0'
            },
            paths: {}
        };
    }
}

/**
 * Sets up the auth documentation routes in the Express app
 * @param {Object} app - Express application instance
 */
function setupAuthDocumentation(app) {
    const authSpec = getAuthDocumentation();

    // Add custom options for better integration with the home page
    const options = {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            url: null, // Ensure no redirection
            spec: authSpec // Use inline spec
        }
    };

    // Use a different instance of swagger-ui for auth endpoints
    const authUiAssets = swaggerUi.serveFiles(authSpec, options);
    app.use('/api-docs/auth', authUiAssets);
    app.get('/api-docs/auth', (req, res) => {
        res.send(swaggerUi.generateHTML(authSpec, options));
    });
}

module.exports = {
    getAuthDocumentation,
    setupAuthDocumentation
}; 