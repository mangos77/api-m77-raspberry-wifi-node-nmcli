# api-m77-raspberry-wifi-node-nmcli

> **Esta es la nueva integración del nuevo módulo para configurar redes WiFi desde nodejs**

> **En versiones actuales de Raspberry OS ya no se usa wpa_cli, en cambio toda la configuración de red es por nmcli. Por esto el paquete ***m77-raspberry-wifi-node*** ya no es utilizado*, por consiguiente el paquete ***api-m77-raspberry-wifi-node*** tampoco*
  

Servidor **node.js** con **express** que crea una API con las funcionalidades del módulo [**m77-raspberry-wifi-node-nmcli**](https://github.com/mangos77/m77-raspberry-wifi-node-nmcli), con el que se puede configurar la red Wifi de **Raspberry Pi** que usa **nmcli**.

Para los desarrolladores que necesiten crear un frontend con las funcionalidades del módulo [**m77-raspberry-wifi-node-nmcli**](https://github.com/mangos77/m77-raspberry-wifi-node-nmcli) les será mucho más sencillo implimentarlo como backend.


### ¿Por qué?

Al igual que con mis anteriores aportaciones. Porque me he beneficiado mucho del trabajo de otras personas y organizaciones que ofrecen módulos de desarrollo y quiero regresar algo a la comunidad.

Espero que les sea de gran utilidad y la recomienden para que llegue a más desarrolladores :-)


## Instalar
Desde git
```
git clone https://github.com/mangos77/api-m77-raspberry-wifi-node.git
cd api-m77-raspberry-wifi-node
npm install
```

Desde npm
```
mkdir api-m77-raspberry-wifi-node-nmcli && cd api-m77-raspberry-wifi-node-nmcli && npm install api-m77-raspberry-wifi-node-nmcli --no-save && mv node_modules/api-m77-raspberry-wifi-node/* ./ && rm -rf node_modules && npm install
```


## Configurar
Es muy sencillo configurar el paquete, se hará en dos archivos:

### package.json
Es opcional y sólo para modificar los scripts de ejecución para pasar variables de entorno, comom por ejemplo el puerto para cada tipo de ejecución:
```
"scripts": {
    "dev": "PORT=8081 NODE_ENV=development node src/index",
    "start": "PORT=8080 NODE_ENV=production node src/index"
},
```

### src/config.js
En este archivo se encuentra la configuración de todo el funcionamiento para la ejecución de la API

Existen dos bloques para configurar dependiendo si la ejecución es de desarrollo o producción:
```
const config = () => {
    const config_dev = {}
    const config_prod = {}
}
```

Si se ejecuta en modo producción, se toma la variable de entorno ***NODE_ENV=production*** ***config_prod sobre escribirá los valores de config_dev***

Los valores a ajustar son:
- *port*: Por defecto se toma la variable de entorno PORT, en caso contrario 8081, pero se puede fijar el valor deseado
- *allowHosts*: En un array simple que puede contener: nombres de dominio, direcciones ip o iface=[interfaz Wifi]. Esto es para dar seguridad aceptando sólo los llamados a la API hacia una url determinada, por ejemplo si sólo se desea que se pueda acceder a la API desde http://127.0.0.1:8081 o http://localhost entonces el arreglo debe ser ['localhost', '127.0.0.1']. El caso de las ***iface*** la API obtendrá la dirección IP asociada de forma automática.
- *wifi_config*: Objeto JSON que fijará los valores por defecto en los llamados a la API y se basan en los parámetros del método init() de [**m77-raspberry-wifi-node-nmcli**](https://github.com/mangos77/m77-raspberry-wifi-node-nmcli) (device, debugLevel)

Ejemplo:
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

## Documentación
En la carpeta docs encontrarás *postman_collection.json*: Colección Postman para ser importada y usada


## Endpoints
Los endpoints disponibles son:
___

> Para poder comprender todas las respuestas de cada endpoint puede ser de gran ayuda ver la documentación del módulo en el que está basada esta api [**m77-raspberry-wifi-node-nmcli**](https://github.com/mangos77/m77-raspberry-wifi-node-nmcli)


### GET /api/wifi/list_interfaces
Enlista las interfaces Wifi disponibles
- No requiere parámetros

---

>> ***NOTA IMPORTANTE***
Todos los siguientes endpoints de forma ***opcional*** pueden enviarse con los siguientes parámetros en la URL (*device* y *debugLevel*). 

Estos valores tienen mayor prioridad a los especificados en ***config.js -> wifi_config*** y se usan para dar mayor control de las acciones si así se requiere.

---

### GET /api/wifi/status
Estatus del la interfaz Wifi

Parámetros url:
- *withConnectionInfo* - **(Opcional)** Si se desea ver información adicional de conexión - *Por defecto false*

---

### GET /api/wifi/saved_networks
Listado de las redes Wifi guardadas

---

### GET /api/wifi/scan
Listado de todas las redes Wifi disponibles al alcance del dispositivo, ordenadas por su potencia, pero siempre en primer lugar la red a la que se encuentra conectado

___

### DELETE /api/wifi/remove_all_networks
Elimina todas las redes guardadas

___

### DELETE /api/wifi/remove_network
Elimina la red especificada

Parámetros url:
- *ssid* - **(Requerido)** El ssid que se eliminará de las redes guardadas
  
___

### POST /api/wifi/connect
Establece conexión con una red Wifi

- Requiere envío de datos en el body de la petición:
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
- *ssid* - **(Requerido)** El ssid de la red a la que se desea conectar
- *psk* - **(Requerido)** Contraseña de la red. **Cadena vacía si se trata de una red abierta**
- *bssid* - **(Opcional)** Se usa para fijar la conexión a un bssid del ssid, uno de sus usos es cuando el mismo ssid está en más de una banda
- *ipaddress* - **(Opcional)** Establecer de forma estática la dirección ip de la conexión (*)
- *netmask* - **(Opcional)** Establecer de forma estática la máscara de red (*)
- *gateway* - **(Opcional)** Establecer de forma estática la pasarela (*)
- *dns* - **(Opcional)** Establecer de forma estática los DNS de la conexión, estas deben estar en un arreglo (*)
- *hidden* - **(Opcional)** Definir si se trata de una red oculta
- *timeout* - **(Opcional)** Definir tiempo máximo en segundos de espera de conexión - *Por defecto 60*

> Si se desea establecer de forma estática ipaddress, netmask, gateway o dns; todos estos los parámteros son requeridos
___

### PUT /api/wifi/reconnect
Intenta reconectar a una de las redes Wifi guardadas

- Requiere envío de datos en el body de la petición:
```
{
    "ssid": "mangos77",
    "timeout": 30
}
```
- *ssid* - **(Requerido)** El ssid de la red guardada a la que se desea reconectar
- *timeout* - **(Opcional)** Definir tiempo máximo en segundos de espera de reconexión - *Por defecto 60*

___

### PUT /api/wifi/disconnect
Desconecta la Wifi que está conectada al dispositivo




# Información extra

## Ejecutar el servidor desde el arranque
Puedes instalar [**pm2**](https://pm2.keymetrics.io/docs/usage/quick-start/) para gestionar el arranque, cantidad de instancias etc. 


## Alojar el frontend
- Cargar tu frontend en el directorio ***public*** (no lo he probado aún)
- Puedes instalar y configurar [NGINX](https://www.nginx.com/) como servidor web


## Redireccionar a puerto 80
Por defecto no es posible que puedas establecer el puerto 80 para la ejecución ya que los puertos inferiores a 1024 sólo son accesibles por el usuario ***root*** o por ***sudo**. 

Pero puedes solucionarlo con:
- *iptables*: `sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 8081`
- Puedes crear una redirección proxy con [NGINX](https://www.nginx.com/)


### Códigos de respuesta

Esta es la lista de todos los códigos de respuesta y a qué función están asociados, si es un código de error (de cualquier forma en las respuestas el valor de ***success*** indica si fue satisfactoria o es un error).

Esto puede servir para poder adaptar los textos de respuesta como se requiera en desarrollos y/o traducirlos en la implementación.

|  Código  | Err | Función           | Descripción |
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


---
> Espero les sea de ayuda y por favor díganme sobre cualquier error o comentario :-)

___
