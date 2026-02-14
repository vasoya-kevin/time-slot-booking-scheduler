import express from "express";
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import router from "#routes/index.ts";
import env from "#config/enviroment.config.ts";

const server = express()
const nodeenv = env.NODE_ENV
const port = env.PORT

server.use(helmet({ crossOriginResourcePolicy: true, contentSecurityPolicy: true }))

server.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));

// Logging
server.use(morgan('dev'));

// Body parsing
server.use(express.json({ limit: '10mb' }));
server.use(express.urlencoded({ extended: true, limit: '10mb' }));
server.use(cookieParser());

// Compression
server.use(compression());

server.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

server.use('/api/v1', router);

// 404 handler
server.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
server.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: nodeenv === 'development' ? err.message : undefined
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Environment: ${nodeenv || 'development'}`);
});