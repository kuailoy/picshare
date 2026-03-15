import * as cloudinary from './cloudinary'
import * as s3 from './s3'

const provider = process.env.STORAGE_PROVIDER || 'cloudinary'

export const storage = provider === 'cloudinary' ? cloudinary : s3
