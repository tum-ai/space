

const environment_name = process.env.REACT_APP_ENVIRONMENT || 'development';

var api_base_url = "http://localhost:8000/"

switch (environment_name) {
    case 'production':
        api_base_url = "https://tumai-space-api.azurewebsites.net/"
        break;
    case 'staging':
        api_base_url = "https://tumai-space-staging-api.azurewebsites.net/"
        break;

    default:
        api_base_url = "http://localhost:8000/"
        break;
}

export { environment_name, api_base_url }
