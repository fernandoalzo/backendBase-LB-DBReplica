const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

/**
 * Loads the setUp documentation from YAML file
 * @returns {Object} Swagger specification object for setUp API
 */
function getSetUpDocumentation() {
    try {
        const setUpYamlPath = path.join(__dirname, 'setUp.documentation.yml');
        console.log(`Looking for setUp documentation at: ${setUpYamlPath}`);

        const fileContent = fs.readFileSync(setUpYamlPath, 'utf8');
        const setUpYaml = yaml.load(fileContent);

        return setUpYaml;
    } catch (error) {
        console.error('Error loading setUp documentation:', error);
        return {
            openapi: '3.0.0',
            info: {
                title: 'Setup API Documentation',
                description: 'Error loading documentation: ' + error.message,
                version: '1.0.0'
            },
            paths: {}
        };
    }
}

/**
 * Sets up the setUp documentation routes in the Express app
 * @param {Object} app - Express application instance
 */
function setupSetUpDocumentation(app) {
    const setUpSpec = getSetUpDocumentation();

    // Add custom options for better integration with the home page
    const options = {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            url: null, // Ensure no redirection
            spec: setUpSpec // Use inline spec
        }
    };

    // Use a different instance of swagger-ui for setUp endpoints
    const setUpUiAssets = swaggerUi.serveFiles(setUpSpec, options);
    app.use('/api-docs/setup', setUpUiAssets);
    app.get('/api-docs/setup', (req, res) => {
        res.send(swaggerUi.generateHTML(setUpSpec, options));
    });
}

module.exports = {
    getSetUpDocumentation,
    setupSetUpDocumentation
}; 