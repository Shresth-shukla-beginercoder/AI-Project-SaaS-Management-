import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('ProjectFlow Worker initialized');
}

bootstrap().catch((err) => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
