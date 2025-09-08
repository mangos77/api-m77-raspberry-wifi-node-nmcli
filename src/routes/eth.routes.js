import { Router } from 'express';
const router = Router();
import config from '../config.js';

// Import controller
import Controller from '../controllers/eth.controller.js'
const controller = new Controller()
controller.init()


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
router.post('/set_connection', md_options, controller.setConnection)


export default router;