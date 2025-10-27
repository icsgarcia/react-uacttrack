import { Request, Response } from "express";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config/config";
import { AuthRequest } from "../middlewares/authMiddleware";
import s3Client from "../services/s3Service";

const ALLOWED_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

// Generate pre-signed URL for uploading
const createPresignedPutUrl = async (bucket: string, key: string) => {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// Generate pre-signed URL for downloading
const createPresignedGetUrl = async (bucket: string, key: string) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// POST /uploads/presign - Generate multiple pre-signed upload URLs
export const presignUploads = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { files } = req.body as {
            files: { fileName: string; contentType: string; prefix?: string }[];
        };

        if (!Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: "files array is required" });
        }

        const results = await Promise.all(
            files.map(async ({ fileName, contentType, prefix = "forms" }) => {
                if (!fileName || !contentType) {
                    throw new Error("fileName and contentType are required");
                }
                if (!ALLOWED_TYPES.has(contentType)) {
                    throw new Error(`Invalid file type: ${contentType}`);
                }

                const key = `${prefix}/${Date.now()}_${fileName}`;
                const url = await createPresignedPutUrl(
                    config.aws_s3_bucket,
                    key
                );

                return { key, url, contentType };
            })
        );

        res.status(200).json({ uploads: results });
    } catch (err: any) {
        console.error("presignUploads error:", err);
        res.status(400).json({
            message: err?.message || "Failed to presign uploads",
        });
    }
};

// GET /uploads/presign-download?key=forms/123_file.pdf - Generate download URL
export const presignDownload = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const key = req.query.key as string;
        if (!key) {
            return res
                .status(400)
                .json({ message: "key query parameter is required" });
        }

        const url = await createPresignedGetUrl(config.aws_s3_bucket, key);
        res.status(200).json({ url });
    } catch (err) {
        console.error("presignDownload error:", err);
        res.status(500).json({ message: "Failed to presign download" });
    }
};
