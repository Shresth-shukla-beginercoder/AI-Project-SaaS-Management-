# AWS S3 Storage Infrastructure Setup

This guide details configuration, credential management, bucket policies, and security practices for S3 storage in ProjectFlow AI.

## Overview

ProjectFlow AI uses Amazon S3 for durable object storage:

- Task attachments and documents
- Meeting recordings and audio chunks
- AI transcription outputs and media exports
- User avatars and workspace branding assets

## Local Development (Credentials Optional)

In local development, S3 credentials are completely optional. The development environment starts and builds without AWS credentials. When implementing features, developers can either:

1. Provide development AWS credentials pointing to a sandboxed S3 bucket.
2. Use a local S3-compatible service (such as MinIO or LocalStack).

## IAM Configuration

Create an IAM User or Role with least-privilege permissions. See `iam-policy-example.json` for the minimal required policy:

- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`
- `s3:ListBucket`
- `s3:AbortMultipartUpload`

## Bucket CORS Configuration

Direct browser uploads via presigned URLs require CORS enabled on the S3 bucket. Apply `cors-policy.json` to allow uploads from the frontend origin:

- `AllowedOrigins`: Frontend URLs (e.g., `http://localhost:5173`, `https://*.vercel.app`, custom domain)
- `AllowedMethods`: `GET`, `PUT`, `POST`, `DELETE`, `HEAD`
- `AllowedHeaders`: `*`
- `ExposeHeaders`: `ETag`
