function GalaxyController() {

    var galaxyService = new GalaxyService(globalIp, globalPort);
    var me = this;

    this.update = function update() {
        var elem = $('#item-holder');
        var template = '';
        var count = 1;

        template += `
        <div class="column small-3">
            <h3 class="item-header">Galaxies</h3>
        </div>
        <div class="column small-3">
            <form id="form-galaxy">
                <input type="text" id="form-galaxy-text" placeholder="Galaxy Name" required>
                <button class="button" id="form-galaxy-button">New Galaxy</button>
            </form>
        </div>
    `

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
                <li class="${color}">
                    ${galaxy.name} <i class="fa fa-trash galaxy-delete"aria-hidden="true" id="${galaxy.id}"></i>
                </li>
            `
                count++;
            });
            elem.html(template);
        })
    }

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

}