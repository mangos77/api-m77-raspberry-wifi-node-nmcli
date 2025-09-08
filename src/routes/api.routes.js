// src/routes/api.routes.js
import express from 'express';

import wifi from './wifi.routes.js';
import eth from './eth.routes.js';

const router = express.Router();

// Wifi routes
router.use('/wifi', wifi);

// Ethernet routes
router.use('/ethernet', eth);

// Default response
router.all('*', (req, res) => {
  res.status(200).json({
    status: 200,
    code: 404,
    message: `The route does not exist (${req.method})`,
  });
});

export default router;
