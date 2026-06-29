import { config as loadDotenv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENV_FILE_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  ".env",
);

loadDotenv({ path: ENV_FILE_PATH });

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const Env = {
  get apiBaseUrl() {
    return getRequiredEnv("API_BASE_URL");
  },
  get frontendBaseUrl() {
    return getRequiredEnv("FRONTEND_BASE_URL");
  },
  get keycloakBaseUrl() {
    return getRequiredEnv("KEYCLOAK_BASE_URL");
  },
  get keycloakRealm() {
    return getRequiredEnv("KEYCLOAK_REALM");
  },
  get keycloakClientId() {
    return getRequiredEnv("KEYCLOAK_CLIENT_ID");
  },
  get keycloakPassword() {
    return getRequiredEnv("KEYCLOAK_PASSWORD");
  },
  get keycloakUsernameAlpha() {
    return getRequiredEnv("KEYCLOAK_USERNAME_ALPHA");
  },
  get keycloakUsernameBeta() {
    return getRequiredEnv("KEYCLOAK_USERNAME_BETA");
  },
  get keycloakUsernameGamma() {
    return getRequiredEnv("KEYCLOAK_USERNAME_GAMMA");
  },
} as const;
