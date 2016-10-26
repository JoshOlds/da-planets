function GalaxyService(hostAddress, port){

    var baseURL = '//' + hostAddress + ':' + port + '/api/galaxies'

    this.getGalaxies = function(){
        return new Promise(function (resolve, reject){
            $.get(baseURL).then(
                function(data){
                    resolve(data);
                },
                function (error){
                    reject(error);
                }
            )
        })
    }

    this.createGalaxy = function(galaxyName){
        return new Promise(function (resolve, reject){
            $.post(baseURL, {name: galaxyName}).then(
                function(data){
                    resolve(data);
                },
                function (error){
                    reject(error);
                }
            )
        })
    }

    this.deleteGalaxy = function(galaxyId){
        return new Promise(function (resolve, reject){
            $.ajax({
                url: baseURL + '/' + galaxyId,
                type: 'DELETE',
                success: resolve,
                error: reject
            });
        })
    }

}