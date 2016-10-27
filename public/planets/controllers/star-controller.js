function StarController(parentId, parentName) {

    var parentName = parentName;
    var parentId = parentId;
    var starService = new StarService();
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
            var header = $('#table-header').html(`${parentName}: Stars <i class="fa fa-plus star-add" id="${parentId}" aria-hidden="true"></i>`)
            starService.getStarsFromGalaxy(parentId).then(function (data) {
                data = data.stars || [];
                data = data.sort(function(current, last){
                    if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                    if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                    if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
                })
            
                data.forEach(function (star) {
                    var color;
                    count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                    template += `
                    <tr>
                    <td class="${color} hoverable pointer child-item-planet"  id=${star.id}>
                        ${star.name} 
                    </td>
                    <td class="${color} hoverable pointer parent-item-galaxy" id=${star.galaxyId}>
                        ${parentName}
                    </td>
                    <td class="${color}">
                        <i class="fa fa-times star-delete"aria-hidden="true" id="${star.id}"></i>
                    </td>
                    
                    </tr>
                `
                    count++;
                });
                elem.html(template);
            })
        }
        if(!parentId){
            var header = $('#table-header').html(`Stars <i class="fa fa-plus star-add" id="${parentId}" aria-hidden="true"></i>`)
            starService.getStars().then(function (data) {
                data = data.sort(function(current, last){
                    if(current.name.toLowerCase() < last.name.toLowerCase()) return -1;
                    if(current.name.toLowerCase() == last.name.toLowerCase()) return 0;
                    if(current.name.toLowerCase() > last.name.toLowerCase()) return 1;
                })
            
                data.forEach(function (star) {
                    var color;
                    count % 2 == 0 ? color = 'main-item' : color = 'alt-item';
                    template += `
                    <tr class="hoverable">
                    <td class="${color} hoverable pointer child-item-planet"  id=${star.id}>
                        ${star.name} 
                    </td>
                    <td class="${color} hoverable pointer parent-item-galaxy"  id=${star.galaxyId}>
                        ${star.parentName}
                    </td>
                    <td class="${color}">
                        <i class="fa fa-times star-delete"aria-hidden="true" id="${star.id}"></i>
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

    $('body').on('submit', '#form-star', function(e){
        e.preventDefault();
        var name = $('#form-star-text').val();
        starService.createStar(name, parentId)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err)
        })
        $('#form-star-text').val('');
        $('#input-form-space').html('');
    })

    $('body').on('click', '.star-delete', function(e){
        e.preventDefault();
        starService.deleteStar(this.id)
        .then(function(data){
            me.update();
        })
        .catch(function(err){
            console.log(err);
        })
    })

    $('body').on('click', '.star-add', function(e){
        e.preventDefault();
        var elem = $('#input-form-space');
        elem.html(`
        <div class="column small-3">
            <form id="form-star">
                <input type="text" id="form-star-text" placeholder="Star Name" required>
                <button class="button" id="form-star-button">Add Star</button>
            </form>
        </div>
        `)
        console.log("test")
    })

    $('body').on('click', '.child-item-planet', function(e){
        e.preventDefault();
        switchToPlanetView(this.id, this.innerText);
    })

    $('body').on('click', '.parent-item-galaxy', function(e){
        e.preventDefault();
        switchToStarView(this.id, this.innerText);
    })

}