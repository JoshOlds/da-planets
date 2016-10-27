let dataAdapter = require('./data-adapter'),
  schematron = require('./schematron'),
  uuid = dataAdapter.uuid,
  DS = dataAdapter.DS,
  formatQuery = dataAdapter.formatQuery,
  xss = require('xss');

let Planet = DS.defineResource({
  name: 'planet',
  endpoint: 'planets',
  filepath: __dirname + '/../data/planets.db',
  relations: {
    belongsTo: {
      star: {
        localField: 'star',
        localKey: 'starId',
        parent: true
      },
      galaxy: {
        localField: 'galaxy',
        localKey: 'galaxyId',
      }
    },
    hasMany: {
      moon: {
        localField: 'moons',
        foreignKey: 'planetId'
      }
    }
  }
})


function create(planet, cb) {
  // Use the Resource Model to create a new planet

  Promise.all([
    schematron.actuallyType(planet.name, "string"),
    schematron.actuallyType(planet.starId, "string"),
    schematron.uniqueIn(planet.name, "planet"),
    schematron.existsIn(planet.starId, "star"),
  ])
    .then(function () {
      let star = DS.find('star', planet.starId).then(function (star) { 
        let cleanPlanet = { id: uuid.v4(), name: xss(planet.name), starId: planet.starId, galaxyId: star.galaxyId, parentName: star.name }
        Planet.create(cleanPlanet).then(cb).catch(cb)
      }).catch(function (error) {
        cb(error);
      })
    })
    .catch(function (error) {
      cb(error);
    })
}

function getAll(query, cb) {
  //Use the Resource Model to get all Galaxies
  Planet.findAll({}, formatQuery(query)).then(cb).catch(cb)
}

function getById(id, query, cb) {
  // use the Resource Model to get a single planet by its id
  Planet.find(id, formatQuery(query)).then(cb).catch(cb)
}

function deleteById(id, cb) {
  schematron.existsIn(id, "planet")
    .then(function () {

      Planet.destroy(id)
        .then(function (returnedId) {
          schematron.reaper('planetId', id, ['moon'])
          cb({ message: `Planet destroyed: ${returnedId}` })
        }
        )
        .catch(function (returnedId) { cb(new Error(`Planet does not exist! ${returnedId}`)) });
    })
    .catch(function (returnedId) { cb(new Error(returnedId)) })
}

module.exports = {
  create,
  getAll,
  getById,
  deleteById
}

