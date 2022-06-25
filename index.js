/*
 * Title: library init function
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/15/2020
 *
 */


// dependencies

const server = require('./lib/server');
const worker = require('./lib/worker');

const app ={};

app.init = () =>{
    server.init();
    worker.init();
}
app.init();

module.exports = app;