'use client'
import React from 'react'
import { ImageUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ImageUpload() {
    // 状态管理：dragActive 标记拖拽状态，file 保存选择的文件
    const [dragActive, setDragActive] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

    // 处理文件拖拽事件
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // 当文件被拖入或在区域内移动时，设置拖拽状态为 true
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // 处理文件放下事件
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        // 获取拖放的第一个文件并保存
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    // 处理文件选择事件（点击上传）
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {/* 文件上传区域：支持拖拽和点击上传 */}
                <div 
                    className={`bg-gray-100 rounded-lg p-4 flex flex-col justify-center items-center border-2 border-dashed
                        ${dragActive ? 'border-blue-500 bg-blue-50' : ''}`}  // 拖拽时改变样式
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <ImageUp className='h-10 w-10' />
                    <h2 className='text-lg font-bold mt-3'>Upload Image</h2>
                    {/* 显示已选文件名或上传提示 */}
                    <p className='text-gray-500 mt-3'>
                        {file ? `Selected: ${file.name}` : 'Drag and drop or click to upload'}
                    </p>
                    <div className='p-5 mt-3 flex justify-center items-center border-2 border-dashed rounded-lg w-full'>
                        {/* 隐藏的文件输入框 */}
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {/* 点击按钮触发文件选择 */}
                        <Button onClick={() => document.getElementById('file-upload')?.click()}>
                            Select Image
                        </Button>
                    </div>
                </div>
                <div className='bg-gray-100 rounded-lg p-4'>
                    <p className='text-gray-500'>User input Area</p>
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
