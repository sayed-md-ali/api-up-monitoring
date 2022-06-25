/*
 * Title: server related work
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/15/2020
 *
 */
// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');

// app object - module scaffolding
const server = {};

// configuration
server.config = {
    port: 3000,
};

// create server
server.createServer = () => {
    const createServer = http.createServer(server.handleReqRes);
    createServer.listen(server.config.port, () => {
        console.log(`listening to port ${server.config.port}`);
    });
};

// handle Request Response
server.handleReqRes = handleReqRes;

// start the server
server.init = () =>{
   server.createServer();
}

module.exports = server;
