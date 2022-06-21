/*
 * Title: check Handler
 * Description: Handler to handle user related routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/21/2020
 *
 */
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const environment = require('../../helpers/environments')

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};
handler._check.post = (properties, callback) =>{
    const protocol = typeof (properties.body.protocol) === 'string'
                     && ['http', 'https'].indexOf(properties.body.protocol) > -1 
                     ? properties.body.protocol
                     : false;

    const url = typeof (properties.body.url) === 'string' 
                && properties.body.url.trim().length > 0
                ? properties.body.url 
                : false;
    const method = typeof(properties.body.method) === 'string'
                    && ['get', 'post', 'put', 'delete'].indexOf(properties.body.method) > -1 
                    ? properties.body.method
                    :false
    const successCode = typeof (properties.body.successCode) === 'object' 
                        && properties.body.successCode instanceof Array 
                        ? properties.body.successCode
                        : false;
    const timeOutSecond = typeof (properties.body.timeOutSecond) === 'number'
                          && properties.body.timeOutSecond % 1 === 0 
                          && properties.body.timeOutSecond >= 1
                          && properties.body.timeOutSecond <= 5
                          ? properties.body.timeOutSecond
                          : false;
    
    console.log(protocol, url, method, successCode, timeOutSecond)

    if(protocol && url && method && successCode && timeOutSecond){
        let tokenId = typeof (properties.headersObject.token) === 'string'
                      && properties.headersObject.token.trim().length > 0
                      ? properties.headersObject.token
                      : false;

        data.read('tokens', tokenId, (err, tokenData) =>{
            if(!err && tokenData){

                let phone = parseJSON(tokenData).phone;

                //lookup user data

                data.read('users', phone, (err1, userData)=>{
                    if(!err1 && userData){
                        let user = userData;
                        console.log(user)
                        tokenHandler._token.verify(tokenId, phone, (tokenIsValid)=>{
                            if(tokenIsValid){
                                let userData = parseJSON(user);
                                let userCheck = typeof(userData.check) === 'object' 
                                                && userData.check instanceof Array
                                                ?userData.check
                                                : []
                                
                                if(userCheck.length < environment.maxCheck){
                                    let checkId = createRandomString(20);
                                    let checkObject ={
                                        id: checkId,
                                        protocol,
                                        url,
                                        phone,
                                        method,
                                        successCode,
                                        timeOutSecond
                                    }

                                    data.create('checks', checkId, checkObject, (err2) =>{
                                        if(!err2){
                                            userData.check = userCheck;
                                            userData.check.push(checkId);
                                            data.update('users', phone, userData, (err3) =>{
                                                if(!err3){
                                                    callback(200, userData)
                                                }else{
                                                    callback(405, {
                                                        error: 'Server error'
                                                    })
                                                }
                                            })
                                        }else{
                                            callback(405, {
                                                error: 'server error'
                                            })
                                        }
                                    })


                                }else{
                                    callback(401, {
                                        error: 'Already max limit'
                                    })
                                }

                            }else{
                                callback(403, {
                                    error: 'Token is expired'
                                })
                            }
                        })

                    }else{
                        callback(403, {
                            error: 'User not found'
                        })
                    }
                })


            }else{
                callback(403, {
                    error: 'Authincation Problem'
                })
            }
        })


    }else{
        callback(400, {
            error: 'You have a problem in your request',
        });
    }

                    
}
handler._check.get = (properties, callback) =>{
    const id = typeof (properties.queryStringObject.id) === 'string'
                && properties.queryStringObject.id.trim().length === 20
                ? properties.queryStringObject.id
                : false;
    if(id){
       data.read("checks", id, (err, checkData)=>{
           if(!err && checkData){
            let checkInfo = parseJSON(checkData);
            let token = typeof (properties.headersObject.token) === 'string'
                        && properties.headersObject.token.trim().length > 0
                        ? properties.headersObject.token
                        : false;
            tokenHandler._token.verify(token, parseJSON(checkData).phone, tokenIsValid =>{
                if(tokenIsValid){
                    callback(200, checkInfo)
                }else{
                    callback(403, {
                        error: "Authication problem"
                    })
                }
            })

           }else{
            callback(400, {
                error: 'Your id is not valid'
            })
           }
       })


    }else{
        callback(400, {
            error: 'Your id is not valid'
        })
    }
}
handler._check.put = (properties, callback) =>{

    const id = typeof (properties.body.id) === 'string' 
                && properties.body.id.trim().length === 20
                ? properties.body.id 
                : false;

    const protocol = typeof (properties.body.protocol) === 'string'
                     && ['http', 'https'].indexOf(properties.body.protocol) > -1 
                     ? properties.body.protocol
                     : false;

    const url = typeof (properties.body.url) === 'string' 
                && properties.body.url.trim().length > 0
                ? properties.body.url 
                : false;
    const method = typeof(properties.body.method) === 'string'
                    && ['get', 'post', 'put', 'delete'].indexOf(properties.body.method) > -1 
                    ? properties.body.method
                    :false
    const successCode = typeof (properties.body.successCode) === 'object' 
                        && properties.body.successCode instanceof Array 
                        ? properties.body.successCode
                        : false;
    const timeOutSecond = typeof (properties.body.timeOutSecond) === 'number'
                          && properties.body.timeOutSecond % 1 === 0 
                          && properties.body.timeOutSecond >= 1
                          && properties.body.timeOutSecond <= 5
                          ? properties.body.timeOutSecond
                          : false;
    if(id){
        if(protocol || url || method || successCode || timeOutSecond){
            data.read("checks", id, (err, checkData) =>{
                if(!err && checkData){
                    let cData = parseJSON(checkData);
                    let tokenId = typeof(properties.headersObject.token) === 'string'
                                    && properties.headersObject.token.trim().length === 20
                                    ? properties.headersObject.token
                                    : false

                    tokenHandler._token.verify(tokenId, cData.phone, tokenIsValid =>{
                        if(tokenIsValid){
                            if(protocol){
                                cData.protocol = protocol
                            }
                            if(url){
                                cData.url = url
                            }
                            if(method){
                                cData.method = method
                            }
                            if(successCode){
                                cData.successCode = successCode
                            }
                            if(timeOutSecond){
                                cData.timeOutSecond = timeOutSecond
                            }
                            console.log(cData)
                            data.update('checks', id, cData, err1 =>{
                                if(!err1){
                                    callback(200, {
                                        "msg": "check data updated successfully",
                                        cData
                                    })
                                }else{
                                    callback(405, {
                                        error: 'server problem'
                                    })
                                }
                            })
     
                        }else{
                            callback(401, {
                                error: 'token is invalid'
                            })
                        }
                    })
                }else{
                    callback(404, {
                        error: 'check id is not found'
                    })
                }
            })
        }else{
            callback(404, {
                error: 'At least one data updataed'
            })
        }
    }

}
handler._check.delete = (properties, callback) =>{
    const id = typeof(properties.body.id) ===  'string' 
                && properties.body.id.trim().length === 20
                ? properties.body.id
                : false;
    data.read("checks", id, (err, checkData) =>{
        if(!err && checkData){
            let tokenId = typeof (properties.headersObject.token) === 'string'
                            && properties.headersObject.token.trim().length === 20
                            ? properties.headersObject.token
                            : false;
            tokenHandler._token.verify(tokenId, parseJSON(checkData).phone, tokenIsValid =>{
                if(tokenIsValid){
                    data.delete('checks', id, err=>{
                        if(!err){
                            data.read("users", parseJSON(checkData).phone, (err, userData)=>{
                                if(!err && userData){
                                    let uData = parseJSON(userData);
                                    let userCheck = typeof(uData.check) === 'object'
                                                && uData.check instanceof Array
                                                ? uData.check
                                                : []
                                    let checkPostion = userCheck.indexOf(id);
                                    if(checkPostion > -1){
                                        userCheck.splice(checkPostion, 1)
                                        uData.check = userCheck
                                        data.update("users", uData.phone, uData, err=>{
                                            if(!err){
                                                callback(200, {
                                                    message: "user check updated and check data deleted"
                                                })
                                            }else{
                                                callback(405, {
                                                    error: "user server problem"
                                                })
                                            }
                                        })

                                    }else{
                                        callback(500, {
                                            error: "the check id is trying to find is not found"
                                        })
                                    }

                                }else{
                                    callback(405, {
                                        error: "user server problem"
                                    })
                                }
                            })
                        }else{
                            callback(405, {
                                error: "server problem"
                            })
                        }
                    })

                }else{
                    callback(403, {
                        error: 'token is invalid'
                    })
                }
            })
        }else{
            callback(400, {
                error: 'There was a problem in your request!',
            });
        }
    })
}


module.exports= handler