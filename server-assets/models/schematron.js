// Josh's Schematron 
// This file contains functions that return promises. 
// These functions should be used in a Promise.all([]).then().catch() setup.

let dataAdapter = require('./data-adapter'),
  DS = dataAdapter.DS;


function existsIn(id, datasetString){
  return new Promise(function(resolve, reject){
    if(!typeof datasetString == 'string'){
      return reject(new Error("datasetString must be a string. This is a server-side error!!"))
    }
    DS.find(datasetString, id)
    .then(function(data){
      if(data){
        resolve(data);
      }
      reject(new Error(`Could not find ${id} in ${datasetString}`))
    })
    .catch(function(error){
      reject(new Error(`Could not find ${id} in ${datasetString}`))
    })
  })
}

function uniqueIn(name, datasetString){
  return new Promise(function(resolve, reject){
    if(!typeof datasetString == 'string'){
      return reject(new Error("datasetString must be a string. This is a server-side error!!"))
    }
    DS.findAll(datasetString, {where:{name:{'==' : name}}})
    .then(function(data){
      if(data.length > 0){
        reject(new Error(`${name} already exists in ${datasetString}`));
      }
      resolve({message: `${name} is unique in ${datasetString}`})
    })
    .catch(function(error){
      resolve({message: `${name} is unique in ${datasetString}`})
    })
  })
}

function actuallyType(item, typeString){
  return new Promise(function(resolve, reject){
    if(!typeof typeString == 'string'){
      reject(new Error("typeString must be a string. This is a server-side error!!"))
    }
    typeString = typeString.toLowerCase();
    if(typeString == 'array'){
      Array.isArray(item) ? resolve(true) : reject(new Error(`${item} is not of type ${typeString}`))
    }
    if(typeof item == typeString){
      resolve(true)
    }
    reject(new Error(`${item} is not of type ${typeString}`))
  })
}

function reaper(propName, id, collectionsArray){
  return new Promise(function(resolve, reject){
    if(!Array.isArray(collectionsArray)){return reject(new Error("collectionsArray is not an array! This is a Server side error..."))}
    collectionsArray.forEach(function(collection){
      let options = {}
      let innerOptions = {'==' : id}
      let midOptions = {}
      midOptions[propName] = innerOptions;
      options.where = midOptions;
      DS.destroyAll(collection, options).catch(function(err){console.log(err)})
    })
    return resolve({message: "reaper is reaping..."})
  })
}

module.exports = {
    existsIn,
    uniqueIn,
    actuallyType,
    reaper
}