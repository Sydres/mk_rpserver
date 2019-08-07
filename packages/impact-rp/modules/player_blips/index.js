//Initialize a object that will hold all blips of every player
//We will use IDs to find out who is the owner of a blip
var blips = {};

//Icon show in the minimap for the players
const BlipIcon = 1; //A simple circle

//Color for the icon
const BlipColor = 4; //Light gray

/*	For a list of blip icons and colors just look at:
	https://wiki.rage.mp/index.php?title=Blips
*/

//Called when a player spawns
mp.events.add('playerSpawn', (player) =>
{
	//Create a new blip for that player
	//using its ID for reference
	blips[player.id] = mp.blips.new(BlipIcon, player.position);
	blips[player.id].name = /*player.name*/ "Игрок";
	blips[player.id].dimension = player.dimension;
	blips[player.id].colour = BlipColor;
});

//When a player have a bad luck of dying...
mp.events.add('playerDeath', (player, reason, killer) => {
	//Destroy the blip of that player if it exists
	if (blips[player.id]) {
		blips[player.id].destroy();
	}
});

//When the player leaves the server...
mp.events.add('playerQuit', (player, exitType, reason) => {
	//Destroy his/her blip if it exists
	if (blips[player.id]) {
		blips[player.id].destroy();
	}
});

//Update blip positions based on the positions of the players
function UpdateBlipPositions()
{
	//For every player...
	mp.players.forEach( (player, id) => {
		//Check if his/her blip exists and if they are alive...
		if (blips[player.id] && player.health > 0) {
			//And update the blip position
			blips[player.id].position = player.position;

          	//Quick note: The 'player.health > 0' was necessary
          	//because if we dont do that the server just crashes.
          	//Looks like we can't get player position if he/she is dead.
		}
	});
}

//Calls the update function every second
setInterval(function(){
	UpdateBlipPositions();
}, 1000);
