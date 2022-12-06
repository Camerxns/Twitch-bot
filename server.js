require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp((/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/));

const commands = {
    fiance:{
        response: 'Check out the beast that coded this https://twitch.tv/cammotto'
    },
    upvote: {
        response: (user) => `User ${user} was just upvoted!`
    }
}

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
	channels: [ 'KatlyBot' ],
    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN,
    }
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

    const [raw, command, argument] = message.match(regexpCommand);
    
    const {response} = commands[command] || {};

    if(typeof response === 'function'){
        client.say(channel, response(tags.username)); 
    } else if (typeof response === 'string'){
        client.say(channel, response);
    }

	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, heya!`);
	}
});

// client.on('message', (channel, tags, message, self) => {
//     let isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

//     if(isNotBot){
//         client.say(channel, `Message '${message}' was sent by ${tags.username}`);
//     }
// 	// "Alca: Hello, World!"
// 	console.log(`${tags['display-name']}: ${message}`);
// });
