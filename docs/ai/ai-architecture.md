# AI Infrastructure and Architecture

## 1. Vision & Architectural Goals

ProjectFlow AI integrates artificial intelligence as a core system layer rather than an afterthought add-on. The AI system is designed around:

- **Asynchronous Processing**: Heavy AI tasks (transcription, document chunking, summarization, embedding generation) execute in background queues via the dedicated Worker, ensuring the API remains responsive.
- **Provider Agnosticism**: Standardized interfaces via Vercel AI SDK (`ai`), allowing seamless switching between OpenAI, Google Gemini, and Anthropic Claude.
- **Retrieval-Augmented Generation (RAG)**: Grounding LLM responses in real workspace project data, meeting transcripts, and uploaded specifications using `pgvector`.

## 2. Configured Providers & Tooling

The repository dependencies are configured for:

- **Core SDK**: `ai` (Vercel AI SDK v4)
- **OpenAI**: `@ai-sdk/openai` (GPT-4o, GPT-4o-mini, text-embedding-3-small)
- **Google Generative AI**: `@ai-sdk/google` (Gemini 2.0 Flash / Pro)
- **Anthropic**: `@ai-sdk/anthropic` (Claude 3.5 Sonnet, Claude 3.5 Haiku)

## 3. Core AI Capabilities Roadmap

```
+--------------------------------------------------------------------------+
|                           Core AI Capabilities                           |
+---------------------+--------------------+-------------------------------+
| 1. Semantic Search  | 2. Meeting AI      | 3. Task Intelligence          |
|    & Knowledge RAG  |    & Transcription |    & Decomposition            |
+---------------------+--------------------+-------------------------------+
| - Dense embeddings  | - Audio ingestion  | - Natural language task break |
|   via pgvector      | - FFmpeg chunking  | - Automated subtask creation  |
| - Hybrid search     | - Whisper/Gemini   | - Effort estimation           |
| - Document Q&A      | - Action items     | - Priority recommendation     |
+---------------------+--------------------+-------------------------------+
```

## 4. Audio Ingestion and Processing Pipeline

For audio and video meeting intelligence:

1. Client uploads raw audio/video to Amazon S3 via presigned PUT URL.
2. NestJS API enqueues a `process-meeting-audio` job into Redis/BullMQ.
3. Background Worker:
   - Downloads media from S3.
   - Invokes FFmpeg binary to normalize audio (16kHz mono FLAC/MP3) and split into bounded segments if required.
   - Sends segments to speech-to-text model.
   - Parses transcript and generates structured meeting notes, decisions, and action items.
   - Calculates vector embeddings of transcript chunks and persists to PostgreSQL `pgvector`.
4. Emits real-time notification to the workspace via Socket.IO.
