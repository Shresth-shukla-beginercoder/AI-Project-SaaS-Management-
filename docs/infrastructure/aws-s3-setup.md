# AWS S3 Storage Setup Guide

## 1. Role in Architecture

Amazon S3 provides durable, scalable cloud object storage for ProjectFlow AI. It manages:

- Workspace files, task attachments, and generated document exports.
- Meeting recordings and audio clips before background AI transcription.
- User profile avatars and team assets.

## 2. Security Model: Presigned URLs

ProjectFlow AI strictly avoids proxying heavy media uploads or downloads through the NestJS API server to protect CPU and network bandwidth:

```
[Client Web Browser]
     | 1. Request presigned upload URL (POST /api/v1/attachments/presign)
     v
[NestJS API Server]
     | 2. Generate signed AWS S3 PUT URL with expiration (e.g. 15 mins)
     v
[Client Web Browser]
     | 3. PUT binary file directly to S3 bucket
     v
[Amazon S3 Bucket]
     | 4. Confirm upload (POST /api/v1/attachments/confirm)
     v
[NestJS API Server] -> Enqueues background processing job to BullMQ
```

## 3. Configuration & Environment Variables

When configuring an S3 bucket, set the following environment variables in `.env` (or production secret manager):

```ini
AWS_REGION=us-east-1
AWS_S3_BUCKET=projectflow-ai-production-bucket
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

## 4. Bucket CORS Policy

To allow browsers to upload directly to S3 via presigned URLs, apply the policy from `infrastructure/aws/s3/cors-policy.json` to the AWS S3 Bucket CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173", "https://*.vercel.app"],
    "ExposeHeaders": ["ETag", "x-amz-server-side-encryption"],
    "MaxAgeSeconds": 3600
  }
]
```

## 5. IAM Policy (Principle of Least Privilege)

Attach the scoped policy from `infrastructure/aws/s3/iam-policy-example.json` to the service account or IAM role executing the API and Worker containers.
