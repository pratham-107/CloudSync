# CloudSync

> A modern, neo-brutalist media asset management platform with direct S3 pre-signed streaming, zero-trust expiring share links, in-browser 4K media previewers, and real-time storage quota tracking.

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-purple)](https://redux-toolkit.js.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-orange)](https://aws.amazon.com/s3/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Frontend State Management](#frontend-state-management)
- [AWS S3 Direct Upload Flow](#aws-s3-direct-upload-flow)

---

## Overview

CloudSync is a full-stack media asset manager engineered for creators, studios, and remote teams. It enables users to stream 4K video, scrub lossless audio waveforms, organize media in nested folder trees, and share files through time-limited, password-protected links. Direct-to-S3 pre-signed streaming eliminates server bottlenecks for instant file sync.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Direct S3 Pre-Signed Uploads** | Browser-to-S3 direct streaming via secure pre-signed URLs to eliminate web server bottlenecks. |
| **In-Browser 4K Media Players** | Native multi-format media streaming for 4K video, lossless audio waveforms, RAW/PNG/SVG imagery, and PDF documents. |
| **Zero-Trust Share Links** | Time-limited expiring public URLs (1h, 24h, 7d, never) with optional Bcrypt password protection and view count caps. |
| **Nested Vault Hierarchies** | Organize media with subfolders, breadcrumbs navigation, and drag-and-drop batch movements. |
| **Storage Quota Telemetry** | Real-time 5 GB free tier quota tracking with immediate visual updates upon upload and deletion. |
| **Neo-Brutalist UI** | High-contrast aesthetic with warm cream canvases (`#FAF6EC`), crisp 2px borders, bold shadows, duck mascot, and playful cartoon clouds. |

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit (RTK) & RTK Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20 + Express.js 4
- **Database**: MongoDB 7 + Mongoose 8
- **Cloud Storage**: AWS S3 SDK v3
- **Security & Auth**: JWT (jsonwebtoken), bcryptjs, rate-limiter-flexible
- **File Parsing**: Multer

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- MongoDB instance (local or MongoDB Atlas)
- AWS Account or MinIO (for S3 storage)

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/pratham-107/CloudSync.git
cd CloudSync

# 2. Setup Server
cd server
cp .env.example .env
npm install
npm run dev

# 3. Setup Client
cd ../client
cp .env.example .env
npm install
npm run dev
```

---

## Author

**Pratham Singh** — Full Stack Developer
GitHub: [@pratham-107](https://github.com/pratham-107)
