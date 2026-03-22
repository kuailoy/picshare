// app/api/uploads/sign/route.ts
import { NextResponse } from 'next/server'
import { generateUploadSignature } from '@/server/storage/cloudinary'


// Param folder is not required. If the server can read the userID from the session,
// it can be used to create user-specific folders.
export async function POST(folder = 'samples') {
  const data = generateUploadSignature({
    folder,
  })

  return NextResponse.json(data)
}
