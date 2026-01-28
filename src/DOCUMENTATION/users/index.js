const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

/**
 * Loads the users documentation from YAML file
 * @returns {Object} Swagger specification object for users API
 */
function getUsersDocumentation() {
    try {
        const usersYamlPath = path.join(__dirname, 'users.documentation.yml');
        console.log(`Looking for users documentation at: ${usersYamlPath}`);

        const fileContent = fs.readFileSync(usersYamlPath, 'utf8');
        const usersYaml = yaml.load(fileContent);

        return usersYaml;
    } catch (error) {
        console.error('Error loading users documentation:', error);
        return {
            openapi: '3.0.0',
            info: {
                title: 'Users API Documentation',
                description: 'Error loading documentation: ' + error.message,
                version: '1.0.0'
            },
            paths: {}
        };
    }
}

/**
 * Sets up the users documentation routes in the Express app
 * @param {Object} app - Express application instance
 */
function setupUsersDocumentation(app) {
    const usersSpec = getUsersDocumentation();

    // Add custom options for better integration with the home page
    const options = {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            url: null, // Ensure no redirection
            spec: usersSpec // Use inline spec
        }
    };

    // Important: Use a different instance of swagger-ui for users
    // This ensures no conflict with the home page
    const usersUiAssets = swaggerUi.serveFiles(usersSpec, options);
    app.use('/api-docs/users', usersUiAssets);
    app.get('/api-docs/users', (req, res) => {
        res.send(swaggerUi.generateHTML(usersSpec, options));
    });
}

module.exports = {
    getUsersDocumentation,
    setupUsersDocumentation
}; 