const tmi = require('tmi.js');
const fs = require('fs')
const yargs = require('yargs')(process.argv.slice(2));
const YAML = require('yaml')

const credentialsFile = fs.readFileSync('./cred.yaml', 'utf8')

// source: cred.yaml
// Define configuration options
var opts  = YAML.parse(credentialsFile)

// Create a client with our options
const client = new tmi.client(opts);

const commandLineArguments = yargs
	 .option('multitwitch', {
	   alias: 'mt',
	   description: 'List des comptes MultiTwitch',
	   type: 'array',
	 })
	 .argv;

// Traitements des paramètres
// Si on a du multitwitch
if (commandLineArguments.mt) {
  var multiTwitch = true
  var multiTwitchUrl = 'https://multitwitch.tv/Kaauw'
  for (partner of commandLineArguments.mt) {
	multiTwitchUrl = multiTwitchUrl + '/' + partner
  }
  console.log('Url MultiTwitch : ' + multiTwitchUrl)
} else {
  var multiTwitch = false
}

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  switch (commandName) {
	case '!multitwitch':
	  if (multiTwitch === true) {
	    client.say(target, 'Le Multi-Twitch du jour : ' + multiTwitchUrl)
	  }
	  else {
	    client.say(target, 'Pas de Multitwitch aujourd\'hui, contentez vous de moi! Kappa');
	  }
	  break;
    case '!socials':
	  socials(target);
	  break;
	default:
	  console.log(`* Unknown command ${commandName}`);
  }
}

function socials (target) {
  client.say(target, 'Rejoigniez moi sur Discord --> https://discord.com/invite/ne7cDFJ7wB');
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}