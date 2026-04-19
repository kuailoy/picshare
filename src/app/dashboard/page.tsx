'use client';

import { CldUploadWidget } from 'next-cloudinary';

export default function Upload() {
  return (
    <CldUploadWidget uploadPreset="your_unsigned_upload_preset">
      {({ open }) => {
        return (
          <button onClick={() => open()}>
            Upload Files
          </button>
        );
      }}
    </CldUploadWidget>
  );
}