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

    const config = {
        name: process.env.NAME,
        version: pkjson.version,
        production: process.env.NODE_ENV === 'production' ? true : false,
        port: process.env.PORT,
        allowHosts: process.env.ALLOW_HOSTS.concat(localIPs),
        wifi_config: { debugLevel: process.env.DEBUG_LEVEL }
    }

    return config
}
module.exports = config()
