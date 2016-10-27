function StarService() {

    var baseURL = '/api/stars'
    var parentURL = '/api/galaxies'

    this.getStars = function () {
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

    this.getStarsFromGalaxy = function (galaxyId) {
        return new Promise(function (resolve, reject) {
            $.get(parentURL + '/' + galaxyId + '?include=star').then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.createStar = function (starName, galaxyId) {
        return new Promise(function (resolve, reject) {
            $.post(baseURL, { name: starName, galaxyId: galaxyId }).then(
                function (data) {
                    resolve(data);
                },
                function (error) {
                    reject(error);
                }
            )
        })
    }

    this.deleteStar = function (starId) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: baseURL + '/' + starId,
                type: 'DELETE',
                success: resolve,
                error: reject
            });
        })
    }

}