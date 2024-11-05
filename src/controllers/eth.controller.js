/*
    Ethernet controller
*/

class Controller {
    #eth = null
    #options = {}
    constructor() {
        const { M77RaspberryETH } = require('m77-raspberry-wifi-node-nmcli')
        this.#eth = new M77RaspberryETH()
    }

    init = async (options = {}) => {
        return new Promise(async (resolve, reject) => {
            const result = await this.#eth.init(options)
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

module.exports = Controller