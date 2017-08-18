/* eslint-disable no-console, no-case-declarations */
const http = require('http')
const express = require('express')
const WebSocket = require('ws')
const serveStatic = require('serve-static')
const connectionHandler = require('./src/connection-handler')

const PORT = process.env.PORT || '3000'
const app = express()
app.use(serveStatic('dist'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', connectionHandler)
server.listen(PORT, () => {
	console.log('Server started on port %d', server.address().port)
})
