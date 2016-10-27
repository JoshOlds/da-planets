function MoonService() {

    var baseURL = '/api/moons'
    var parentURL = '/api/planets'

    this.getMoons = function () {
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

    this.getMoonsFromPlanet = function (planetId) {
        return new Promise(function (resolve, reject) {
            $.get(parentURL + '/' + planetId + '?include=moon').then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.createMoon = function (moonName, planetId) {
        return new Promise(function (resolve, reject) {
            $.post(baseURL, { name: moonName, planetId: planetId }).then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.deleteMoon = function (moonId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: baseURL + '/' + moonId,
                type: 'DELETE',
                success: resolve,
                error: reject
            });
        })
    }

}