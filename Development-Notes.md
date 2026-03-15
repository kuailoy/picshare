# Development Notes

More details about development side thinking and recording.

## UI layer and Data layer seperation

Todo: Sketch

### Storage Abstraction

- Configurable storage solution: cloudinary / S3 /...

- Data layer is unaware of which storage provider is being used

...

#### File Structure

```
src/
  app/
    page.tsx
    ...

  server/
    data/
      index.ts

    storage/
      cloudinary.ts
      s3.ts
      ...
      index.ts

  types/
    index.ts
```

#### Provider Selection

src/server/storage/index.ts

```typescript
import * as cloudinary from "./cloudinary"
import * as s3 from "./s3"

const provider = process.env.STORAGE_PROVIDER

export const storage =
  provider === "s3"
    ? s3
    : cloudinary
```

#### Cloudinary provider example:
src/server/storage/cloudinary.ts
```typescript
import { v2 as cloudinary } from "cloudinary"

export async function searchGalleryImages() {
  return await cloudinary.search
    .expression(`...`)
    // ...
  }))
```

#### Data layer
server/data/gallery.ts

```typescript
import { storage } from "../storage"

export async function getGalleryImages() {
  return storage.searchGalleryImages()
}
//...
```

#### UI layer

```typescript
import { getGalleryImages } from "@/server/data"

export default async function Page() {
  const images = await getGalleryImages()

  return ...
}
```

#### For Future Use
switch storage
only edit `.env`
```
STORAGE_PROVIDER=s3
```

add DB just edit
`server/data/**`

UI doesn't have to change at all