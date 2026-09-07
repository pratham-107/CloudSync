# CloudSync — Setup & Installation Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime for both frontend and backend |
| npm | 10+ | Package manager |
| Docker | 24+ | Containerization |
| Docker Compose | 2.20+ | Multi-service orchestration |
| AWS CLI | 2+ | S3 bucket management |
| Git | 2.40+ | Version control |

## Directory Structure

```
cloudsync/
├── client/                    # React 19 Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── features/          # Redux slices (auth, assets, folders, uploads, ui)
│   │   ├── pages/             # Route-level pages
│   │   ├── services/          # RTK Query API definitions
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Redux store configuration
│   │   ├── utils/             # Helpers and constants
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
│
├── server/                    # Express.js Backend
│   ├── src/
│   │   ├── config/            # DB, AWS, Redis config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, error handling, validation
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic (S3, auth, shares)
│   │   ├── utils/             # Helpers, validators
│   │   └── app.js
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── docker/
│   ├── Dockerfile.client
│   ├── Dockerfile.server
│   └── docker-compose.yml
│
└── README.md
```

## Local Development Setup

### Step 1: Clone & Navigate

```bash
git clone https://github.com/yourusername/cloudsync.git
cd cloudsync
```

### Step 2: Configure AWS S3

1. **Create S3 Bucket:**
```bash
aws s3api create-bucket --bucket your-cloudsync-bucket --region us-east-1
```

2. **Enable CORS:**
```bash
aws s3api put-bucket-cors --bucket your-cloudsync-bucket --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:3000"],
      "AllowedMethods": ["PUT", "GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
```

3. **Block Public Access:**
```bash
aws s3api put-public-access-block --bucket your-cloudsync-bucket   --public-access-block-configuration   "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

4. **Create IAM User with S3 Access:**
```bash
aws iam create-user --user-name cloudsync-dev
aws iam attach-user-policy --user-name cloudsync-dev   --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam create-access-key --user-name cloudsync-dev
```
Save the `AccessKeyId` and `SecretAccessKey`.

### Step 3: Start Infrastructure

```bash
docker-compose up -d mongo redis
```

This starts:
- **MongoDB** on port `27017`
- **Redis** on port `6379`

### Step 4: Configure Backend

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloudsync
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRATION=7d

# AWS
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-cloudsync-bucket

# Redis
REDIS_URL=redis://localhost:6379

# Optional: CloudFront
AWS_CLOUDFRONT_DOMAIN=
```

> **Generate JWT Secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Step 5: Install & Run Backend

```bash
cd server
npm install
npm run dev
```

Backend starts on `http://localhost:5000`.

### Step 6: Configure Frontend

```bash
cd client
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_S3_BUCKET=your-cloudsync-bucket
REACT_APP_AWS_REGION=us-east-1
```

### Step 7: Install & Run Frontend

```bash
cd client
npm install
npm start
```

Frontend starts on `http://localhost:3000`.

### Step 8: Verify Setup

1. Open `http://localhost:3000`
2. Register a new account
3. Create a folder
4. Upload a test file
5. Verify file appears in S3 bucket:
   ```bash
   aws s3 ls s3://your-cloudsync-bucket/
   ```

## Docker Full-Stack Setup

### Development

```bash
# From project root
docker-compose up -d
```

This starts:
- MongoDB
- Redis
- Backend (with hot reload via volume mount)
- Frontend (with React dev server)
- Nginx (reverse proxy)

### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## IDE Configuration

### VS Code Extensions (Recommended)

**Frontend:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Redux DevTools (browser extension)

**Backend:**
- ESLint
- Prettier
- REST Client (for testing APIs)

### VS Code Launch Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "cwd": "${workspaceFolder}/server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "envFile": "${workspaceFolder}/server/.env"
    }
  ]
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error on S3 upload | Verify CORS config matches your frontend origin exactly |
| `CredentialsError` | Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in server/.env |
| MongoDB connection refused | Ensure `docker-compose up -d mongo` is running |
| Port 3000 already in use | Kill process: `npx kill-port 3000` or change PORT in client/.env |
| Upload stuck at 0% | Check browser console for S3 pre-signed URL errors |
| JWT expired quickly | Check JWT_EXPIRATION value (use `7d` for dev) |
| Redis connection error | Ensure Redis container is running: `docker ps` |

## Useful Commands

```bash
# Backend
npm run dev          # Start with nodemon
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint

# Frontend
npm start            # Start dev server
npm test             # Run tests
npm run build        # Production build
npm run lint         # Run ESLint

# Docker
docker-compose logs -f server    # View backend logs
docker-compose logs -f client    # View frontend logs
docker-compose exec mongo mongosh  # Access MongoDB shell
```
