import { NextResponse } from "next/server";
import { generateUniqueFileName, uploadToR2 } from "@/lib/r2";

export async function POST(req: Request) {
    try {
        // 获取表单数据
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // 生成唯一文件名
        const fileName = generateUniqueFileName(file.name);

        // 将文件转换为 Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 上传到 R2
        const url = await uploadToR2(buffer, fileName, file.type);

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Error uploading file" },
            { status: 500 }
        );
    }
} 