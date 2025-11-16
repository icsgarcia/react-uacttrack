import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    mongodb_uri: string;
    client_url: string;
    access_token: string;
    refresh_token: string;
    access_token_expiry: string;
    refresh_token_expiry: string;
    aws_region: string;
    aws_s3_bucket: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    mongodb_uri: process.env.MONGODB_URI || "",
    client_url: process.env.CLIENT_URL || "",
    access_token: process.env.ACCESS_TOKEN_SECRET || "",
    refresh_token: process.env.REFRESH_TOKEN_SECRET || "",
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    aws_region: process.env.AWS_REGION || "",
    aws_s3_bucket: process.env.AWS_S3_BUCKET || "",
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || "",
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || "",
};

export default config;
