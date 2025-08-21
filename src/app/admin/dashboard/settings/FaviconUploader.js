"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadFavicon } from "@/app/services/api";

export default function FaviconUploader({ value, onChange, disabled }) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFavicon(file);
      setPreview(res.url);
      onChange(res.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {preview && (
        <Image src={preview} alt="Favicon" width={32} height={32} className="rounded" />
      )}
      <input
        type="file"
        accept="image/x-icon,image/png"
        onChange={handleFile}
        disabled={disabled || uploading}
      />
    </div>
  );
}
