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
    let cleanStar = { id: uuid.v4(), name: xss(star.name), galaxyId: star.galaxyId }
    Star.create({ id: uuid.v4(), name: cleanStar.name, galaxyId: cleanStar.galaxyId}).then(cb).catch(cb)
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

module.exports = {
  create,
  getAll,
  getById
}

