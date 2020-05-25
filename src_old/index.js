const {
	Client
} = require('discord.js')

const commands = {
	testing: require('./commands/testing.js')
}

const { token } = require('./token.json')

const client = new Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

const commandParser = /^<@!?\d+>\s*(\w+)(?:\s+(\w+))?\s*/

client.on('message', msg => {
	if (!msg.author.bot && msg.mentions.has(client.user)) {
		// We can make this fancier by making a standard embed response thing
		function reply (message) {
			msg.channel.send(`${msg.author}:\n\n${message}\n\nSincerely,\nTODO`)
		}
		
		const match = msg.content.match(commandParser)
		if (match) {
			const [matched, commandName, subCommandName] = match
			const command = commands[commandName]
			if (command) {
				const subCommand = command[subCommandName] || command.default
				if (subCommand) {
					return subCommand({
						client,
						unparsedArgs: msg.content.slice(match.index + matched.length),
						msg,
						reply
					})
				}
			} else {
				reply(`Unknown command \`${command}\``)
			}
		} else {
			reply(`I'm not sure what you mean. Make sure your message is in the following format:\n> ${client.user} <command> [subcommand] [...arguments]\nFor example,\n> ${client.user} testing`)
		}
	}
})

client.login(token)