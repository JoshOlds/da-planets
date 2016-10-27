var galaxyController = new GalaxyController();
var starController = new StarController();
var planetController = new PlanetController();
var moonController = new MoonController();

switchToGalaxyView();

function switchToGalaxyView(){
    galaxyController.update();
}

function switchToStarView(parentId, parentName){
    starController.initialize(parentId, parentName);
    starController.update();
}

function switchToPlanetView(parentId, parentName){
    planetController.initialize(parentId, parentName);
    planetController.update();
}

function switchToMoonView(parentId, parentName){
    moonController.initialize(parentId, parentName);
    moonController.update();
}



