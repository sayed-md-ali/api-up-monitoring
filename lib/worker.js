/*
 * Title: worker related work
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/15/2020
 *
 */
// dependencies
const data = require('./data')
const {parseJSON} = require('../helpers/utilities')
// app object - module scaffolding
const worker = {};

worker.gatherAllChecks = () =>{
   data.allFile('checks', ((err, checklist) =>{
      if(!err && checklist && checklist.length > 0){
         checklist.foreach(check =>{
            data.read('checks', check, (err, originalCheckData)=>{
               if(!err && originalCheckData){
                  worker.validation(parseJSON(originalCheckData));
               }else{
                  console.log(`reading ${check} data`)
               }
            })
         })
      }else{
         console.log("error: checklist problem")
      }
   }))
}
worker.validation = (check) =>{

}
worker.loop = () =>{

   setInterval(()=>{

      worker.gatherAllChecks();

   }, 1000 * 60 )
}
// start the worker
worker.init = () =>{
   console.log('worker is running');
   worker.loop();
}

module.exports = worker;
