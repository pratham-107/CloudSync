# CloudSync — API Reference

## Base URL

```
Development: http://localhost:5000/api
Production:  https://api.cloudsync.com/api
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header.

```
Authorization: Bearer <jwt_token>
```

### Token Lifecycle

- **Access Token**: Valid for 7 days (configurable)
- **Refresh Token**: Valid for 30 days
- **Token Format**: JWT (HS256 algorithm)

---

## Auth Endpoints

### POST /auth/register

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Validation:**
- Email: valid format, unique
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Name: min 2 chars, max 100

**Response (201 Created):**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "storageLimit": 5368709120,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `409 Conflict` — Email already registered
- `400 Bad Request` — Validation error (returns field-level errors)

---

### POST /auth/login

Authenticate and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 604800,
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "storageUsed": 104857600,
    "storageLimit": 5368709120
  }
}
```

**Error Responses:**
- `401 Unauthorized` — Invalid credentials
- `423 Locked` — Account temporarily locked after failed attempts

---

### POST /auth/refresh

Refresh an expired access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 604800
}
```

**Error Responses:**
- `401 Unauthorized` — Invalid or expired refresh token

---

## Asset Endpoints

### GET /assets

List assets in a folder.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `folderId` | string | `null` (root) | Folder ID to list assets from |
| `page` | int | 1 | Page number |
| `limit` | int | 50 | Items per page |
| `sort` | string | `createdAt` | Sort field: `name`, `size`, `createdAt` |
| `order` | string | `desc` | Sort order: `asc`, `desc` |
| `search` | string | — | Search query (searches name and tags) |

**Response (200 OK):**
```json
{
  "assets": [
    {
      "assetId": "507f1f77bcf86cd799439012",
      "name": "project-specs.pdf",
      "originalName": "Project Specs v2.pdf",
      "mimeType": "application/pdf",
      "size": 2457600,
      "s3Url": "https://cdn.cloudsync.com/userId/uuid-project-specs.pdf",
      "thumbnailUrl": null,
      "tags": ["work", "q1-2024"],
      "isStarred": false,
      "folderId": "507f1f77bcf86cd799439010",
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 124,
    "totalPages": 3
  }
}
```

---

### POST /assets/upload-url

Request a pre-signed URL for direct S3 upload.

**Request:**
```json
{
  "filename": "vacation-photo.jpg",
  "mimeType": "image/jpeg",
  "size": 5242880,
  "folderId": "507f1f77bcf86cd799439010"
}
```

**Validation:**
- File size must not exceed remaining storage quota
- MIME type must be in allowed list
- Filename must be valid (no path traversal)

**Response (200 OK):**
```json
{
  "uploadUrl": "https://your-bucket.s3.amazonaws.com/userId/uuid-vacation-photo.jpg?X-Amz-Algorithm=...",
  "s3Key": "userId/uuid-vacation-photo.jpg",
  "assetId": "507f1f77bcf86cd439013",
  "expiresIn": 900
}
```

**Error Responses:**
- `400 Bad Request` — Invalid file type or size exceeds quota
- `404 Not Found` — Folder does not exist or does not belong to user

---

### POST /assets

Confirm upload and save asset metadata after S3 upload succeeds.

**Request:**
```json
{
  "assetId": "507f1f77bcf86cd439013",
  "s3Key": "userId/uuid-vacation-photo.jpg",
  "name": "vacation-photo.jpg",
  "originalName": "Vacation Photo.jpg",
  "mimeType": "image/jpeg",
  "size": 5242880,
  "folderId": "507f1f77bcf86cd799439010",
  "tags": ["personal", "2024"]
}
```

**Response (201 Created):**
```json
{
  "assetId": "507f1f77bcf86cd439013",
  "name": "vacation-photo.jpg",
  "s3Url": "https://cdn.cloudsync.com/userId/uuid-vacation-photo.jpg",
  "size": 5242880,
  "createdAt": "2024-01-15T11:05:00Z"
}
```

**Error Responses:**
- `400 Bad Request` — S3 key validation failed
- `409 Conflict` — Asset ID already confirmed

---

### GET /assets/:assetId

Get detailed asset information.

**Response (200 OK):**
```json
{
  "assetId": "507f1f77bcf86cd439013",
  "name": "vacation-photo.jpg",
  "originalName": "Vacation Photo.jpg",
  "mimeType": "image/jpeg",
  "size": 5242880,
  "s3Url": "https://cdn.cloudsync.com/userId/uuid-vacation-photo.jpg",
  "thumbnailUrl": "https://cdn.cloudsync.com/userId/thumb-uuid-vacation-photo.jpg",
  "tags": ["personal", "2024"],
  "isStarred": true,
  "folderId": "507f1f77bcf86cd799439010",
  "folderPath": "/Photos/2024",
  "createdAt": "2024-01-15T11:05:00Z",
  "updatedAt": "2024-01-15T11:05:00Z"
}
```

---

### PATCH /assets/:assetId

Update asset metadata.

**Request:**
```json
{
  "name": "renamed-photo.jpg",
  "tags": ["personal", "2024", "summer"],
  "isStarred": true
}
```

**Response (200 OK):**
```json
{
  "assetId": "507f1f77bcf86cd439013",
  "name": "renamed-photo.jpg",
  "tags": ["personal", "2024", "summer"],
  "isStarred": true,
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

---

### DELETE /assets/:assetId

Delete an asset (removes from S3 and database).

**Response (204 No Content)**

**Error Responses:**
- `403 Forbidden` — Asset does not belong to user
- `404 Not Found` — Asset does not exist

---

## Folder Endpoints

### POST /folders

Create a new folder.

**Request:**
```json
{
  "name": "Work Documents",
  "parentId": "507f1f77bcf86cd799439010"
}
```

**Response (201 Created):**
```json
{
  "folderId": "507f1f77bcf86cd799439014",
  "name": "Work Documents",
  "parentId": "507f1f77bcf86cd799439010",
  "path": "/root/Work Documents",
  "createdAt": "2024-01-15T12:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` — Folder name invalid or duplicate in same parent
- `404 Not Found` — Parent folder does not exist

---

### GET /folders

Get folder tree structure.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `parentId` | string | `null` | Get children of specific folder |

**Response (200 OK):**
```json
{
  "folders": [
    {
      "folderId": "507f1f77bcf86cd799439010",
      "name": "root",
      "path": "/root",
      "children": [
        {
          "folderId": "507f1f77bcf86cd799439014",
          "name": "Work Documents",
          "path": "/root/Work Documents",
          "children": []
        }
      ]
    }
  ]
}
```

---

### PATCH /folders/:folderId

Rename a folder.

**Request:**
```json
{
  "name": "Updated Folder Name"
}
```

**Response (200 OK):**
```json
{
  "folderId": "507f1f77bcf86cd799439014",
  "name": "Updated Folder Name",
  "path": "/root/Updated Folder Name",
  "updatedAt": "2024-01-15T13:00:00Z"
}
```

---

### DELETE /folders/:folderId

Delete a folder and all its contents recursively.

**Response (204 No Content)**

**Warning:** This permanently deletes all assets within the folder and its subfolders.

---

## Share Endpoints

### POST /shares

Create a shareable link for an asset.

**Request:**
```json
{
  "assetId": "507f1f77bcf86cd439013",
  "expiresAt": "2024-02-15T00:00:00Z",
  "password": "optional-password",
  "maxAccess": 10
}
```

**Response (201 Created):**
```json
{
  "shareId": "507f1f77bcf86cd799439015",
  "token": "abc123def456",
  "shareUrl": "https://app.cloudsync.com/s/abc123def456",
  "expiresAt": "2024-02-15T00:00:00Z",
  "maxAccess": 10,
  "createdAt": "2024-01-15T14:00:00Z"
}
```

---

### GET /shares/:token

Access a shared asset.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `password` | string | Conditional | Required if share has password protection |

**Response (200 OK):**
```json
{
  "asset": {
    "name": "vacation-photo.jpg",
    "mimeType": "image/jpeg",
    "size": 5242880,
    "s3Url": "https://cdn.cloudsync.com/userId/uuid-vacation-photo.jpg"
  },
  "downloadUrl": "https://cdn.cloudsync.com/userId/uuid-vacation-photo.jpg?signed=true",
  "expiresIn": 3600
}
```

**Error Responses:**
- `401 Unauthorized` — Password required but not provided or incorrect
- `410 Gone` — Share link expired or revoked
- `429 Too Many Requests` — Max access limit reached

---

### DELETE /shares/:shareId

Revoke a shareable link.

**Response (204 No Content)**

---

## Error Response Format

All errors follow this standardized structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "status": 400,
    "timestamp": "2024-01-15T12:00:00Z",
    "path": "/api/assets",
    "details": {
      "filename": ["Filename is required"],
      "size": ["File size exceeds storage quota"]
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `INVALID_FILE_TYPE` | 400 | File type not allowed |
| `STORAGE_QUOTA_EXCEEDED` | 400 | User storage limit reached |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User lacks permission for resource |
| `RESOURCE_NOT_FOUND` | 404 | Asset, folder, or share not found |
| `CONFLICT` | 409 | Resource already exists |
| `SHARE_EXPIRED` | 410 | Share link has expired |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limits

| Endpoint Group | Limit | Window |
|----------------|-------|--------|
| Auth (login/register) | 5 requests | 1 minute |
| File uploads | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Share access | 20 requests | 1 minute |

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705321200
```
