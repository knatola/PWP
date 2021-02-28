import { getProcessEnv } from "./db-config";

export type Config = {
    dev: boolean;
}

const config: Config = {
	dev: getProcessEnv("dev", "true") === "true",
};

export default config;