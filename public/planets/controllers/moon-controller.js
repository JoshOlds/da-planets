function MoonController(parentId, parentName) {

    var parentName = parentName;
    var parentId = parentId;
    var moonService = new MoonService();
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
            var header = $('#table-header').html(`${parentName}: Moons <i class="fa fa-plus moon-add" id="${parentId}" aria-hidden="true"></i> <i class="fa fa-level-up" id="up-moon" aria-hidden="true"></i>`)
            moonService.getMoonsFromPlanet(parentId).then(function (data) {
                data = data.moons || [];
                data = data.sort(function(current, last){
                    if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                    if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                    if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
                })
            
                data.forEach(function (moon) {
                    var color;
                    count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                    template += `
                    <tr>
                    <td class="${color} hoverable pointer child-item-"  id=${moon.id}>
                        ${moon.name} 
                    </td>
                    <td class="${color} hoverable pointer parent-item-planet" id=${moon.planetId}>
                        ${parentName}
                    </td>
                    <td class="${color}">
                        <i class="fa fa-times moon-delete"aria-hidden="true" id="${moon.id}"></i>
                    </td>
                    
                    </tr>
                `
                    count++;
                });
                elem.html(template);
            })
        }
        if(!parentId){
            var header = $('#table-header').html(`Moons <i class="fa fa-level-up" id="up-moon" aria-hidden="true"></i>`)
            moonService.getMoons().then(function (data) {
                data = data.sort(function(current, last){
                    if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                    if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                    if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
                })
            
                data.forEach(function (moon) {
                    var color;
                    count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                    template += `
                    <tr class="hoverable">
                    <td class="${color} hoverable pointer child-item-"  id=${moon.id}>
                        ${moon.name} 
                    </td>
                    <td class="${color} hoverable pointer parent-item-planet"  id=${moon.planetId}>
                        ${moon.parentName}
                    </td>
                    <td class="${color}">
                        <i class="fa fa-times moon-delete"aria-hidden="true" id="${moon.id}"></i>
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

    $('body').on('submit', '#form-moon', function(e){
        e.preventDefault();
        var name = $('#form-moon-text').val();
        moonService.createMoon(name, parentId)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err)
        })
        $('#form-moon-text').val('');
        $('#input-form-space').html('');
    })

    $('body').on('click', '.moon-delete', function(e){
        e.preventDefault();
        moonService.deleteMoon(this.id)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err);
        })
    })

    $('body').on('click', '.moon-add', function(e){
        e.preventDefault();
        var elem = $('#input-form-space');
        elem.html(`
        <div class="column small-3">
            <form id="form-moon">
                <input type="text" id="form-moon-text" placeholder="Moon Name" required>
                <button class="button" id="form-moon-button">Add Moon</button>
            </form>
        </div>
        `)
        console.log("test")
    })

    $('body').on('click', '.child-item-', function(e){
        e.preventDefault();
        //switchToMoonView(this.id, this.innerText);
    })

    $('body').on('click', '.parent-item-planet', function(e){
        e.preventDefault();
        switchToMoonView(this.id, this.innerText);
    })

    $('body').on('click', '#up-moon', function(e){
        e.preventDefault();
        switchToPlanetView();
    })

}