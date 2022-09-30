const config = require("../../botconfig/config.json");
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js");
const db = require('quick.db');
const lodash = require("lodash");
module.exports = async (client, reaction, user) => {
	try {
		if (user.bot) return;
		const loadingemoji = client.emojis.cache.get("993229855443398656")
		const message = reaction.message
		const emoji = reaction.emoji
		const server = client.guilds.cache.get(reaction.message.guild.id)
		const roleid = db.get(`${server.id}-${message.id}-${emoji.id}.roleId`)
		if(roleid) {
			let role = server.roles.cache.find(role => role.id === roleid)
			let member = server.members.cache.get(user.id)
			member.roles.add(roleid)
			reaction.message.channel.send({content: `${loadingemoji} \`Giving ${role.name} role...\` | You'll receive your role shortly <@${user.id}>...`}).then(msg => {
				setTimeout(() => {
					msg.delete()
				}, 3000)
			})
		}
	} catch (e) {
		console.log(e)
	}
}