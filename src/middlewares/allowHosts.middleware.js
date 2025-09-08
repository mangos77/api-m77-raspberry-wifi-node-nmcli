// Middleware 
// config = { allowHosts: ['host_name', 'ipaddress', 'iface=eth0'] }
// app.use(allowHosts(config.allowHosts).validate)

import { exec } from 'child_process'

function execCmd(command = "") {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            resolve({ err, stdout: stdout.trim() || '', stderr: stderr.trim() || '' })
        })
    })
}

export default (allowHosts = []) => {

    // Valida que el host origen de petición sea permitido
    async function validate(req, res, next) {

        const host = req.headers.host.split(':')[0];

        const hosts = []
        for (let i = 0; i < allowHosts.length; i++) {
            let host = allowHosts[i].trim() || ''
            if (host.length > 0) {
                if (host.search(/^(iface=)/i) >= 0) {
                    let iface = host.split("=")[1]
                    let ipIface = await execCmd(`/usr/sbin/ifconfig ${iface} | grep 'inet ' | awk '{print $2}'`)
                    ipIface.stdout.search(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/) >= 0 ? hosts.push(ipIface.stdout) : false
                } else {
                    hosts.push(host)
                }
            }
        }
        if (hosts.indexOf(host) === -1) {
            return res.status(500).json({
                status: 401,
                code: 401,
                message: `API call to host '${host}' is not allowed`
            });
        }
        next();
    }

    return {
        validate
    }
}

