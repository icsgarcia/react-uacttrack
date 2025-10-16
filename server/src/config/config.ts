import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    access_token: string;
    refresh_token: string;
    access_token_expiry: string;
    refresh_token_expiry: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    access_token: process.env.ACCESS_TOKEN_SECRET || "",
    refresh_token: process.env.REFRESH_TOKEN_SECRET || "",
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

export default config;
