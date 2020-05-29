// Given the Message object and user input from a command, it'll try to resolve
// it to something useful.

const isSnowflake = /^\d+$/
const isMention = /\\?<@!?(\d+)>/

function getID (input) {
	if (isSnowflake.test(input)) {
		// If the input is just an ID
		return input
	} else {
		// If the input is a user mention
		let match = input.match(isMention)
		if (match) return match[1]
	}
	return null
}

/**
 * This should be able to determine the GuildMember from user input. For
 * example, "\<@!393248490739859458>", "393248490739859458", "moofy-bot",
 * "moofy-bot#3738", and "Broken Chromebook" (if my nickname is "Broken
 * Chromebook") should match Moofy.
 * @param {Discord.Message} msg - The message that triggered the command.
 * @param {string} input - The user input that may refer to a guild member.
 * @returns {?Discord.GuildMember} - If the input is valid, it'll return the
 * guild member object. Otherwise, null.
 */
function member (msg, input) {
	const { guild } = msg
	if (!guild) {
		// The message is in a DM, so there aren't any guild members
		return null
	}

	input = input.toLowerCase()

	let member = null
	let id = getID(input)
	if (id) member = msg.guild.member(id)

	if (!member) {
		// Try matching by username/nickname
		member = msg.guild.members.cache.find(member => {
			// Possible issue: If someone's nickname is someone else's username, the
			// former might get matched first.
			return member.nickname && member.nickname.toLowerCase() === input ||
				member.user.username.toLowerCase() === input ||
				member.user.tag.toLowerCase() === input
		})
	}

	return member
}

/**
 * This is very similar to `member` but it matches a User object. Note that
 * nicknames won't work here.
 * @param {Discord.Client} client - The bot client.
 * @param {string} input - User input that may refer to an actual Discord user.
 * @returns {Discord.User}
 */
function user (client, input) {
	input = input.toLowerCase()

	let user = null
	let id = getID(input)
	if (id) user = client.users.resolve(id)

	if (!user) {
		// Try matching by username/nickname
		user = client.users.cache.find(user => {
			// Possible issue: If someone's nickname is someone else's username, the
			// former might get matched first.
			return user.username.toLowerCase() === input ||
				user.tag.toLowerCase() === input
		})
	}

	return user
}

export {
	member,
	user
}
