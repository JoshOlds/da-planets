let dataAdapter = require('./data-adapter'),
  schematron = require('./schematron'),
  uuid = dataAdapter.uuid,
  DS = dataAdapter.DS,
  formatQuery = dataAdapter.formatQuery,
  xss = require('xss');

let Galaxy = DS.defineResource({
  name: 'galaxy',
  endpoint: 'galaxies',
  filepath: __dirname + '/../data/galaxies.db',
  relations: {
    hasMany: {
      star: {
        localField: 'stars',
        foreignKey: 'galaxyId'
      },
      planet: {
        localField: 'planets',
        foreignKey: 'galaxyId'
      },
      moon: {
        localField: 'moons',
        foreignKey: 'galaxyId'
      },
      creature: [{
        localField: 'creatures',
        foreignKeys: 'galaxyIds'
      },
      {
        localField: 'knownCreatures',
        localKeys: 'creatureIds'
      }]
    }
  }
})


function create(galaxy, cb) {
  // Use the Resource Model to create a new galaxy
  Promise.all([
    schematron.actuallyType(galaxy.name, "string"),
    schematron.uniqueIn(galaxy.name, "galaxy")
  ])
  .then(function(){
    let cleanGalaxy = { id: uuid.v4(), name: xss(galaxy.name) }
    Galaxy.create(cleanGalaxy).then(cb).catch(cb)
  })
  .catch(function(error){
    cb(error);
  })
  
}

function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Galaxy.findAll({}).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single galaxy by its id
  Galaxy.find(id, formatQuery(query)).then(cb).catch(cb)
}

function deleteById(id, cb){
  schematron.existsIn(id, "galaxy")
  .then(function(){
    
    Galaxy.destroy(id)
    .then(function(returnedId){
      schematron.reaper('galaxyId', id, ['star', 'planet', 'moon'])
      cb({message: `Galaxy destroyed: ${returnedId}`})}
      )
    .catch(function(returnedId){cb(new Error(`Galaxy does not exist! ${returnedId}`))});
  })
  .catch(cb)
}

// function updateById(id, data, cb){
//   schematron.existsIn(id, "galaxy")
//   .then(function(){
//     Galaxy.(id, )
//   })
//   .catch(cb)
// }

module.exports = {
  create,
  getAll,
  getById,
  deleteById
}

