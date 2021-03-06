let dataAdapter = require('./data-adapter'),
  schematron = require('./schematron'),
  uuid = dataAdapter.uuid,
  DS = dataAdapter.DS,
  formatQuery = dataAdapter.formatQuery,
  xss = require('xss');

let Star = DS.defineResource({
  name: 'star',
  endpoint: 'stars',
  filepath: __dirname + '/../data/stars.db',
  relations: {
    belongsTo: {
      galaxy: {
        localField: 'galaxy',
        localKey: 'galaxyId'
      }
    },
    hasMany: {
      planet: {
        localField: 'planets',
        foreignKey: 'starId'
      }
    }
  }
})



function create(star, cb) {
  // Use the Resource Model to create a new star
  Promise.all([
    schematron.actuallyType(star.name, "string"),
    schematron.actuallyType(star.galaxyId, "string"),
    schematron.uniqueIn(star.name, "star"),
    schematron.existsIn(star.galaxyId, "galaxy")
  ])
  .then(function(){
    
    DS.find('galaxy', star.galaxyId).then(function(galaxy){
      let cleanStar = { id: uuid.v4(), name: xss(star.name), galaxyId: star.galaxyId, parentName: galaxy.name }
      Star.create(cleanStar).then(cb).catch(cb)
    })
    
  })
  .catch(function(error){
    cb(error);
  })
}

function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Star.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single star by its id
  Star.find(id, formatQuery(query)).then(cb).catch(cb)
}

function deleteById(id, cb){
  schematron.existsIn(id, "star")
  .then(function(){
    
    Star.destroy(id)
    .then(function(returnedId){
      schematron.reaper('starId', id, ['planet', 'moon'])
      cb({message: `Star destroyed: ${returnedId}`})}
      )
    .catch(function(returnedId){cb(new Error(`Star does not exist! ${returnedId}`))});
  })
  .catch(function(returnedId){cb(new Error(returnedId))})
}

module.exports = {
  create,
  getAll,
  getById,
  deleteById
}

