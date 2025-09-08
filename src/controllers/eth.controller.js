/*
    Ethernet controller
*/

import { M77RaspberryETH } from 'm77-raspberry-wifi-node-nmcli'
import { getSocketIO } from '../modules/socketio.module.js'

class Controller {
    #eth = null
    #options = {}
    constructor() {
        this.#eth = new M77RaspberryETH()
    }

    socketioCalls = () => {
        setInterval(async () => {
            const io = getSocketIO();

            // Info Ethernet
            const eths = await this.#eth.status()
            if (eths.success) {
                try {
                    io.emit('eth_status', eths.data);
                } catch (e) { }
            }
        }, 1000)
    }

    init = async (options = {}) => {
        return new Promise(async (resolve, reject) => {
            const result = await this.#eth.init(options)
            this.socketioCalls()
            resolve(result)
        })
    }

    listInterfaces = async (req, res) => {
        const result = await this.#eth.listInterfaces()
        res.json(result)
    }

    status = async (req, res) => {
        const result = await this.#eth.status()
        res.json(result)
    }

    setConnection = async (req, res) => {
        const config_net = { ...{}, ...req.body }
        const result = await this.#eth.setConnection(config_net)
        res.json(result)
    }

}

export default Controller