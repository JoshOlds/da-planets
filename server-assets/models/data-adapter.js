let uuid = require('node-uuid'),
  JsData = require('js-data'),
  NeDbAdapter = require('js-data-nedb'),
  // fbAdapter = require('js-data-firebase'),
  DS = new JsData.DS();

// let adapter = new fbAdapter({
//   basePath: 'https://firebase.com/whatever'
// })

DS.registerAdapter('nedb', NeDbAdapter, { default: true })


function formatQuery(query){
  query = query || ''
  return {
    with: query.split(',').join(' ').split(' ')
  }
}


// Josh's Schematron stuffs

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

function uniqueIn(id, datasetString){
  return new Promise(function(resolve, reject){
    if(!typeof datasetString == 'string'){
      return reject(new Error("datasetString must be a string. This is a server-side error!!"))
    }
    DS.find(datasetString, id)
    .then(function(data){
      if(data){
        reject(data);
      }
      resolve({message: `${id} is unique in ${datasetString}`})
    })
    .catch(function(error){
      resolve({message: `${id} is unique in ${datasetString}`})
    })
  })
}

function actuallyType(item, typeString){
  return new Promise(function(resolve, reject){
    if(!typeof typeString == 'string'){
      reject(new Error("typeString must be a string. This is a server-side error!!"))
    }
    if(typeof item == typeString){
      resolve(true)
    }
    reject(new Error(`${item} is not of type ${typeString}`))
  })
}





module.exports = {
  DS,
  uuid,
  formatQuery,
  existsIn,
  uniqueIn,
  actuallyType
}