function startGame() {
	// use the DIV tag with Id of 'surface' as our game surface
	var gs = new JSGameSoup("surface", 30);
	// add an instance of the 'Dot' entity class above to our game
	gs.addEntity(new World(gs));
	// launch the game
	gs.launch();
}

