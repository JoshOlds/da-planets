let dataAdapter = require('./data-adapter'),
  schematron = require('./schematron'),
  uuid = dataAdapter.uuid,
  DS = dataAdapter.DS,
  formatQuery = dataAdapter.formatQuery,
  xss = require('xss');

let Moon = DS.defineResource({
  name: 'moon',
  endpoint: 'moons',
  filepath: __dirname + '/../data/moons.db',
  relations: {
    belongsTo: {
      planet: {
        localField: 'planet',
        localKey: 'planetId',
        parent: true
      },
      star: {
        localField: 'star',
        localKey: 'starId',
      },
      galaxy: {
        localField: 'galaxy',
        localKey: 'galaxyId',
      }
    },
  }
})


function create(moon, cb) {
  // Use the Resource Model to create a new moon
  Promise.all([
    schematron.actuallyType(moon.name, "string"),
    schematron.actuallyType(moon.planetId, "string"),
    schematron.uniqueIn(moon.name, "moon"),
    schematron.existsIn(moon.planetId, "planet"),
  ])
  .then(function(){
    let planet = DS.find('planet', moon.planetId).then(function(planet){
      let cleanMoon = { id: uuid.v4(), name: xss(moon.name), planetId: moon.planetId, starId: planet.starId, galaxyId: planet.galaxyId}
      Moon.create(cleanMoon).then(cb).catch(cb)
    }).catch(function(error){
      cb(error);
    })
  })
  .catch(function(error){
    cb(error);
  })
}

function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Moon.findAll({}, formatQuery(query)).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single moon by its id
  Moon.find(id, formatQuery(query)).then(cb).catch(cb)
}

function deleteById(id, cb){
  schematron.existsIn(id, "moon")
  .then(function(){
    
    Moon.destroy(id)
    .then(function(returnedId){
      schematron.reaper('moonId', id, [])
      cb({message: `Moon destroyed: ${returnedId}`})}
      )
    .catch(function(returnedId){cb(new Error(`Moon does not exist! ${returnedId}`))});
  })
  .catch(function(returnedId){cb(new Error(returnedId))})
}

module.exports = {
  create,
  getAll,
  getById,
  deleteById
}

