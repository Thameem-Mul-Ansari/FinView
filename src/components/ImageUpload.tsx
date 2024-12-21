import React, { useState, useCallback } from 'react';
import { UserCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageChange: (base64: string) => void;
}

export default function ImageUpload({ onImageChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      alert('Image size should be less than 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleImageChange}
        className="hidden"
        id="profile-pic"
      />
      <label
        htmlFor="profile-pic"
        className="cursor-pointer block"
      >
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="w-20 h-20 text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-sm">Change Photo</span>
          </div>
        </div>
      </label>
    </div>
  );
}