/*
    Ethernet controller
*/

import { M77RaspberryETH } from 'm77-raspberry-wifi-node-nmcli'
import { getSocketIO } from '../modules/socketio.module.js'

class Controller {
    #eth = null
    #bussy = false
    #options = {}
    constructor() {
        this.#eth = new M77RaspberryETH()
    }

    socketioCalls = () => {
        const io = getSocketIO();

        const socket_1 = async () => {
            try {
                if (!this.#bussy) {
                    this.#bussy = true

                    // Info Ethernet
                    const eths = await this.#eth.status()
                    if (eths.success) {
                        try {
                            io.emit('eth_status', eths.data);
                        } catch (e) { }
                    }

                    this.#bussy = false
                }
            } finally {
                setTimeout(socket_1, 1000)
            }
        }

        setTimeout(socket_1, 1)

    }

    init = async (options = {}) => {
        return new Promise(async (resolve, reject) => {
            this.#bussy = true
            const result = await this.#eth.init(options)
            this.socketioCalls()
            this.#bussy = false
            resolve(result)
        })
    }

    listInterfaces = async (req, res) => {
        this.#bussy = true
        const result = await this.#eth.listInterfaces()
        this.#bussy = false
        res.json(result)
    }

    status = async (req, res) => {
        this.#bussy = true
        const result = await this.#eth.status()
        this.#bussy = false
        res.json(result)
    }

    setConnection = async (req, res) => {
        this.#bussy = true
        const config_net = { ...{}, ...req.body }
        const result = await this.#eth.setConnection(config_net)
        this.#bussy = false
        res.json(result)
    }

}

export default Controller