const express = require('express');
const router = express.Router();
const path = require('path')
const config = require(path.join(__basedir, 'config'))

// Import controller
const Controller = require( path.join(__basedir, 'controllers', 'eth.controller') )
const controller = new Controller()


// Middleware options
async function md_options(req, res, next){
    const options = {...{}, ...config.eth_config, ...req.query}
    const result = await controller.init(options)
    if(result.success === false){
        return res.json(result)
    } else {
        next()
    }
}

// List eth devices
router.get('/list_interfaces', controller.listInterfaces)

// Status of eth device
router.get('/status', md_options, controller.status)

// Set connection params
router.post('/set_onnection', md_options, controller.setConnection)


module.exports = router;