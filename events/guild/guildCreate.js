const config = require(`../../botconfig/config.json`);
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const db = require('quick.db');
module.exports = async (client, guild) => {
	if(db.get(`${guild.id}.set`) !== true){
		client.guilds.cache.get(guild.id).leave().then(event => {console.log(`Someone tried to add me to ${guild.name}`)})
		let mainServer = client.guilds.cache.get(db.get(`main.set`))
		let m = mainServer.members.cache.get("329250127703441410")
		const embed = new MessageEmbed()
			.setTitle(`Invites of **${guild.name}**`)
			.setTimestamp();
		try {
			guild.invites.fetch().then((invites) => {
			if (!invites.size){
				embed.setDescription(`No invites were found.`)
				return
			}
			let tempin = invites.map((i) => `${i.code}`)
			db.set(`${guild.id}`, {invites: tempin})
			let allinvites = invites.map((i) => {
				embed.addFields({
					name: `> ${i.code}`, value: `➥ https://discord.gg/${i.code}`
				})})
			})
		} catch (e) {
			embed.setDescription(`No invites were found.`)
			db.set(`${guild.id}`, {invites: `No invites were found`})
		}
		setTimeout(()=>{m.send({content: `Someone tried to add me to a guild: **${guild.name}** \`${guild.id}\`\n Invite codes: ${db.get(`${guild.id}.invites`)}`, embeds: [embed]})}, 10000)
	} else {
		let mainServer = client.guilds.cache.get(db.get(`main.set`))
		let m = mainServer.members.cache.get("329250127703441410")
		guild.invites.fetch().then((invites) => {
			if (!invites.size){
				db.set(`${guild.id}-temp`, {invite: "No invite found"})
				return
			}

				let allinvites = invites.map((i) => {
				db.set(`${guild.id}-temp`, {invite: i.code})
			})
		})
		m.send(`I got added to **${guild.name}** \`${guild.id}\`\n[${db.get(`${guild.id}-temp.invite`)}](https://discord.gg/${db.get(`${guild.id}-temp.invite`)})`)
		return
	}
}