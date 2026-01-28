const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

/**
 * Safely loads documentation from a YAML file
 * @param {string} moduleName - Name of the documentation module
 * @returns {Object} Swagger specification object
 */
function loadDocumentationFromYaml(moduleName) {
    try {
        const yamlFile = path.join(__dirname, moduleName, `${moduleName}.documentation.yml`);
        if (fs.existsSync(yamlFile)) {
            return yaml.load(fs.readFileSync(yamlFile, 'utf8'));
        }
        console.warn(`Documentation file not found for ${moduleName}`);
        return null;
    } catch (error) {
        console.error(`Error loading documentation for ${moduleName}:`, error);
        return null;
    }
}

// Import documentation setup functions
const { setupSetUpDocumentation, getSetUpDocumentation } = require('./setUp');
const { setupUsersDocumentation, getUsersDocumentation } = require('./users');
const { setupAuthDocumentation, getAuthDocumentation } = require('./auth');
const { setupRolesDocumentation, getRolesDocumentation } = require('./roles');
const { setupUploadsDocumentation, getUploadsDocumentation } = require('./uploads');

/**
 * Creates a home page for API documentation
 * @returns {Object} Swagger specification for home page
 */
function createHomePage() {
    // Build the home page spec
    const homeSpec = {
        openapi: '3.0.0',
        info: {
            title: 'Backend Base API Documentation',
            description: `
# Welcome to the Backend Base API Documentation

## Core System Endpoints
* [Setup API](/api-docs/setup) - API for system initialization and setup
* [Users API](/api-docs/users) - API for managing users in the Backend Base platform
* [Authentication API](/api-docs/auth) - API for authentication and token validation
* [Roles API](/api-docs/roles) - API for managing user roles
* [Uploads API](/api-docs/uploads) - API for file uploads and retrieval

Click on the links above to navigate to the specific API documentation.
            `,
            version: '1.0.0'
        },
        tags: [
            {
                name: 'Setup',
                description: 'API endpoints for system initialization and setup'
            },
            {
                name: 'Users',
                description: 'API endpoints for user management'
            },
            {
                name: 'Authentication',
                description: 'API endpoints for authentication and token validation'
            },
            {
                name: 'Roles',
                description: 'API endpoints for role management'
            },
            {
                name: 'Uploads',
                description: 'API endpoints for file uploads and retrieval'
            }
        ],
        paths: {},
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    };

    // Merge API specifications into the home page spec
    try {
        // Merge setUp API specification first
        const setUpSpec = getSetUpDocumentation?.() || loadDocumentationFromYaml('setUp');
        
        if (setUpSpec && setUpSpec.paths) {
            // Standardize security requirements in paths
            Object.values(setUpSpec.paths).forEach(pathItem => {
                Object.values(pathItem).forEach(operation => {
                    if (operation.security) {
                        operation.security = operation.security.map(securityRequirement => {
                            if (securityRequirement.JWT) {
                                return { BearerAuth: securityRequirement.JWT };
                            }
                            if (securityRequirement.bearerAuth) {
                                return { BearerAuth: securityRequirement.bearerAuth };
                            }
                            return securityRequirement;
                        });
                    }
                });
            });
            Object.assign(homeSpec.paths, setUpSpec.paths);
        }
        
        // Merge users API specification
        const usersSpec = getUsersDocumentation?.() || loadDocumentationFromYaml('users');
        
        if (usersSpec && usersSpec.paths) {
            // Standardize security requirements in paths
            Object.values(usersSpec.paths).forEach(pathItem => {
                Object.values(pathItem).forEach(operation => {
                    if (operation.security) {
                        operation.security = operation.security.map(securityRequirement => {
                            if (securityRequirement.JWT) {
                                return { BearerAuth: securityRequirement.JWT };
                            }
                            if (securityRequirement.bearerAuth) {
                                return { BearerAuth: securityRequirement.bearerAuth };
                            }
                            return securityRequirement;
                        });
                    }
                });
            });
            Object.assign(homeSpec.paths, usersSpec.paths);
        }
        
        // Merge auth API specification
        const authSpec = getAuthDocumentation?.() || loadDocumentationFromYaml('auth');
        
        if (authSpec && authSpec.paths) {
            // Standardize security requirements in paths
            Object.values(authSpec.paths).forEach(pathItem => {
                Object.values(pathItem).forEach(operation => {
                    if (operation.security) {
                        operation.security = operation.security.map(securityRequirement => {
                            if (securityRequirement.JWT) {
                                return { BearerAuth: securityRequirement.JWT };
                            }
                            if (securityRequirement.bearerAuth) {
                                return { BearerAuth: securityRequirement.bearerAuth };
                            }
                            return securityRequirement;
                        });
                    }
                });
            });
            Object.assign(homeSpec.paths, authSpec.paths);
        }
        
        // Merge roles API specification
        const rolesSpec = getRolesDocumentation?.() || loadDocumentationFromYaml('roles');
        
        if (rolesSpec && rolesSpec.paths) {
            // Standardize security requirements in paths
            Object.values(rolesSpec.paths).forEach(pathItem => {
                Object.values(pathItem).forEach(operation => {
                    if (operation.security) {
                        operation.security = operation.security.map(securityRequirement => {
                            if (securityRequirement.JWT) {
                                return { BearerAuth: securityRequirement.JWT };
                            }
                            if (securityRequirement.bearerAuth) {
                                return { BearerAuth: securityRequirement.bearerAuth };
                            }
                            return securityRequirement;
                        });
                    }
                });
            });
            Object.assign(homeSpec.paths, rolesSpec.paths);
        }
        
        // Merge uploads API specification
        const uploadsSpec = getUploadsDocumentation?.() || loadDocumentationFromYaml('uploads');
        
        if (uploadsSpec && uploadsSpec.paths) {
            // Standardize security requirements in paths
            Object.values(uploadsSpec.paths).forEach(pathItem => {
                Object.values(pathItem).forEach(operation => {
                    if (operation.security) {
                        operation.security = operation.security.map(securityRequirement => {
                            if (securityRequirement.JWT) {
                                return { BearerAuth: securityRequirement.JWT };
                            }
                            if (securityRequirement.bearerAuth) {
                                return { BearerAuth: securityRequirement.bearerAuth };
                            }
                            return securityRequirement;
                        });
                    }
                });
            });
            Object.assign(homeSpec.paths, uploadsSpec.paths);
        }
        
        // Merge components from all specs
        [setUpSpec, usersSpec, authSpec, rolesSpec, uploadsSpec].forEach(spec => {
            if (spec && spec.components) {
                if (!homeSpec.components) {
                    homeSpec.components = {};
                }
                Object.keys(spec.components).forEach(key => {
                    if (key === 'securitySchemes') {
                        // Don't skip security schemes, but map them properly
                        if (!homeSpec.components.securitySchemes) {
                            homeSpec.components.securitySchemes = {};
                        }
                        
                        // Map security schemes from specs to the home spec
                        Object.entries(spec.components.securitySchemes).forEach(([schemeKey, scheme]) => {
                            // Map JWT scheme to BearerAuth scheme but keep others
                            if (schemeKey === 'JWT') {
                                homeSpec.components.securitySchemes.BearerAuth = scheme;
                            } else {
                                homeSpec.components.securitySchemes[schemeKey] = scheme;
                            }
                        });
                        return;
                    }
                    
                    if (!homeSpec.components[key]) {
                        homeSpec.components[key] = {};
                    }
                    Object.assign(homeSpec.components[key], spec.components[key]);
                });
            }
        });
    } catch (error) {
        console.error('Error merging API specifications:', error);
    }

    return homeSpec;
}

/**
 * Main function to set up all API documentation
 * @param {Object} app - Express application instance
 */
function setupApiDocumentation(app) {
    // Create and serve the home page at /api-docs
    const homeSpec = createHomePage();
    const homeOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            url: null, // Ensure no redirection
            spec: homeSpec, // Use inline spec
            docExpansion: 'none', // Fold all operations by default
            defaultModelsExpandDepth: 1, // Show models one level deep by default
            filter: true, // Enable filtering operations
            tagsSorter: 'alpha' // Sort tags alphabetically
        }
    };

    // Set up documentation for each module (setup first)
    setupSetUpDocumentation(app);
    setupUsersDocumentation(app);
    setupAuthDocumentation(app);
    setupRolesDocumentation(app);
    setupUploadsDocumentation(app);

    // Setup home documentation
    const swaggerUiAssets = swaggerUi.serveFiles(homeSpec, homeOptions);
    app.use('/api-docs', swaggerUiAssets);
    app.get('/api-docs', (req, res) => {
        res.send(swaggerUi.generateHTML(homeSpec, homeOptions));
    });

    console.log('API Documentation setup completed');
}

module.exports = {
    setupApiDocumentation
};
