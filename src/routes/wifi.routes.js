import { Router } from 'express';
const router = Router();
import config from '../config.js';

// Import controller
import Controller from '../controllers/wifi.controller.js'
const controller = new Controller()
controller.init({ ...{}, ...config.wifi_config })

// Middleware options
async function md_options(req, res, next) {
    const options = { ...{}, ...config.wifi_config, ...req.query }
    const result = await controller.init(options)
    if (result.success === false) {
        return res.json(result)
    } else {
        next()
    }
}

// List wifi devices
router.get('/list_interfaces', controller.listInterfaces)

// Status of wifi device
router.get('/status', md_options, controller.status)


// List of saved networks
router.get('/saved_networks', md_options, controller.savedNetworks)

// Delete one saved network
router.delete('/remove_network', md_options, controller.removeNetwork)

// Delete all saved networks
router.delete('/remove_all_networks', md_options, controller.removeAllNetworks)

// List of all available networks
router.get('/scan', md_options, controller.scan)


// Connect to network
router.post('/connect', md_options, controller.connect)

// Disconnect 
router.put('/disconnect', md_options, controller.disconnect)

// Reconnect
router.put('/reconnect', md_options, controller.reconnect)

// Set connection params
router.post('/set_connection', md_options, controller.setConnection)

export default router;