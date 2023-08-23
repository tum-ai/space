const environment_name = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";

var api_base_url = "http://localhost:8000/";

switch (environment_name) {
  case "production":
    api_base_url = "https://api.space.tum-ai.com/";
    break;
  case "staging":
    api_base_url = "https://api.space.staging.tum-ai.com/";
    break;

  default:
    api_base_url = "http://localhost:8000/";
    break;
}

export { api_base_url, environment_name };
