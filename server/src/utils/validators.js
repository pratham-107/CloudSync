const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const uploadUrlSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('Size must be positive'),
  folderId: z.string().nullable().optional(),
});

const confirmUploadSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  s3Key: z.string().min(1, 'S3 key is required'),
  name: z.string().min(1, 'Name is required'),
  originalName: z.string().min(1, 'Original name is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('Size must be positive'),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

const updateAssetSchema = z.object({
  name: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  isStarred: z.boolean().optional(),
});

const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255),
  parentId: z.string().nullable().optional(),
});

const renameFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(255),
});

const createShareSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  expiresAt: z.string().datetime().nullable().optional(),
  password: z.string().min(1).nullable().optional(),
  maxAccess: z.number().positive().nullable().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  uploadUrlSchema,
  confirmUploadSchema,
  updateAssetSchema,
  createFolderSchema,
  renameFolderSchema,
  createShareSchema,
};
