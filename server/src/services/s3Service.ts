import { S3Client } from "@aws-sdk/client-s3";
import config from "../config/config";

const s3Client = new S3Client({
    region: config.aws_region,
    credentials: {
        accessKeyId: config.aws_access_key_id,
        secretAccessKey: config.aws_secret_access_key,
    },
});

export default s3Client;
