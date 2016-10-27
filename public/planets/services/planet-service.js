function PlanetService() {

    var baseURL = '/api/planets'
    var parentURL = '/api/stars'

    this.getPlanets = function () {
        return new Promise(function (resolve, reject) {
            $.get(baseURL).then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.getPlanetsFromStar = function (starId) {
        return new Promise(function (resolve, reject) {
            $.get(parentURL + '/' + starId + '?include=planet').then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.createPlanet = function (planetName, starId) {
        return new Promise(function (resolve, reject) {
            $.post(baseURL, { name: planetName, starId: starId }).then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.deletePlanet = function (planetId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: baseURL + '/' + planetId,
                type: 'DELETE',
                success: resolve,
                error: reject
            });
        })
    }

}