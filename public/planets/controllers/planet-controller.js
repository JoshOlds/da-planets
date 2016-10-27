function PlanetController(parentId, parentName) {

    var parentName = parentName;
    var parentId = parentId;
    var planetService = new PlanetService();
    var me = this;

    this.initialize = function initialize(newParentId, newParentName){
        parentId = newParentId;
        parentName = newParentName;
    }

    this.update = function update() {
        var elem = $('#table-body');
        var template = '';
        var count = 1;

        if(parentId){
            var header = $('#table-header').html(`${parentName}: Planets <i class="fa fa-plus planet-add" id="${parentId}" aria-hidden="true"></i> <i class="fa fa-level-up" id="up-planet" aria-hidden="true"></i>`)
            planetService.getPlanetsFromStar(parentId).then(function (data) {
                data = data.planets || [];
                data = data.sort(function(current, last){
                    if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                    if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                    if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
                })
            
                data.forEach(function (planet) {
                    var color;
                    count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                    template += `
                    <tr>
                    <td class="${color} hoverable pointer child-item-moon"  id=${planet.id}>
                        ${planet.name} 
                    </td>
                    <td class="${color} hoverable pointer parent-item-star" id=${planet.starId}>
                        ${parentName}
                    </td>
                    <td class="${color}">
                        <i class="fa fa-times planet-delete"aria-hidden="true" id="${planet.id}"></i>
                    </td>
                    
                    </tr>
                `
                    count++;
                });
                elem.html(template);
            })
        }
        if(!parentId){
            var header = $('#table-header').html(`Planets <i class="fa fa-plus planet-add" id="${parentId}" aria-hidden="true"></i> <i class="fa fa-level-up" id="up-planet" aria-hidden="true"></i>`)
            planetService.getPlanets().then(function (data) {
                data = data.sort(function(current, last){
                    if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                    if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                    if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
                })
            
                data.forEach(function (planet) {
                    var color;
                    count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                    template += `
                    <tr class="hoverable">
                    <td class="${color} hoverable pointer child-item-moon"  id=${planet.id}>
                        ${planet.name} 
                    </td>
                    <td class="${color} hoverable pointer parent-item-star"  id=${planet.starId}>
                        ${planet.parentName}
                    </td>
                    <td class="${color}">
                        <i class="fa fa-times planet-delete"aria-hidden="true" id="${planet.id}"></i>
                    </td>
                    
                    </tr>
                `
                    count++;
                });
                elem.html(template);
            })
        }
    }


    // Event Handlers

    $('body').on('submit', '#form-planet', function(e){
        e.preventDefault();
        var name = $('#form-planet-text').val();
        planetService.createPlanet(name, parentId)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err)
        })
        $('#form-planet-text').val('');
        $('#input-form-space').html('');
    })

    $('body').on('click', '.planet-delete', function(e){
        e.preventDefault();
        planetService.deletePlanet(this.id)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err);
        })
    })

    $('body').on('click', '.planet-add', function(e){
        e.preventDefault();
        var elem = $('#input-form-space');
        elem.html(`
        <div class="column small-3">
            <form id="form-planet">
                <input type="text" id="form-planet-text" placeholder="Planet Name" required>
                <button class="button" id="form-planet-button">Add Planet</button>
            </form>
        </div>
        `)
        console.log("test")
    })

    $('body').on('click', '.child-item-moon', function(e){
        e.preventDefault();
        switchToMoonView(this.id, this.innerText);
    })

    $('body').on('click', '.parent-item-star', function(e){
        e.preventDefault();
        switchToPlanetView(this.id, this.innerText);
    })

    $('body').on('click', '#up-planet', function(e){
        e.preventDefault();
        switchToStarView();
    })

}