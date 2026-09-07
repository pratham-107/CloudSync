# CloudSync

> A Dropbox-style media asset manager with real-time upload progress, Redux Toolkit state management, and direct-to-S3 streaming uploads.

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-purple)](https://redux-toolkit.js.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-orange)](https://aws.amazon.com/s3/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Frontend State Management](#frontend-state-management)
- [AWS Integration](#aws-integration)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Overview

CloudSync is a full-stack media asset management platform that allows users to upload, organize, and share files through a modern React dashboard. It features real-time upload progress tracking, folder-based organization, shareable links with expiry, and direct-to-S3 streaming for efficient large file handling.

### Why This Project?

- Demonstrates **standalone React 19** (not Next.js) with modern patterns
- Showcases **Redux Toolkit + RTK Query** for complex state management
- Implements **Express.js middleware pipeline** for file handling
- Integrates **AWS S3** with pre-signed URLs for secure uploads
- Containerized with **Docker** for consistent deployment

---

## Features

| Feature | Description |
|---------|-------------|
| **Drag & Drop Upload** | HTML5 drag-and-drop with chunked upload support |
| **Real-Time Progress** | Redux Toolkit tracks upload progress per file with optimistic UI |
| **Folder Management** | Create, rename, move, and nest folders with tree view |
| **S3 Direct Upload** | Pre-signed URLs allow browser -> S3 direct streaming (bypasses server) |
| **Shareable Links** | Generate time-limited public links with optional password protection |
| **Asset Preview** | Image thumbnails, video preview, document icons |
| **Search & Filter** | Full-text search across filenames, tags, and metadata |
| **Responsive Design** | Mobile-first layout with collapsible sidebar |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Redux Toolkit (RTK) | Global state management |
| RTK Query | Data fetching, caching, optimistic updates |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| React Dropzone | Drag-and-drop file handling |
| Axios | HTTP client for non-RTK requests |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js 4 | Web framework |
| MongoDB 7 | Document database |
| Mongoose 8 | ODM |
| Multer | File upload middleware |
| AWS SDK v3 | S3 integration |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local orchestration |
| AWS S3 | Object storage |
| AWS CloudFront | CDN for asset delivery |
| Nginx | Reverse proxy & static serving |

---

## Architecture

```
Browser (Client)
  + React UI Components + Redux Store + RTK Query + S3 Direct Upload
         |
         | HTTP / REST
         v
    Nginx (API Gateway + Static Files)
         |
         v
    Express.js API Server
      + Auth Router + Asset Router + Folder Router + Share Router
         |
         +---> MongoDB (Users, Assets, Folders, Shares)
         +---> AWS S3 (File Objects)
         +---> Redis (Sessions)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ or yarn 1.22+
- Docker & Docker Compose
- AWS Account (for S3)
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/cloudsync.git
cd cloudsync

# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d

# Access the app
open http://localhost:3000
```

### AWS Configuration

1. Create an S3 bucket with CORS enabled:
```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>http://localhost:3000</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

2. Create an IAM user with S3 permissions and note the access keys.

3. Create `.env` files:

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloudsync
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION=7d
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
REDIS_URL=redis://localhost:6379
```

**Frontend (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_S3_BUCKET=your-bucket-name
REACT_APP_AWS_REGION=us-east-1
```

---

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Authenticate and get JWT |
| `POST` | `/api/auth/refresh` | Refresh access token |

### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assets` | List assets (folder-scoped) |
| `POST` | `/api/assets/upload-url` | Get pre-signed S3 upload URL |
| `POST` | `/api/assets` | Confirm upload & save metadata |
| `GET` | `/api/assets/:id` | Get asset details |
| `DELETE` | `/api/assets/:id` | Delete asset (S3 + DB) |
| `PATCH` | `/api/assets/:id` | Update metadata (name, tags) |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/folders` | Create folder |
| `GET` | `/api/folders` | Get folder tree |
| `PATCH` | `/api/folders/:id` | Rename folder |
| `DELETE` | `/api/folders/:id` | Delete folder (recursive) |

### Share Links

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shares` | Create shareable link |
| `GET` | `/api/shares/:token` | Access shared asset |
| `DELETE` | `/api/shares/:id` | Revoke share link |

---

## Database Schema

### Collections

#### `users`
```javascript
{
  _id: ObjectId,
  email: String,           // unique, indexed
  passwordHash: String,    // bcrypt
  name: String,
  storageUsed: Number,     // bytes
  storageLimit: Number,    // default: 5GB
  createdAt: Date,
  updatedAt: Date
}
```

#### `assets`
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId,       // ref: users
  folderId: ObjectId,      // ref: folders, nullable (root)
  name: String,
  originalName: String,
  mimeType: String,        // "image/jpeg", "video/mp4", etc.
  size: Number,            // bytes
  s3Key: String,           // "userId/uuid-filename.ext"
  s3Url: String,           // CloudFront URL
  thumbnailKey: String,    // optional
  tags: [String],
  isStarred: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### `folders`
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId,       // ref: users
  parentId: ObjectId,      // ref: folders, nullable (root)
  name: String,
  path: String,            // materialized path: "/root/docs/work"
  createdAt: Date,
  updatedAt: Date
}
```

#### `shares`
```javascript
{
  _id: ObjectId,
  assetId: ObjectId,       // ref: assets
  token: String,           // unique, indexed
  passwordHash: String,    // optional
  expiresAt: Date,         // optional
  accessCount: Number,
  maxAccess: Number,       // optional
  createdAt: Date
}
```

### Indexes

```javascript
db.assets.createIndex({ ownerId: 1, folderId: 1, createdAt: -1 })
db.assets.createIndex({ name: "text", tags: "text" })  // full-text search
db.folders.createIndex({ ownerId: 1, path: 1 })
db.shares.createIndex({ token: 1 }, { unique: true })
db.shares.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL
```

---

## Frontend State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: { id, email, name, storageUsed, storageLimit },
    token: "jwt_string",
    isAuthenticated: true
  },

  assets: {
    items: [],           // current folder assets
    selectedIds: [],     // multi-select for batch actions
    viewMode: "grid",    // "grid" | "list"
    sortBy: "date",      // "name" | "date" | "size"
    searchQuery: ""
  },

  folders: {
    tree: [],            // nested folder structure
    currentFolderId: null,
    breadcrumbs: []
  },

  uploads: {
    queue: [
      {
        id: "upload_001",
        file: File,
        progress: 65,
        status: "uploading",  // "pending" | "uploading" | "processing" | "done" | "error"
        error: null
      }
    ]
  },

  ui: {
    sidebarOpen: true,
    modal: null,         // "upload" | "share" | "move" | null
    toast: null
  }
}
```

### RTK Query Setup

```javascript
// apiSlice.js
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Asset', 'Folder', 'Share'],
  endpoints: (builder) => ({
    getAssets: builder.query({
      query: (folderId) => `/assets?folderId=${folderId}`,
      providesTags: ['Asset']
    }),
    createAsset: builder.mutation({
      query: (body) => ({ url: '/assets', method: 'POST', body }),
      invalidatesTags: ['Asset']
    }),
    // ... more endpoints
  })
});
```

### Upload Flow with Optimistic Updates

```
1. User drops files -> dispatch addToUploadQueue(files)
2. For each file:
   a. Request pre-signed URL from backend
   b. Upload directly to S3 (XHR with progress tracking)
   c. On S3 success -> POST /api/assets to save metadata
   d. RTK Query invalidates 'Asset' tag -> auto-refetch folder
   e. Update upload status in Redux store
3. UI shows real-time progress bars via upload slice
```

---

## AWS Integration

### S3 Upload Flow

```
Client                    Backend                    AWS S3
  |                         |                          |
  |-- POST /upload-url ---->|                          |
  |   (filename, mimeType)  |                          |
  |                         |-- generate presigned --->|
  |                         |   URL (PUT, 15min expiry)|
  |<-- presigned URL -------|                          |
  |                         |                          |
  |-- PUT file -------------|------------------------->|
  |   (direct to S3)        |                          |
  |<-- 200 OK --------------|--------------------------|
  |                         |                          |
  |-- POST /assets -------->|                          |
  |   (s3Key, metadata)     |-- save to MongoDB ------>|
  |<-- 201 Created ---------|                          |
```

### S3 Lifecycle Policy

```json
{
  "Rules": [
    {
      "ID": "MoveToInfrequentAccess",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ]
    }
  ]
}
```

---

## Testing

### Frontend Tests

```bash
cd client
npm test              # Run Jest + React Testing Library
npm run test:coverage # Coverage report
```

### Backend Tests

```bash
cd server
npm test              # Run Jest
npm run test:integration  # Integration tests with test DB
```

### Test Scenarios

- **Upload Flow**: Mock S3, verify metadata saved correctly
- **Folder Nesting**: Prevent circular references (A inside B inside A)
- **Share Links**: Verify expiry, password protection, access limits
- **RBAC**: Ensure users cannot access other users' assets
- **Concurrent Uploads**: Multiple files upload simultaneously without state corruption

---

## Deployment

### Docker Production

```bash
# Build images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Production MongoDB Atlas URI |
| `AWS_S3_BUCKET` | Production S3 bucket |
| `AWS_CLOUDFRONT_DOMAIN` | CDN domain for asset delivery |
| `JWT_SECRET` | Strong random string (min 256 bits) |
| `REDIS_URL` | Production Redis/Elasticache URL |

---

## Author

**Pratham Singh** — Full Stack Developer
