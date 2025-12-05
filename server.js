const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const os = require('os');

dotenv.config({ path: './config/config.env' });

connectDB();

const focus = require('./routes/focus');
const history = require('./routes/history');
const sensor = require('./routes/sensor');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
                styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
                imgSrc: ["'self'", 'data:', 'cdn.jsdelivr.net'],
            },
        },
    })
);

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 10000, 
    message: "Too many requests from this IP, please try again in 10 minutes"
});
app.use(limiter);

app.use('/api/v1/focus', focus);
app.use('/api/v1/history', history);
app.use('/api/v1/sensor', sensor);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "This is Teletubjed API for Embedded System Project 2025"
    });
});

const PORT = process.env.PORT || 5000;

const getLocalExternalIps = () => {
    const interfaces = os.networkInterfaces();
    const results = [];

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (localhost) and non-IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                results.push({ name, address: iface.address });
            }
        }
    }
    return results;
};

if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Local Address: http://localhost:${PORT}`);
    const ips = getLocalExternalIps();
    ips.forEach(ip => {
        const isWifi = ip.name.toLowerCase().includes('wi-fi') || ip.name.toLowerCase().includes('wlan');
        if (isWifi){
            console.log(`other device: http://${ip.address}:${PORT}`);
        }
        
    });
});
}


process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;