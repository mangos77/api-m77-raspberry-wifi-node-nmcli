/*
    Wifi controller
*/

import {M77RaspberryWIFI} from 'm77-raspberry-wifi-node-nmcli'
import { getSocketIO } from '../modules/socketio.module.js'

class Controller {
    #wifi = null
    #options = {}
    constructor() {
        this.#wifi = new M77RaspberryWIFI()
    }

    socketioCalls = () => {
        setInterval(async () => {
            const io = getSocketIO();

            // Info Wifi
            const wifistatus = await this.#wifi.status(true)
            if (wifistatus.success) {
                try {
                    io.emit('wifi_status', wifistatus.data);
                } catch (e) { }
            }

            // Saved Wifi
            const wifisaved = await this.#wifi.savedNetworks()
            if (wifisaved.success) {
                try {
                    io.emit('wifi_saved', wifisaved.data);
                } catch (e) { }
            }
        }, 1000)

        setInterval(async () => {
            const io = getSocketIO();

            // Scan Wifi
            const wifiscan = await this.#wifi.scan()
            if (wifiscan.success) {
                try {
                    io.emit('wifi_scan', wifiscan.data);
                } catch (e) { }
            }
        }, 5000)
    }

    init = async (options = {}) => {
        return new Promise(async (resolve, reject) => {
            const result = await this.#wifi.init(options)
            this.socketioCalls()
            resolve(result)
        })
    }

    listInterfaces = async (req, res) => {
        const result = await this.#wifi.listInterfaces()
        res.json(result)
    }

    status = async (req, res) => {
        const withConnectionInfo = req.query.withConnectionInfo === "true" ? true : false
        const result = await this.#wifi.status(withConnectionInfo)
        res.json(result)
    }


    savedNetworks = async (req, res) => {
        const exclude_words_arr = req.query.exclude ? req.query.exclude.split(',').map(word => word.trim()) : []
        const result = await this.#wifi.savedNetworks(exclude_words_arr)
        res.json(result)
    }

    removeNetwork = async (req, res) => {
        const ssid = req.query.ssid ? req.query.ssid.trim() : ''
        const result = await this.#wifi.removeNetwork(ssid)
        res.json(result)
    }

    removeAllNetworks = async (req, res) => {
        const result = await this.#wifi.removeAllNetworks()
        res.json(result)
    }

    scan = async (req, res) => {
        const result = await this.#wifi.scan()
        res.json(result)
    }

    connect = async (req, res) => {
        const config_net = { ...{}, ...req.body }
        const result = await this.#wifi.connect(config_net)
        res.json(result)
    }

    reconnect = async (req, res) => {
        const config_net = { ...{}, ...req.body }
        const result = await this.#wifi.reconnect(config_net)
        res.json(result)
    }

    disconnect = async (req, res) => {
        const result = await this.#wifi.disconnect()
        res.json(result)
    }

    setConnection = async (req, res) => {
        const config_net = { ...{}, ...req.body }
        const result = await this.#wifi.setConnection(config_net)
        res.json(result)
    }
}

export default Controller