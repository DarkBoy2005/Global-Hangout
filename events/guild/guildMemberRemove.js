const config = require("../../botconfig/config.json");
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js");
const db = require('quick.db');

module.exports = (client, member) => {
    const channelall = client.channels.cache.get(`910184214794760253`)
    const channelmember = client.channels.cache.get(`910184217961451551`)
    const channelbot = client.channels.cache.get(`910184221547569223`)
    channelall.setName(`All users: ${member.guild.members.cache.size}`)
    channelmember.setName(`Members: ${member.guild.members.cache.filter(member => !member.user.bot).size}`)
    channelbot.setName(`Bots: ${member.guild.members.cache.filter(member => member.user.bot).size}`)
    console.log(member.user.username + " left " + member.guild.name)
    if(!member.user.bot) {
    	if(member.guild.id !== db.get(`main.set`)) return;
			client.guilds.cache.forEach(g => {
			let m = g.members.cache.get(member.user.id)
			if(m) {
				try {
					m.kick({reason: 'User left main server'})
					console.log( '' + member.user.username + ' got kicked from all of the servers because they left the main server.')
				} catch (e) {
					console.log(`I wasn't able to kick ${member.user.username} out from ${member.guild.name} because of an error: ${e}`)
				}
			}
		})
		const chnl = db.get(`${member.id}-chnl.channel`) || null
		if(chnl) {
			const chnl2 = client.channels.cache.get(chnl)
			chnl2.delete()
			db.delete(`${member.id}-chnl`)
		}
    }
}