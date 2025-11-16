import axiosInstance from "@/api/axios";

interface UploadPlan {
    file: File;
    prefix?: string;
    fieldName: string;
}

interface PresignedUpload {
    key: string;
    url: string;
    contentType: string;
}

// Request pre-signed URLs from backend
async function getPresignedUploads(
    plans: UploadPlan[]
): Promise<PresignedUpload[]> {
    const files = plans.map((p) => ({
        fileName: p.file.name,
        contentType: p.file.type,
        prefix: p.prefix || "forms",
    }));

    const { data } = await axiosInstance.post("/uploads/presign", { files });
    return data.uploads;
}

// Upload file directly to S3 using pre-signed URL
async function uploadToS3(url: string, file: File): Promise<void> {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error(`S3 upload failed: ${response.status}`);
    }
}

// Main upload function
export async function uploadFilesAndCreateAPF(formData: {
    title: string;
    purpose: string;
    participants: string;
    attendees: number;
    requirements: string;
    date: string;
    startTime: string;
    endTime: string;
    cashForm: File | null;
    foodForm: File | null;
    supplyForm: File | null;
    reproductionForm: File | null;
    otherForm: File | null;
    venueId: string;
}) {
    // 1. Build upload plan for files that exist
    const plans: UploadPlan[] = [];
    const fileFields = [
        "cashForm",
        "foodForm",
        "supplyForm",
        "reproductionForm",
        "otherForm",
    ] as const;

    for (const fieldName of fileFields) {
        const file = formData[fieldName];
        if (file) {
            plans.push({ file, prefix: "forms", fieldName });
        }
    }

    // 2. Get pre-signed URLs
    const uploads = plans.length > 0 ? await getPresignedUploads(plans) : [];

    // 3. Upload files to S3
    await Promise.all(
        uploads.map((upload, index) =>
            uploadToS3(upload.url, plans[index].file)
        )
    );

    // 4. Create mapping of field names to S3 keys
    const fileKeys: Record<string, string | null> = {};
    plans.forEach((plan, index) => {
        fileKeys[plan.fieldName] = uploads[index].key;
    });

    // 5. Send form data with S3 keys to backend
    const payload = {
        cashForm: fileKeys.cashForm || null,
        foodForm: fileKeys.foodForm || null,
        supplyForm: fileKeys.supplyForm || null,
        reproductionForm: fileKeys.reproductionForm || null,
        otherForm: fileKeys.otherForm || null,
        attendees: formData.attendees,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venueId: formData.venueId,
        title: formData.title,
        participants: formData.participants,
        purpose: formData.purpose,
        requirements: formData.requirements,
    };

    await axiosInstance.post("/apf/", payload);
}
