const path = require('path')

// Por si se desea tomar datos del package.json
const pkjson = require(path.resolve(__basedir, '..', 'package.json'))

const config = () => {
    const config_dev = {
        name: pkjson.name,
        version: pkjson.version,
        production: false,
        port: process.env.PORT || 8081,
        allowHosts: ['localhost', '127.0.0.1', 'iface=eth0', 'm77panel.local'],
        wifi_config: { debugLevel: 2 }
    }

    const config_prod = {
        production: true,
        port: process.env.PORT || 8080,
        allowHosts: ['localhost', '127.0.0.1', 'iface=lo', 'm77panel.local'],
        wifi_config: { debugLevel: 0 }
    }


    if (process.env.NODE_ENV === "production")
        return Object.assign({}, config_dev, config_prod)
    else
        return config_dev
} 
module.exports = config()
