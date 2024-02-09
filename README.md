> ***Si quieres ver el documento en español, por favor consulta el archivo README_es.md***

> ***My natural language is Spanish. All texts have been translated with Google Translator.***
---

# api-m77-raspberry-wifi-node-nmcli

> **This is the new integration of the new module to configure WiFi networks from nodejs**

> **In current versions of Raspberry OS wpa_cli is no longer used, instead all network configuration is done through nmcli. For this reason the package ***m77-raspberry-wifi-node*** is no longer used*, therefore the package ***api-m77-raspberry-wifi-node*** is not used* either*
  

**node.js** server with **express** that creates an API with the functionalities of the module [**m77-raspberry-wifi-node-nmcli**](https://github.com/mangos77/m77-raspberry-wifi-node-nmcli), with which you can configure the Wi-Fi network of **Raspberry Pi** that uses **nmcli**.

For developers who need to create a frontend with the functionalities of the [**m77-raspberry-wifi-node-nmcli**](https://github.com/mangos77/m77-raspberry-wifi-node-nmcli) module, it will be much easier to implement it as a backend.


### Because?

As with my previous contributions. Because I have benefited a lot from the work of other people and organizations that offer development modules and I want to give something back to the community.

I hope you find it very useful and recommend it so that it reaches more developers :-)


## Install
From git
```
git clone https://github.com/mangos77/api-m77-raspberry-wifi-node.git
cd api-m77-raspberry-wifi-node
npm install
```

From npm
```
mkdir api-m77-raspberry-wifi-node-nmcli && cd api-m77-raspberry-wifi-node-nmcli && npm install api-m77-raspberry-wifi-node-nmcli --no-save && mv node_modules/api-m77-raspberry-wifi-node/* ./ && rm -rf node_modules && npm install
```


## Set up
It is very simple to configure the package, it will be done in two files:

### package.json
It is optional and only to modify the execution scripts to pass environment variables, such as the port for each type of execution:
```
"scripts": {
    "dev": "PORT=8081 NODE_ENV=development node src/index",
    "start": "PORT=8080 NODE_ENV=production node src/index"
},
```

### src/config.js
In this file you will find the configuration of all the operation for the execution of the API

There are two blocks to configure depending on whether the execution is development or production:
```
const config = () => {
    const config_dev = {}
    const config_prod = {}
```

If running in production mode, the environment variable ***NODE_ENV=production*** is taken ***config_prod will overwrite the values ​​of config_dev***

The values ​​to adjust are:
- *port*: By default the environment variable PORT is taken, otherwise 8081, but you can set the desired value
- *allowHosts*: In a simple array that can contain: domain names, IP addresses or iface=[Wifi interface]. This is to provide security by only accepting API calls towards a given url, for example if you only want the API to be accessible from http://127.0.0.1:8081 or http://localhost then the fix should be ['localhost', '127.0.0.1']. In the case of ***iface***, the API will obtain the associated IP address automatically.
- *wifi_config*: JSON object that will set the default values ​​in the API calls and are based on the parameters of the init() method of [**m77-raspberry-wifi-node-nmcli**](https:/ /github.com/mangos77/m77-raspberry-wifi-node-nmcli) (device, debugLevel)

Example:
```
const config_dev = {
    name: pkjson.name,
    version: pkjson.version,
    production: false,
    port: process.env.PORT || 8081,
    allowHosts: ['localhost', '127.0.0.1', 'iface=eth0'],
    wifi_config: { debugLevel: 2 }
}

const config_prod = {
    production: true,
    port: process.env.PORT || 8080,
    allowHosts: ['localhost', '127.0.0.1'],
    wifi_config: { debugLevel: 0 }
}
```

## Documentation
In the docs folder you will find *postman_collection.json*: Postman collection to be imported and used


## Endpoints
The available endpoints are:
___

> In order to understand all the responses of each endpoint, it can be of great help to see the documentation of the module on which this api is based [**m77-raspberry-wifi-node-nmcli**](https://github.com /mangos77/m77-raspberry-wifi-node-nmcli)


### GET /api/wifi/list_interfaces
List the available Wifi interfaces
- No parameters required

---

>> ***IMPORTANT NOTE***
All of the following endpoints ***optionally*** can be submitted with the following parameters in the URL (*device* and *debugLevel*).

These values ​​have a higher priority than those specified in ***config.js -> wifi_config*** and are used to give greater control of the actions if required.

---

### GET /api/wifi/status
Wifi interface status

URL parameters:
- *withConnectionInfo* - **(Optional)** If you want to see additional connection information - *Default false*

---

### GET /api/wifi/saved_networks
List of saved WiFi networks

---

### GET /api/wifi/scan
List of all Wi-Fi networks available within range of the device, ordered by their power, but always the network to which it is connected first.

___

### DELETE /api/wifi/remove_all_networks
Delete all saved networks

___

### DELETE /api/wifi/remove_network
Delete the specified network

URL parameters:
- *ssid* - **(Required)** The ssid to remove from saved networks
  
___

### POST /api/wifi/connect
Establish connection with a Wi-Fi network

- Requires sending data in the body of the request:
```
{
    "ssid": "mangos77",
    "psk": "ABCDE12345",
    "bssid": "",
    "hidden": false,
    "timeout": 30
}
```
- *ssid* - **(Required)** The ssid of the network you want to connect to
- *psk* - **(Required)** Network password. **Empty string if this is an open network**
- *bssid* - **(Optional)** Used to set the connection to a bssid of the ssid, one of its uses is when the same ssid is in more than one band
- *hidden* - **(Optional)** Define if it is a hidden network
- *timeout* - **(Optional)** Define maximum connection waiting time in seconds - *Default 60*

___

### PUT /api/wifi/reconnect
Try to reconnect to one of the saved Wi-Fi networks

- Requires sending data in the body of the request:
```
{
    "ssid": "mangos77",
    "timeout": 30
}
```
- *ssid* - **(Required)** The ssid of the saved network you want to reconnect to
- *timeout* - **(Optional)** Define maximum time in seconds to wait for reconnection - *Default 60*

___

### PUT /api/wifi/disconnect
Disconnect the Wifi that is connected to the device




# Extra information

## Run the server from boot
You can install [**pm2**](https://pm2.keymetrics.io/docs/usage/quick-start/) to manage startup, number of instances, etc.


## Host the frontend
- Upload your frontend to the ***public*** directory (I haven't tried it yet)
- You can install and configure [NGINX](https://www.nginx.com/) as a web server


## Redirect to port 80
By default, it is not possible for you to set port 80 for execution since ports lower than 1024 are only accessible by the user ***root*** or ***sudo**.

But you can fix it with:
- *iptables*: `sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8081`
- You can create a proxy redirect with [NGINX](https://www.nginx.com/)

### Response codes

This is the list of all the response codes and what function they are associated with, if it is an error code (either in the responses the value of ***success*** indicates whether it was successful or an error).

This can be used to adapt the response texts as required in developments and/or translate them in the implementation.

|  Code  | Err | Function           | Description |
|:------:|:---:|:-------------------|:------------|
| 1001 |   | list_interfaces     | Wi-Fi interfaces found on the system
| 2001 | X | list_interfaces     | There are no Wi-Fi interfaces in the system
| 1011 |   | status              | Got interface status
| 2011 | X | status              | Failed to get the status of interface
| 1021 |   | saved_networks      | List of saved Wi-Fi networks
| 2021 | X | saved_networks      | It was not possible to obtain the list of saved Wi-Fi networks in inteface
| 1031 |   | scan                | List of scanned Wi-Fi networks was obtained
| 2031 | X | scan                | It was not possible to obtain the list of the scanned Wi-Fi networks in inteface
| 1041 |   | remove_all_networks | All Wi-Fi networks removed
| 1051 |   | remove_network      | Wi-Fi network has been removed on the system
| 2051 | X | remove_network      | Wi-Fi network is not in saved networks
| 1061 |   | connect             | The Wi-Fi network has been successfully configured on interface
| 2061 | X | connect             | Could not connect to SSID on interface
| 1071 |   | reconnect           | The Wi-Fi network has been successfully reconnected on interface
| 2071 | X | reconnect           | Could not reconnect to SSID on interface, because the Wi-Fi network is not in those previously saved in the system
| 1091 |   | disconnect          | You have been disconnected from the Wi-Fi network
| 2091 | X | disconnect          | There is no connection established to disconnect
| 2092 | X | disconnect          | It was not possible to disconnect from the network
| 2093 | X | disconnect          | An error occurred when obtaining the data of the connected Wi-Fi network to be able to disconnect
| 1101 |   | init                | Interface has been found on the system
| 2101 | X | init                | The interface does not exist. Please execute the listInterfaces() method to get the list of available Wifi interfaces and set in init() method


---
> I hope it helps you and please tell me about any errors or comments :-)

___
