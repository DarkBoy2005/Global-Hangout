
const config = require("../../botconfig/config.json");
const settings = require("../../botconfig/settings.json");
const ee = require("../../botconfig/embed.json");
const Discord = require("discord.js");
const db = require('quick.db');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = async (client, guildMember) => {
	const channelall = client.channels.cache.get(`910184214794760253`)
	const channelmember = client.channels.cache.get(`910184217961451551`)
	const channelbot = client.channels.cache.get(`910184221547569223`)
	channelall.setName(`All users: ${guildMember.guild.members.cache.size}`)
	channelmember.setName(`Members: ${guildMember.guild.members.cache.filter(member => !member.user.bot).size}`)
	channelbot.setName(`Bots: ${guildMember.guild.members.cache.filter(member => member.user.bot).size}`)
	if(!guildMember.user.bot) {
		if(guildMember.guild.id === db.get(`main.set`)) {
			try {
				const welcome1emoji = client.emojis.cache.get("998693068557533285")
				const welcome2emoji = client.emojis.cache.get("998693066644934767")
				const rule1emoji = client.emojis.cache.get("999104579843137546")
				const forms1emoji = client.emojis.cache.get("999251200635568159")
				const faq1emoji = client.emojis.cache.get("999252075227643967")
				const announcements1emoji = client.emojis.cache.get("999252603252777041")
				const event1emoji = client.emojis.cache.get("999253009542422602")
				const suggestion1emoji = client.emojis.cache.get("999253807550709770")
				console.log(guildMember.user.username + " joined " + guildMember.guild.name)
				const { createCanvas, loadImage, Canvas } = require('canvas')
			    const canvas = createCanvas(1428, 357);
			    const ctx = canvas.getContext('2d');
			    const background = await loadImage('pics/welcome-banner.png')
			    const avatar = await loadImage(guildMember.displayAvatarURL({format:'png'}));
			    ctx.drawImage(background, 0, 0, 1428, 357);
			    ctx.beginPath();
			    ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 120, 0, 2 * Math.PI);
			    ctx.fillStyle = "black";
			    ctx.fill();
			    ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 120, 0, 2 * Math.PI, false);
			    ctx.clip();
			    ctx.drawImage(avatar, 589, 55 - 30, 250, 250);
			    ctx.restore();
			    const attachment = new MessageAttachment(canvas.toBuffer(), "welcome.png");
				let rchannel = await guildMember.guild.channels.create( `welcome-${guildMember.displayName}`, {
					type: 'GUILD_TEXT',
					permissionOverwrites: [{
						id: guildMember.guild.roles.everyone.id,
						deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
					},
					{
						id: guildMember.id,
						allow: ['VIEW_CHANNEL']
					}]
				})
				rchannel.send({content: `<@${guildMember.id}>`, embeds: [new MessageEmbed()
					.setTitle(`${welcome1emoji}${welcome2emoji} | Getting started with **Global Hangout**`)
					.setColor(`#00ffff`)
					.setAuthor({
						name: `Welcome ${guildMember.displayName} to the server!`,
						iconURL: guildMember.displayAvatarURL({dynamic: true})
					})
					.setDescription(`> Welcome to the server ${guildMember.displayName}, in this embed we have some important information about the server. Please read it carefully as you will need it.\n> First, this server was originally created for entertainment and for Discord users to have fun. We have every kind of channels, multi language support, etc...\n> We are trying to be global and multi-language so everyone from every continent can enjoy it. Still the main language of the server is English.\n> We do have nationality roles and language channels so you can speak with others speaking your language.`)
					.addFields({
						name: `${rule1emoji} | Discord rules`,
						value: `> We pay extreme attention to enforce our rules. Please read through it in <#909839053296377866> after you finished reading this embed.`,
						inline: true
					},
					{
						name: `${forms1emoji} | Applications`,
						value: `> Currently we have open spots for Moderators, Designers and Managers. You can check them out in <#999251506052223029>.`,
						inline: true
					},
					{
						name: `${faq1emoji} | FAQ`,
						value: `> Before you ask a question in a general question tickets please check the <#909839068567834645> if it was asked before.`,
						inline: true
					},
					{
						name: `${announcements1emoji} | Announcements`,
						value: `> All of the important announcements will be posted in <#909839136767217674>.`,
						inline: true
					},
					{
						name: `${event1emoji} | Server events`,
						value: `> In <#910266113387028521> you can see every ongoing and upcoming events.`,
						inline: true
					},
					{
						name: `${suggestion1emoji} | Suggestions`,
						value: `> Every suggestion you submit will be sent to <#909839156233003099> and will be reviewed by our staff team shortly after.`,
						inline: true
					})
					.setTimestamp()
					.setThumbnail(guildMember.displayAvatarURL({dynamic: true}))
					.setFooter({
						text: `We hope you enjoy your stay, on behalf of the Global Hangout team`,
						iconURL: guildMember.guild.iconURL({dynamic: true})
					})]
				})
				rchannel.send({files: [attachment], embeds: [new MessageEmbed()
					.setColor(`#00ffff`)
					.setImage(`attachment://welcome.png`)
				]})
				db.set(`${guildMember.id}-chnl`, {channel: rchannel.id})
				setTimeout(() => {
					db.delete(`${guildMember.id}-chnl`)
					try {
						rchannel.delete()
					} catch {
						return
					}
				}, 5 * 60000)
			} catch (e) {
				return
			}
			
		} else {
			if(db.get(`${guildMember.guild.id}.set`) !== true) return
			let mainServer = client.guilds.cache.get(db.get(`main.set`))
			let m = mainServer.members.cache.get(guildMember.user.id)
			if(!m)  {
				console.log(guildMember.user.username + " tried to join " + guildMember.guild.name)
				guildMember.send({content: `You have been kicked from ${guildMember.guild.name} because you are not in the main server. https://discord.gg/MEQQTXcxyq`}).catch(e => {
					console.log(e)}
				).then(m => guildMember.kick({reason: 'Not in main server'}))
				console.log(`${guildMember.user.tag} got kicked from ${guildMember.guild.name} for not being in the main server.`)
			} else {
				console.log(guildMember.user.username + " joined " + guildMember.guild.name)
			}
		}
	}
}