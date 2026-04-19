// app/api/uploads/sign/route.ts
import { NextResponse } from 'next/server'
import { generateUploadSignature } from '@/server/storage/cloudinary'
import type { NextRequest } from 'next/server'


// Param folder is not required. If the server can read the userID from the session,
// it can be used to create user-specific folders.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const folder = typeof body.folder === 'string' ? body.folder : undefined

  const data = generateUploadSignature({
    folder,
  })

  return NextResponse.json(data)
}
