const path = require('path')
const os = require('os')

// Por si se desea tomar datos del package.json
const pkjson = require(path.resolve(__basedir, '..', 'package.json'))

const config = () => {
    function getLocalIPs() {
        const interfaces = os.networkInterfaces();
        const ips = [];

        for (const name of Object.keys(interfaces)) {
            if (name !== 'eth0' && name !== 'wlan0') continue; // solo eth0 y wlan0 como pediste

            for (const net of interfaces[name] || []) {
                if (net.family === 'IPv4' && !net.internal) {
                    ips.push(net.address);
                }
            }
        }

        return ips;
    }
    const localIPs = getLocalIPs()

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
        allowHosts: ['localhost', '127.0.0.1', 'iface=lo', 'm77panel.local'].concat(localIPs),
        wifi_config: { debugLevel: 0 }
    }


    if (process.env.NODE_ENV === "production")
        return Object.assign({}, config_dev, config_prod)
    else
        return config_dev
}
module.exports = config()
