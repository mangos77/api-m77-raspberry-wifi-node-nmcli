const express = require('express');
const router = express.Router();
const path = require('path')

// Wifi routes
const wifi = require( path.join(__basedir, 'routes', 'wifi.routes') )
router.use('/wifi', wifi)

// Default response
router.all('*', (req, res) => {
    res.status(200).json({
        status: 200,
        code: 404,
        message: `The route does not exist (${req.method})`
    });
});


module.exports = router;