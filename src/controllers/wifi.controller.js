/*
    Wifi controller
*/

class Controller {
    #wifi = null
    #options = {}
    constructor() {
        const M77RaspberryWIFI = require('m77-raspberry-wifi-node-nmcli')
        this.#wifi = new M77RaspberryWIFI()
    }

    init = async (options = {}) => {
        return new Promise(async (resolve, reject) => {
            const result = await this.#wifi.init(options)
            resolve(result)
        })
    }

    listInterfaces = async (req, res) => {
        const result = await this.#wifi.listInterfaces()
        res.json(result)
    }

    status = async (req, res) => {
        const withConnectionInfo = Boolean(req.query.withConnectionInfo)
        const result = await this.#wifi.status(withConnectionInfo)
        res.json(result)
    }


    savedNetworks = async (req, res) => {
        const result = await this.#wifi.savedNetworks()
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


}

module.exports = Controller