'use client'
import React from 'react'
import { ImageUp, WandSparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

function ImageUpload() {
    const AiModelList = [
        {
            name: 'Gemini',
            icon: '/gemini.png'
        },
        {
            name: 'DeepSeek',
            icon: '/deepseek.png'
        },
        {
            name: 'Claude',
            icon: '/claude.png'
        },
        {
            name: 'GPT-4',
            icon: '/gpt-4.png'
        }
    ];
    // 状态管理
    const [dragActive, setDragActive] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<string>('');
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadedUrl, setUploadedUrl] = React.useState<string>('');

    // 当文件改变时生成预览URL
    React.useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // 清理函数：组件卸载时释放URL
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    // 处理文件上传
    const handleUpload = async (fileToUpload: File) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', fileToUpload);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setUploadedUrl(data.url);
            toast.success('图片上传成功！');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('图片上传失败，请重试');
        } finally {
            setIsUploading(false);
        }
    };

    // 处理文件拖拽事件
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // 处理文件放下事件
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        // 获取拖放的第一个文件并保存
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            await handleUpload(droppedFile);
        }
    };

    // 处理文件选择事件
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            await handleUpload(selectedFile);
        }
    };

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                <div
                    className={`bg-gray-100 rounded-lg p-4 flex flex-col justify-center items-center border-2 border-dashed relative
                        ${dragActive ? 'border-blue-500 bg-blue-50' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                    {preview ? (
                        <div className="relative w-full aspect-video">
                            <img
                                src={preview}
                                alt="Preview"
                                className="rounded-lg object-contain w-full h-full"
                            />
                        </div>
                    ) : (
                        <>
                            <ImageUp className='h-10 w-10' />
                            <h2 className='text-lg font-bold mt-3'>Upload Image</h2>
                            <p className='text-gray-500 mt-3'>
                                {file ? `Selected: ${file.name}` : 'Drag and drop or click to upload'}
                            </p>
                        </>
                    )}
                    <div className='p-5 mt-3 flex justify-center items-center border-2 border-dashed rounded-lg w-full'>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <Button 
                            onClick={() => document.getElementById('file-upload')?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                preview ? 'Change Image' : 'Select Image'
                            )}
                        </Button>
                    </div>
                </div>
                <div className='bg-gray-100 rounded-lg p-4'>
                    <h2 className='text-lg font-bold'>Select AI Model</h2>
                    <Select>
                        <SelectTrigger className="w-full focus:ring-1 focus:ring-gray-300">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {AiModelList.map((model) => (
                                <SelectItem key={model.name} value={model.name}>
                                    <div className='flex items-center gap-2'>
                                        <img src={model.icon} alt={model.name} className='w-4 h-4 rounded-full' />
                                        {model.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <p className='text-lg font-bold mt-3'>Enter Description about your webpage</p>
                    <Textarea
                        placeholder='write about your webpage'
                        className='mt-3 h-40'
                    />
                </div>
            </div>
            <div className='mt-10 flex justify-center'>
                <Button><WandSparkles className='h-4 w-4 mr-2' />Generate</Button>
            </div>
        </div>
    )
}

export default ImageUpload
