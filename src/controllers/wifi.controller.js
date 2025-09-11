/*
    Wifi controller
*/

import { M77RaspberryWIFI } from 'm77-raspberry-wifi-node-nmcli'
import { getSocketIO } from '../modules/socketio.module.js'

class Controller {
    #wifi = null
    #bussy = false
    #options = {}
    constructor() {
        this.#wifi = new M77RaspberryWIFI()
    }

    socketioCalls = () => {
        setInterval(async () => {
            if (!this.#bussy) {
                this.#bussy = true
                const io = getSocketIO();

                // Info Wifi
                const wifistatus = await this.#wifi.status(true)
                if (wifistatus.success) {
                    try {
                        io.emit('wifi_status', wifistatus.data);
                    } catch (e) { }
                }
                this.#bussy = false

                this.#bussy = true
                // Saved Wifi
                const wifisaved = await this.#wifi.savedNetworks()
                if (wifisaved.success) {
                    try {
                        io.emit('wifi_saved', wifisaved.data);
                    } catch (e) { }
                }
                this.#bussy = false
            }
        }, 1000)

        setInterval(async () => {
            if (!this.#bussy) {
                this.#bussy = true
                const io = getSocketIO();

                // Scan Wifi
                const wifiscan = await this.#wifi.scan()
                if (wifiscan.success) {
                    try {
                        io.emit('wifi_scan', wifiscan.data);
                    } catch (e) { }
                }
                this.#bussy = false
            }
        }, 5000)
    }

    init = async (options = {}) => {
        return new Promise(async (resolve, reject) => {
            this.#bussy = true
            const result = await this.#wifi.init(options)
            this.socketioCalls()
            this.#bussy = false
            resolve(result)
        })
    }

    listInterfaces = async (req, res) => {
        this.#bussy = true
        const result = await this.#wifi.listInterfaces()
        this.#bussy = false
        res.json(result)
    }

    status = async (req, res) => {
        this.#bussy = true
        const withConnectionInfo = req.query.withConnectionInfo === "true" ? true : false
        const result = await this.#wifi.status(withConnectionInfo)
        this.#bussy = false
        res.json(result)
    }


    savedNetworks = async (req, res) => {
        this.#bussy = true
        const exclude_words_arr = req.query.exclude ? req.query.exclude.split(',').map(word => word.trim()) : []
        const result = await this.#wifi.savedNetworks(exclude_words_arr)
        this.#bussy = false
        res.json(result)
    }

    removeNetwork = async (req, res) => {
        this.#bussy = true
        const ssid = req.query.ssid ? req.query.ssid.trim() : ''
        const result = await this.#wifi.removeNetwork(ssid)
        this.#bussy = false
        res.json(result)
    }

    removeAllNetworks = async (req, res) => {
        this.#bussy = true
        const result = await this.#wifi.removeAllNetworks()
        this.#bussy = false
        res.json(result)
    }

    scan = async (req, res) => {
        this.#bussy = true
        const result = await this.#wifi.scan()
        this.#bussy = false
        res.json(result)
    }

    connect = async (req, res) => {
        this.#bussy = true
        const config_net = { ...{}, ...req.body }
        const result = await this.#wifi.connect(config_net)
        this.#bussy = false
        res.json(result)
    }

    reconnect = async (req, res) => {
        this.#bussy = true
        const config_net = { ...{}, ...req.body }
        const result = await this.#wifi.reconnect(config_net)
        this.#bussy = false
        res.json(result)
    }

    disconnect = async (req, res) => {
        this.#bussy = true
        const result = await this.#wifi.disconnect()
        this.#bussy = false
        res.json(result)
    }

    setConnection = async (req, res) => {
        this.#bussy = true
        const config_net = { ...{}, ...req.body }
        const result = await this.#wifi.setConnection(config_net)
        this.#bussy = false
        res.json(result)
    }
}

export default Controller