// src/config.js  (ESM)
import os from 'os';
import pkjson from '../package.json' with { type: 'json' };

const config = () => {
  function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];

    for (const name of Object.keys(interfaces)) {
      if (name !== 'eth0' && name !== 'wlan0') continue; // solo eth0 y wlan0

      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          ips.push(net.address);
        }
      }
    }

    return ips;
  }

  const localIPs = getLocalIPs();

  const config = {
    name: process.env.NAME,
    version: pkjson.version,
    production: process.env.NODE_ENV === 'production' ? true : false,
    port: process.env.PORT,
    use_socket_io: process.env.USE_SOCKET_IO, 
    allowHosts: ["localhost","127.0.0.1","iface=lo"].concat(process.env.ALLOW_HOSTS.split(',')).concat(localIPs),
    wifi_config: { debugLevel: process.env.DEBUG_LEVEL },
  };

  return config;
};

export default config();
