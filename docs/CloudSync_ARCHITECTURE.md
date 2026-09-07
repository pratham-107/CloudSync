# CloudSync — Architecture Documentation

## System Overview

CloudSync is a full-stack media asset management platform built with a decoupled architecture:

- **Frontend**: React 19 SPA with Redux Toolkit for state management
- **Backend**: Express.js REST API with MongoDB persistence
- **Storage**: AWS S3 for object storage with direct browser uploads
- **CDN**: AWS CloudFront for global asset delivery

## Component Architecture

```
Client Layer (Browser)
  + React Components + Redux Store + RTK Query + S3 Direct Upload
         |
         | HTTP / REST
         v
    Nginx (API Gateway)
      - SSL termination
      - Static asset serving (React build)
      - Rate limiting
      - Reverse proxy to Express
         |
         v
    Express.js Server
      + Auth Router    + Asset Router   + Folder Router  + Share Router
      + Auth Ctrl      + Asset Ctrl     + Folder Ctrl    + Share Ctrl
      + JWT Service    + S3 Service     + Folder Service + Token Service
         |
         +---> MongoDB (Users, Assets, Folders, Shares)
         +---> AWS S3 (File Objects)
         +---> Redis (Sessions)
```

## Data Flow Diagrams

### 1. File Upload Flow

```
User drops file(s) on UI
        |
        v
UploadQueue Component
  <- Redux slice tracks each file's progress
        |
        |-> Request pre-signed URL from /api/assets/upload-url
        |      (filename, contentType, size)
        v
   Express API (Backend)
     <- Validates user quota, generates S3 presigned PUT URL
        |
        |-> Returns: { uploadUrl, s3Key, fields }
        v
   Browser (Client)
     <- XHR PUT directly to S3 (bypasses server)
     <- Progress events dispatched to Redux
        |
        |-> PUT file bytes to S3 presigned URL
        v
   AWS S3 (Storage)
     <- Stores object, returns 200 OK
        |
        |-> 200 OK
        v
   Browser (Client)
     <- Confirms upload, POST /api/assets with metadata
        |
        |-> POST /api/assets { s3Key, name, size, mimeType, folderId }
        v
   Express API (Backend)
     <- Saves metadata to MongoDB, updates user storageUsed
        |
        |-> 201 Created + asset object
        v
   RTK Query (Redux)
     <- Auto-invalidates 'Asset' cache tag
     <- Triggers refetch of current folder
        |
        v
   FileManager Component
     <- Re-renders with new asset in grid/list
```

### 2. Share Link Flow

```
User selects asset -> clicks "Share"
        |
        v
   ShareModal Component
     <- User configures: expiry, password (optional)
        |
        |-> POST /api/shares { assetId, expiresAt, password, maxAccess }
        v
   Express API (Backend)
     <- Generates unique token, hashes password if provided
     <- Saves to MongoDB with TTL index on expiresAt
        |
        |-> Returns: { shareUrl: "https://app.com/s/abc123", token }
        v
   ShareModal (UI)
     <- Displays copyable link + QR code

// Later: Recipient accesses link
Recipient -> GET /api/shares/abc123
        |
        v
   Express API (Backend)
     <- Validates token, checks expiry, access count, password
     <- Increments accessCount
        |
        |-> Returns: { asset, downloadUrl (CloudFront signed) }
        v
   Browser (Recipient)
     <- Shows preview or triggers download
```

## State Management Architecture

### Redux Store Design Principles

1. **Normalized State**: Assets and folders stored by ID, not nested arrays
2. **RTK Query for Server State**: API data cached automatically, no manual fetching
3. **Local UI State in Redux**: Sidebar, modals, selection managed centrally
4. **Upload Progress in Redux**: Real-time tracking of multi-file uploads

### Selector Pattern

```javascript
// Selectors for computed data
const selectCurrentFolderAssets = createSelector(
  [selectAssets, selectCurrentFolderId, selectSortBy],
  (assets, folderId, sortBy) => {
    return Object.values(assets)
      .filter(a => a.folderId === folderId)
      .sort((a, b) => sortBy === 'date' 
        ? b.createdAt - a.createdAt 
        : a.name.localeCompare(b.name)
      );
  }
);
```

## Security Architecture

### Authentication Flow

```
1. User registers/logs in
   -> POST /api/auth/login { email, password }

2. Backend validates credentials
   -> bcrypt.compare(password, hash)
   -> Generate JWT (userId, role, exp)

3. Response includes:
   { accessToken, refreshToken }

4. Frontend stores token in Redux + localStorage

5. Subsequent requests include:
   Authorization: Bearer <accessToken>

6. Backend middleware:
   -> Verify JWT signature
   -> Decode payload
   -> Attach req.user
   -> Check role permissions
```

### Authorization Matrix

| Endpoint | Guest | User | Admin |
|----------|-------|------|-------|
| `GET /api/assets` | No | Own | All |
| `POST /api/assets` | No | Yes | Yes |
| `DELETE /api/assets/:id` | No | Own | All |
| `GET /api/folders` | No | Own | All |
| `POST /api/shares` | No | Own | All |
| `GET /api/shares/:token` | Yes* | Yes | Yes |

*Only with valid share token

### S3 Security

- **Pre-signed URLs**: Time-limited (15 min), scoped to specific object key
- **Bucket Policy**: Deny all public access; only IAM role + pre-signed URLs
- **CloudFront**: Signed URLs for share links with expiry
- **CORS**: Strict origin whitelist

## Performance Optimizations

| Strategy | Implementation |
|----------|---------------|
| **Direct S3 Upload** | Browser uploads directly to S3, bypassing Express server for file bytes |
| **Lazy Loading** | Assets load on scroll with intersection observer |
| **Image Thumbnails** | S3 Lambda generates thumbnails on upload; UI shows thumbs, full on click |
| **RTK Query Caching** | Folder assets cached; invalidated only on create/update/delete |
| **Debounced Search** | 300ms debounce on search input to reduce API calls |
| **Virtual Scrolling** | Large folders render only visible items |

## Scalability Considerations

| Bottleneck | Mitigation |
|------------|------------|
| Large file uploads | Chunked upload (5MB parts) with resumable progress |
| Many concurrent uploads | Queue limit (5 active), rest pending in Redux |
| Deep folder nesting | Materialized path pattern for O(1) subtree queries |
| Storage growth | S3 lifecycle rules (IA after 30d, Glacier after 90d) |
| High read traffic | CloudFront caching + RTK Query client-side cache |

## Error Handling Strategy

| Error | Frontend | Backend |
|-------|----------|---------|
| Upload failed | Retry button, resume from chunk | Log to monitoring |
| S3 pre-signed expired | Auto-refresh URL, retry | 410 Gone |
| Quota exceeded | Disable upload, show upgrade | 402 Payment Required |
| Invalid share token | Show "Link expired" page | 410 Gone |
| Network offline | Queue uploads, retry on reconnect | N/A |
