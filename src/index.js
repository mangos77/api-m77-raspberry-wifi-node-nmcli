global.__basedir = __dirname

const express = require('express')
const app = new express()

const path = require('path')
const config = require(path.join(__basedir, 'config'))

// CORS
// Habilita cors
const cors = require('cors')
app.use(cors())

app.use('/', express.static( path.join(__basedir, 'public') ));


/***************************/
// Middlewares
const allowHosts = require(`${__basedir}/middlewares/allowHosts.middleware`) 
app.use(allowHosts(config.allowHosts).validate)

if(!config.production){
    const morgan = require('morgan')
    app.use(morgan('dev'))
}

app.use(express.urlencoded( { extended: false } ))
app.use(express.json({ limit: '50mb' }))

/***************************/

const api = require( path.join(__basedir, 'routes', 'api.routes') )
app.use('/api', api)

app.listen(config.port, () => {
    console.log(`API running at http://localhost:${config.port}`)
})

