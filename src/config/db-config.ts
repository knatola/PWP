import dotenv from "dotenv";

dotenv.config();

/**
 * Get a variable from `process.env` and throw if not found.
 *
 * @param value The env variable e.g `SERVER_PORT`
 * @param fallback Optional fallback value in case the value is empty (or not defined)
 */
export function getProcessEnv(
	value: string,
	fallback: string | null = null,
): string {
	if (typeof value !== "string") {
		throw new TypeError(
			`Expected value to be string but received: ${value}`,
		);
	}
	const val = process.env[value];
	if (!val && !fallback) {
		throw new Error(`Unable to find env variable ${value}`);
	}
	return val || fallback as string;
}

export type DbConfig = {
    database: string;
    host: string;
    username: string;
    password: string;
    port: number;
    dialect: string;
    seederStorage: string;
    seederStorageTableName: string;
}

const dbConfig: DbConfig = {
	database: getProcessEnv("POSTGRES_DB"),
	host: getProcessEnv("POSTGRES_HOST"),
	username: getProcessEnv("POSTGRES_USER"),
	password: getProcessEnv("POSTGRES_PASSWORD"),
	port: parseInt(getProcessEnv("POSTGRES_PORT", "5432"), 10),
	dialect: "postgres",
	seederStorage: "sequelize",
	seederStorageTableName: "SequelizeData"
};

export default dbConfig;