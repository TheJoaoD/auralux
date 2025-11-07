'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: File | string
  onChange: (file: File | undefined) => void
  error?: string
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate preview URL
  const getPreviewUrl = (): string | null => {
    if (value instanceof File) {
      return preview
    } else if (typeof value === 'string') {
      return value
    }
    return null
  }

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      onChange(undefined)
      return
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      onChange(undefined)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    onChange(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(undefined)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const previewUrl = getPreviewUrl()

  return (
    <div className="space-y-2">
      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${
              dragActive
                ? 'border-[#C49A9A] bg-[#C49A9A]/10'
                : 'border-[#A1887F] hover:bg-[#A1887F]/10'
            }
          `}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-[#C49A9A]/20">
              <Upload className="h-8 w-8 text-[#C49A9A]" />
            </div>

            <div>
              <p className="text-sm font-medium text-[#A1887F]">
                Clique para fazer upload ou arraste a imagem
              </p>
              <p className="text-xs text-[#A1887F]/60 mt-1">
                JPG, PNG ou WEBP (máx. 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[#C49A9A]">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] text-sm font-medium rounded-lg transition-colors shadow-lg flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Trocar
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
