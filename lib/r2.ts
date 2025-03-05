import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 创建 S3 客户端实例
const R2_CLIENT = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

// 生成唯一的文件名
export const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
};

// 上传文件到 R2
export async function uploadToR2(file: Buffer, fileName: string, contentType: string) {
    try {
        // 配置上传参数
        const params = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: file,
            ContentType: contentType,
        };

        // 执行上传
        await R2_CLIENT.send(new PutObjectCommand(params));

        // 返回文件的公共访问URL
        return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        throw error;
    }
} 