function GalaxyController() {

    var galaxyService = new GalaxyService();
    var me = this;

    this.update = function update() {
        var elem = $('#table-body');
        var header = $('#table-header').html('Galaxies <i class="fa fa-plus galaxy-add" aria-hidden="true"></i> <i class="fa fa-level-up" id="up-galaxy" aria-hidden="true"></i>')
        var template = '';
        var count = 1;

        galaxyService.getGalaxies().then(function (data) {
            data = data.sort(function(current, last){
                if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
            })
            data.forEach(function (galaxy) {
                var color;
                count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                template += `
                <tr class="hoverable">
                <td class="${color} hoverable pointer child-item-star" id=${galaxy.id} name="${galaxy.name}">
                    ${galaxy.name} 
                </td>
                <td class="${color}">
                    ----
                </td>
                <td class="${color}">
                    <i class="fa fa-times galaxy-delete"aria-hidden="true" id="${galaxy.id}"></i>
                </td>
                </tr>
            `
                count++;
            });
            elem.html(template);
        })
    }


    // Event Handlers

    $('body').on('submit', '#form-galaxy', function(e){
        e.preventDefault();
        var name = $('#form-galaxy-text').val();
        galaxyService.createGalaxy(name)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err)
        })
        $('#form-galaxy-text').val('');
        $('#input-form-space').html('');
    })

    $('body').on('click', '.galaxy-delete', function(e){
        e.preventDefault();
        galaxyService.deleteGalaxy(this.id)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err);
        })
    })

    $('body').on('click', '.galaxy-add', function(e){
        e.preventDefault();
        var elem = $('#input-form-space');
        elem.html(`
        <div class="column small-3">
            <form id="form-galaxy">
                <input type="text" id="form-galaxy-text" placeholder="Galaxy Name" required>
                <button class="button" id="form-galaxy-button">Add Galaxy</button>
            </form>
        </div>
        `)
        console.log("test")
    })

    $('body').on('click', '.child-item-star', function(e){
        e.preventDefault();
        switchToStarView(this.id, this.innerText);
    })

}