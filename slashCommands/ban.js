const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const db = require('quick.db');
module.exports = {
	name: "ban",
	description: "Global ban someone",
	cooldown: 0,
	memberpermissions: ["BAN_MEMBERS"],
	requiredroles: [],
	alloweduserids: [""],
	options: [
		{"User":
			{
				name: "target",
				description: "Ban target ID",
				required: true,
			}
		},
		{"String":
			{
				name: "reason",
				description: "Ban reason",
				required: true,
			}
		}],
	run: async (client, interaction) => {
		const erroremoji = client.emojis.cache.get("993183132448739430");
		const error2emoji = client.emojis.cache.get("993183130913603605");
		const yesemoji = client.emojis.cache.get("993182821965369374");
		const noemoji = client.emojis.cache.get("993182968967335958");
		const successemoji = client.emojis.cache.get("993183917039431740")
		const checkemoji = client.emojis.cache.get("993183915693047849")
		const maintenanceemoji = client.emojis.cache.get("993184898007445634")
		const offlineemoji = client.emojis.cache.get("993184896686231552")
		const onlineemoji = client.emojis.cache.get("993184895151132694")
		const target = interaction.options.getUser("target")
		const reason = interaction.options.getString("reason")
		try{
			if(interaction.guild.id === db.get(`main.set`)){
				try {
					client.guilds.cache.forEach(g => {
						try {
							g.bans.create(target, {reason: reason})
							console.log(`${target.username} got banned from ${g.name}`)
						} catch (e) {
							console.log(`${target.username} wasn't banned in ${g.bane} due to an error.`)
						}
					})
				} catch (e) {
					interaction.reply({
						content: '<@' + member.user.id + '>',
						embeds: [new MessageEmbed()
							.setTitle(`${error2emoji} | Usage error`)
							.setDescription("There is no user with this ID.")
							.setColor(ee.wrongcolor)],
						ephemeral: true
					})
				}
				console.log( '' + target.username + ' got banned from all of the servers because they were banned from the main server.')
				interaction.reply({embeds: [new MessageEmbed().setTitle(`${successemoji} | User banned`).setDescription(`${target.username} was banned for ${reason}`).setColor(ee.errorcolor)]})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
			return interaction.reply({
				embeds: [new MessageEmbed()
					.setColor(ee.errorcolor)
					.setTitle(`${erroremoji} Error | An internal error occurred`)
					.setDescription(`Please take a screenshot of this message and send it to <@${settings.ownerIDS}>`)
					.addField({
						name: 'Log message:',
						value: `\`\`\`fix\n${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\n\`\`\``
					})
				],
				ephemeral: true
			});
		}
	}
}
