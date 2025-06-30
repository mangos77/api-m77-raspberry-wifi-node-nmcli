global.__basedir = __dirname

const path = require('path')

const dotenv = require('dotenv');
const parseVariables = require('dotenv-parse-variables');
dotenv.config({ path: `.env` });
process.env = parseVariables(process.env)

if(process.env.NODE_ENV == 'production'){
    let envprod = dotenv.config({ path: '.env.production' });
    envprod = parseVariables(envprod)
    process.env = {...process.env, ...envprod}
}

const config = require(path.join(__basedir, 'config'))

const express = require('express')
const app = new express()


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

