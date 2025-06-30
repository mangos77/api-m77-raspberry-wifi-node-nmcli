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
git clone https://github.com/mangos77/api-m77-raspberry-wifi-node-nmcli.git
cd api-m77-raspberry-wifi-node-nmcli
npm install
```

From npm
```
mkdir api-m77-raspberry-wifi-node-nmcli && cd api-m77-raspberry-wifi-node-nmcli && npm install api-m77-raspberry-wifi-node-nmcli --no-save && mv node_modules/api-m77-raspberry-wifi-node-nmcli/* ./ && rm -rf node_modules && npm install
```


## Set up
It is very simple to configure the package, it will be done in two files:

### .env / .env.production
```
NODE_ENV=development
PORT=8081
NAME=api-m77-raspberry-wifi-node-nmcli-dev

ALLOW_HOSTS=['localhost', '127.0.0.1', 'iface=eth0', 'm77panel.local']

DEBUG_LEVEL=2
```


## Run
The execution scripts for easy use are:
```
npm run dev                 # Runs using the .env values for development
npm run dev:kill            # Kills the development execution process
npm run dev:pm2             # Runs in development mode using pm2
npm run dev:pm2_delete      # Stops the pm2 instances of the development execution
npm run start               # Runs using the .env.production values for production
npm run start:kill          # Kills the production execution process
npm run start:pm2           # Runs in production mode using pm2
npm run start:pm2_delete    # Stops the pm2 instances of the production execution
```


## Documentation
In the docs folder you will find *postman_collection.json*: Postman collection to be imported and used


## Endpoints WiFi
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
    "ipaddress": "192.168.1.50",
    "netmask": "255.255.255.0",
    "gateway": "192.168.1.1",
    "dns": ["8.8.8.8", "192.168.1.1"],
    "hidden": false,
    "timeout": 30
}
```
- *ssid* - **(Required)** The ssid of the network you want to connect to
- *psk* - **(Required)** Network password. **Empty string if this is an open network**
- *bssid* - **(Optional)** Used to set the connection to a bssid of the ssid, one of its uses is when the same ssid is in more than one band
- *ipaddress* - **(Optional)** Statically establish the IP address of the connection (*)
- *netmask* - **(Optional)** Statically set the netmask (*)
- *gateway* - **(Optional)** Statically establish the gateway (*)
- *dns* - **(Optional)** Statically establish the DNS of the connection, these must be in an array (*)
- *hidden* - **(Optional)** Define if it is a hidden network
- *timeout* - **(Optional)** Define maximum connection waiting time in seconds - *Default 60*

> If you want to statically set ipaddress, netmask, gateway or dns; all of these parameters are required

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


## Endpoints Ethernet

### GET /api/ethernet/list_interfaces
Enlista las interfaces ethernet disponibles

- No requiere parámetros

---


### GET /api/ethernet/status
Status de la interfaz Ethernet

- No requiere parámetros
---


### POST /api/ethernet/set_connection
Set the Ethernet connection parameters

- Requires sending data in the request body:
```
{
    "ipaddress": "192.168.1.50",
    "netmask": "255.255.255.0",
    "gateway": "192.168.1.1",
    "dns": ["8.8.8.8", "192.168.1.1"],
    "timeout": 30
}
```
- *ipaddress* - **(Optional)** Set the static IP address of the connection (*)
- *netmask* - **(Optional)** Set the static network mask (*)
- *gateway* - **(Optional)** Set the static gateway (*)
- *dns* - **(Optional)** Set the static DNS of the connection, these must be in an array (*)
- *timeout* - **(Optional)** Define the maximum connection wait time in seconds - *Default 60*

> If you want to set ipaddress, netmask, gateway or dns statically; all these parameters are required

___

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

### Response codes Wifi

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
| 2062 | X | connect             | The static ipaddress is not valid
| 2063 | X | connect             | The static netmask is not valid
| 2064 | X | connect             | The static gateway is not valid
| 2065 | X | connect             | One or more static dns are not valid
| 2066 | X | connect             | To set a custom address parameters; ipaddress, netmask, gateway and dns are required
| 1071 |   | reconnect           | The Wi-Fi network has been successfully reconnected on interface
| 2071 | X | reconnect           | Could not reconnect to SSID on interface, because the Wi-Fi network is not in those previously saved in the system
| 1091 |   | disconnect          | You have been disconnected from the Wi-Fi network
| 2091 | X | disconnect          | There is no connection established to disconnect
| 2092 | X | disconnect          | It was not possible to disconnect from the network
| 2093 | X | disconnect          | An error occurred when obtaining the data of the connected Wi-Fi network to be able to disconnect
| 1101 |   | init                | Interface has been found on the system
| 2101 | X | init                | The interface does not exist. Please execute the listInterfaces() method to get the list of available Wifi interfaces and set in init() method


### Response codes ethernet

|  Code  | Err | Function           | Description |
|:------:|:---:|:----------------|:------------|
| 1002 |   | list_interfaces     | Ethernet interfaces found on the system
| 2002 | X | list_interfaces     | There are no ethernet interfaces in the system
| 1012 |   | status              | Got ethernet interface status
| 2013 | X | status              | Failed to get the status of ethernet interface
| 1062 |   | setConnection       | The ethernet interface has been successfully configured
| 2067 | X | setConnection       | Ethernet interface cable is not plugged in
| 2068 | X | setConnection       | Could not connect to ethernet interface
| 2062 | X | setConnection       | The static ipaddress is not valid
| 2063 | X | setConnection       | The static netmask is not valid
| 2064 | X | setConnection       | The static gateway is not valid
| 2065 | X | setConnection       | One or more static dns are not valid
| 2066 | X | setConnection       | To set a custom address parameters; ipaddress, netmask, gateway and dns are required
| 1102 |   | init                | Ethernet interface has been found on the system
| 2102 | X | init                | The ethernet interface does not exist. Please execute the listInterfaces() method to get the list of available ethernet interfaces and set in init() method
---
> I hope it helps you and please tell me about any errors or comments :-)

___
