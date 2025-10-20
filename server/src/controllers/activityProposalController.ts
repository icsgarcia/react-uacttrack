import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import config from "../config/config";
import s3Client from "../services/s3Service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AuthRequest } from "../middlewares/authMiddleware";
import multer from "multer";
import { parse } from "path";

const prisma = new PrismaClient();

const uploadFileToS3 = async (file: Express.Multer.File): Promise<string> => {
    const key = `forms/${Date.now()}_${file.originalname}`;
    const command = new PutObjectCommand({
        Bucket: config.aws_s3_bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    try {
        await s3Client.send(command);
        return key;
    } catch (error) {
        throw new Error(`Error uploading ${file.originalname} to S3: ${error}`);
    }
};

export const createActivityProposal = async (
    req: AuthRequest,
    res: Response
) => {
    const {
        attendees,
        date,
        startTime,
        endTime,
        venue,
        title,
        participants,
        purpose,
        requirements,
    } = req.body;

    const files = req.files as
        | {
              [fieldname: string]: Express.Multer.File[];
          }
        | undefined;
    try {
        let cashFormData: string | null = null;
        let foodFormData: string | null = null;
        let supplyFormData: string | null = null;
        let reproductionFormData: string | null = null;
        let otherFormData: string | null = null;

        if (files?.cashForm?.[0]) {
            cashFormData = await uploadFileToS3(files.cashForm[0]);
        }
        if (files?.foodForm?.[0]) {
            foodFormData = await uploadFileToS3(files.foodForm[0]);
        }
        if (files?.supplyForm?.[0]) {
            supplyFormData = await uploadFileToS3(files.supplyForm[0]);
        }
        if (files?.reproductionForm?.[0]) {
            reproductionFormData = await uploadFileToS3(
                files.reproductionForm[0]
            );
        }
        if (files?.otherForm?.[0]) {
            otherFormData = await uploadFileToS3(files.otherForm[0]);
        }
        await prisma.activityProposal.create({
            data: {
                cashForm: cashFormData,
                foodForm: foodFormData,
                supplyForm: supplyFormData,
                reproductionForm: reproductionFormData,
                otherForm: otherFormData,
                attendees: parseInt(attendees),
                date,
                startTime,
                endTime,
                venue,
                title,
                participants,
                purpose,
                requirements,
                userId: Number(req.user?.userId),
            },
        });
        res.status(201).json({
            message: "Activity Proposal created successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating Activity Proposal",
            error,
        });
    }
};
