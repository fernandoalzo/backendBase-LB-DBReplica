const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

/**
 * Loads the roles documentation from YAML file
 * @returns {Object} Swagger specification object for roles API
 */
function getRolesDocumentation() {
    try {
        const rolesYamlPath = path.join(__dirname, 'roles.documentation.yml');
        console.log(`Looking for roles documentation at: ${rolesYamlPath}`);

        const fileContent = fs.readFileSync(rolesYamlPath, 'utf8');
        const rolesYaml = yaml.load(fileContent);

        return rolesYaml;
    } catch (error) {
        console.error('Error loading roles documentation:', error);
        return {
            openapi: '3.0.0',
            info: {
                title: 'Roles API Documentation',
                description: 'Error loading documentation: ' + error.message,
                version: '1.0.0'
            },
            paths: {}
        };
    }
}

/**
 * Sets up the roles documentation routes in the Express app
 * @param {Object} app - Express application instance
 */
function setupRolesDocumentation(app) {
    const rolesSpec = getRolesDocumentation();

    // Add custom options for better integration with the home page
    const options = {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            url: null, // Ensure no redirection
            spec: rolesSpec // Use inline spec
        }
    };

    // Use a different instance of swagger-ui for roles endpoints
    const rolesUiAssets = swaggerUi.serveFiles(rolesSpec, options);
    app.use('/api-docs/roles', rolesUiAssets);
    app.get('/api-docs/roles', (req, res) => {
        res.send(swaggerUi.generateHTML(rolesSpec, options));
    });
}

module.exports = {
    getRolesDocumentation,
    setupRolesDocumentation
}; 