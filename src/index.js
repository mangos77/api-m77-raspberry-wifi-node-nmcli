import http from 'http';
import dotenv from 'dotenv';
import parseVariables from 'dotenv-parse-variables';
import express from 'express';
import cors from 'cors';
import allowHosts from './middlewares/allowHosts.middleware.js';
import { initSocketIO } from './modules/socketio.module.js';
import api from './routes/api.routes.js';
import config from './config.js';

// ESM: obtener __dirname y configurar __basedir global
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// global.__basedir = __dirname;

// dotenv
dotenv.config({ path: `.env` });
process.env = parseVariables(process.env);

if (process.env.NODE_ENV === 'production') {
    let envprod = dotenv.config({ path: '.env.production' });
    envprod = parseVariables(envprod);
    process.env = { ...process.env, ...envprod };
}


const app = express();

// --- CORS ---
app.use(cors());

// Static
app.use('/', express.static('public'));

// --- Middlewares ---
app.use(allowHosts(config.allowHosts).validate);

if (!config.production) {
    const morgan = (await import('morgan')).default;
    app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));

// --- Rutas ---
app.use('/api', api);

// --- Servidor HTTP ---
const server = http.createServer(app);

// --- Socket.IO ---
if (process.env.USE_SOCKET_IO) {
    initSocketIO(server);
} else {
    console.log('Socket.IO deshabilitado');
}

// --- Iniciar API ---
server.listen(config.port, () => {
    console.log(`API running at http://localhost:${config.port}`);
});
