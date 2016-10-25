let uuid = require('node-uuid'),
  JsData = require('js-data'),
  //NeDbAdapter = require('js-data-nedb'),
  fbAdapter = require('js-data-firebase'),
  DS = new JsData.DS();

let adapter = new fbAdapter({
  basePath: 'https://da-planets-abb9b.firebaseio.com/'
})

DS.registerAdapter('firebase', adapter, { default: true })


function formatQuery(query){
  query = query || ''
  return {
    with: query.split(',').join(' ').split(' ')
  }
}

module.exports = {
  DS,
  uuid,
  formatQuery
}