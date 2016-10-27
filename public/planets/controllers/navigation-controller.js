$('#nav-galaxies').on('click', function(e){
    e.preventDefault();
    switchToGalaxyView();
})

$('#nav-stars').on('click', function(e){
    e.preventDefault();
    switchToStarView();
})

$('#nav-planets').on('click', function(e){
    e.preventDefault();
    switchToPlanetView();
})

$('#nav-moons').on('click', function(e){
    e.preventDefault();
    switchToMoonView();
})