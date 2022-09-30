const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const db = require('quick.db');
module.exports = async (client, modal) => {
	if(modal.customId === 'report-modal'){
		let rcategory = modal.guild.channels.cache.find((c) => c.id === `${db.get(`${modal.guild.id}.report-category`)}`&&c.type ==="GUILD_CATEGORY")
		if (!rcategory) return modal.reply({content: 'Category not found', ephemeral: true})
		let rchannel = await modal.guild.channels.create( modal.member.displayName + '-report-unclaimed', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: modal.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: `${db.get(`${modal.guild.id}.supportrole`)}`,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: modal.member.id,
                allow: ['VIEW_CHANNEL']
            }]
        }).then(channel2=> channel2.setParent(rcategory, { lockPermissions: false}));
		const title = modal.getTextInputValue('report-title')
		const user = modal.getTextInputValue('report-user')
		const description = modal.getTextInputValue('report-details')
		const witness = modal.getTextInputValue('report-witnesses')
		const evidence = modal.getTextInputValue('report-evidence')
		const reportembed2 = new MessageEmbed()
			.setTitle("Ticket - " + title)
			.addFields(
				{
					name: 'Ticker information',
					value: `> **Ticker opener:** <@${modal.member.user.id}>\n> **Ticker opened:** <t:${Math.floor(Date.now()/1000)}:F>\n> **Reported user:** ${user}\n> **Description:** ${description}`
				})
			.setTimestamp()
		if(!evidence) {
			reportembed2.addFields(
				{
					name:'Evidence',
					value:'There is no provided evidence',
					inline:true
				}
			)
		} else {
			reportembed2.addFields(
				{
					name:'Evidence',
					value:evidence,
					inline:true
				}
			)
		}
		if(!witness) {
			reportembed2.addFields(
				{
					name:'Witnesses',
					value:'There are no provided witnesses',
					inline:true
				}
			)
		} else {
			reportembed2.addFields(
				{
					name:'Witnesses',
					value:witness,
					inline:true
				}
			)
		}
		let ticketreport = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('tclose')
					.setLabel('Close')
					.setStyle('DANGER')
				)
			.addComponents(
				new MessageButton()
					.setCustomId('tclaim')
					.setLabel('Claim')
					.setStyle('SUCCESS')
				);
		rchannel.send({
			content: `<@&${db.get(`${modal.guild.id}.supportrole`)}>, <@${modal.member.user.id}>`,
			embeds: [reportembed2],
			components: [ticketreport]
		}).then(msg => msg.pin())
		await modal.deferReply({ ephemeral: true })
		modal.followUp({
			content: 'Ticket opened: <#' + rchannel.id + '>',
		});
		db.set(`${rchannel.id}`, {
			type: 'report',
			title: `${title}`,
			status: `unclaimed`,
			channelid: `${rchannel.id}`,
			opened: `${Math.floor(Date.now()/1000)}`
		})
		db.set(`${rchannel.id}-member`, {
			userid: `${modal.member.user.id}`,
			displayname: `${modal.member.displayName}`,
			usertag: `${modal.member.user.tag}`,
			avatarurl: `${modal.member.displayAvatarURL({dynamic:true})}`,
		})
		db.add(`${modal.guild.id}.ticketcount`, 1)
	}
	if(modal.customId === 'general-modal'){
		let gcategory = modal.guild.channels.cache.find((c) => c.id === `${db.get(`${modal.guild.id}.general-category`)}`&&c.type ==="GUILD_CATEGORY")
		if (!gcategory) return modal.reply({content: 'Category not found', ephemeral: true})
		let gchannel = await modal.guild.channels.create( modal.member.displayName + '-general-unclaimed', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: modal.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: `${db.get(`${modal.guild.id}.supportrole`)}`,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: modal.member.id,
                allow: ['VIEW_CHANNEL']
            }]
        }).then(channel2=> channel2.setParent(gcategory, { lockPermissions: false}));
        const title = modal.getTextInputValue('general-title')
		const details = modal.getTextInputValue('general-details')
		const generalembed2 = new MessageEmbed()
			.setTitle("Ticket - " + title)
			.addFields(
				{
					name: 'Ticker information',
					value: `> **Ticket opener:** <@${modal.member.user.id}>\n> **Ticket opened:** <t:${Math.floor(Date.now()/1000)}:F>\n> **Details:** ${details}`
				})
			.setTimestamp()
		let ticketgeneral = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('tclose')
					.setLabel('Close')
					.setStyle('DANGER')
				)
			.addComponents(
				new MessageButton()
					.setCustomId('tclaim')
					.setLabel('Claim')
					.setStyle('SUCCESS')
				);
		gchannel.send({
			content: `<@&${db.get(`${modal.guild.id}.supportrole`)}>, <@${modal.member.user.id}>`,
			embeds: [generalembed2],
			components: [ticketgeneral]
		}).then(msg => msg.pin())
		await modal.deferReply({ ephemeral: true })
		modal.followUp({
			content: 'Ticket opened: <#' + gchannel.id + '>',
		});
		db.set(`${gchannel.id}`, {
			type: 'general',
			title: `${title}`,
			status: `unclaimed`,
			channelid: `${gchannel.id}`,
			opened: `${Math.floor(Date.now()/1000)}`
		})
		db.set(`${gchannel.id}-member`, {
			userid: `${modal.member.user.id}`,
			displayname: `${modal.member.displayName}`,
			usertag: `${modal.member.user.tag}`,
			avatarurl: `${modal.member.displayAvatarURL({dynamic:true})}`,
		})
		db.add(`${modal.guild.id}.ticketcount`, 1)
	}
	if(modal.customId === 'appeal-modal'){
		let acategory = modal.guild.channels.cache.find((c) => c.id === `${db.get(`${modal.guild.id}.appeal-category`)}`&&c.type ==="GUILD_CATEGORY")
		if (!acategory) return modal.reply({content: 'Category not found', ephemeral: true})
		let achannel = await modal.guild.channels.create( modal.member.displayName + '-appeal-unclaimed', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: modal.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: `${db.get(`${modal.guild.id}.supportrole`)}`,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: modal.member.id,
                allow: ['VIEW_CHANNEL']
            }]
        }).then(channel2=> channel2.setParent(acategory, { lockPermissions: false}));
        const title = modal.getTextInputValue('appeal-title')
		const punisher = modal.getTextInputValue('appeal-punisher')
		const reason = modal.getTextInputValue('appeal-reason')
		const details = modal.getTextInputValue('appeal-details')
		const sentence = modal.getTextInputValue('appeal-sentence')
		const appealembed2 = new MessageEmbed()
			.setTitle("Ticket - " + title)
			.addFields(
				{
					name: 'Ticker information',
					value: `> **Ticket opener:** <@${modal.member.user.id}>\n> **Ticket opened:** <t:${Math.floor(Date.now()/1000)}:F>\n> **Punisher:** ${punisher}\n> **Details:** ${details}\n> **Reason:** ${reason}\n> **Appeal:** ${sentence}`
				})
			.setTimestamp()
		let ticketappeal = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('tclose')
					.setLabel('Close')
					.setStyle('DANGER')
				)
			.addComponents(
				new MessageButton()
					.setCustomId('tclaim')
					.setLabel('Claim')
					.setStyle('SUCCESS')
				);
		achannel.send({
			content: `<@&${db.get(`${modal.guild.id}.supportrole`)}>, <@${modal.member.user.id}>`,
			embeds: [appealembed2],
			components: [ticketappeal]
		}).then(msg => msg.pin())
		await modal.deferReply({ ephemeral: true })
		modal.followUp({
			content: 'Ticket opened: <#' + achannel.id + '>',
		});
		db.set(`${achannel.id}`, {
			type: 'appeal',
			title: `${title}`,
			status: `unclaimed`,
			channelid: `${achannel.id}`,
			opened: `${Math.floor(Date.now()/1000)}`
		})
		db.set(`${achannel.id}-member`, {
			userid: `${modal.member.user.id}`,
			displayname: `${modal.member.displayName}`,
			usertag: `${modal.member.user.tag}`,
			avatarurl: `${modal.member.displayAvatarURL({dynamic:true})}`,
		})
		db.add(`${modal.guild.id}.ticketcount`, 1)
	}
	if(modal.customId === 'partner-modal'){
		let pcategory = modal.guild.channels.cache.find((c) => c.id === `${db.get(`${modal.guild.id}.partner-category`)}`&&c.type ==="GUILD_CATEGORY")
		if (!pcategory) return modal.reply({content: 'Category not found', ephemeral: true})
		let pchannel = await modal.guild.channels.create( modal.member.displayName + '-partner-unclaimed', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: modal.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: `${db.get(`${modal.guild.id}.supportrole`)}`,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: modal.member.id,
                allow: ['VIEW_CHANNEL']
            }]
        }).then(channel2=> channel2.setParent(pcategory, { lockPermissions: false}));
        const title = modal.getTextInputValue('partner-name')
        const name = modal.getTextInputValue('partner-fullname')
		const link = modal.getTextInputValue('partner-link')
		const ad = modal.getTextInputValue('partner-ad')
		const partnershipembed2 = new MessageEmbed()
			.setTitle("Ticket - " + title)
			.addFields(
				{
					name: 'Ticker information',
					value: `> **Ticket opener:** <@${modal.member.user.id}>\n> **Ticket opened:** <t:${Math.floor(Date.now()/1000)}:F>\n> **Server:** ${name}(${title})\n> **Link:** ${link}`
				})
			.setDescription('```\n' + ad + '\n```')
			.setTimestamp()
		let ticketpartnership = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('tclose')
					.setLabel('Close')
					.setStyle('DANGER')
				)
			.addComponents(
				new MessageButton()
					.setCustomId('tclaim')
					.setLabel('Claim')
					.setStyle('SUCCESS')
				);
		pchannel.send({
			content: `<@&${db.get(`${modal.guild.id}.supportrole`)}>, <@${modal.member.user.id}>`,
			embeds: [partnershipembed2],
			components: [ticketpartnership]
		}).then(msg => msg.pin())
		await modal.deferReply({ ephemeral: true })
		modal.followUp({
			content: 'Ticket opened: <#' + pchannel.id + '>',
		});
		db.set(`${pchannel.id}`, {
			type: 'partnership',
			title: `${title}`,
			status: `unclaimed`,
			channelid: `${pchannel.id}`,
			opened: `${Math.floor(Date.now()/1000)}`
		})
		db.set(`${pchannel.id}-member`, {
			userid: `${modal.member.user.id}`,
			displayname: `${modal.member.displayName}`,
			usertag: `${modal.member.user.tag}`,
			avatarurl: `${modal.member.displayAvatarURL({dynamic:true})}`,
		})
		db.add(`${modal.guild.id}.ticketcount`, 1)
	}
	if(modal.customId === 'issue-modal'){
		let icategory = modal.guild.channels.cache.find((c) => c.id === `${db.get(`${modal.guild.id}.issue-category`)}`&&c.type ==="GUILD_CATEGORY")
		if (!icategory) return modal.reply({content: 'Category not found', ephemeral: true})
		let ichannel = await modal.guild.channels.create( modal.member.displayName + '-issue-unclaimed', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [{
                id: modal.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: `${db.get(`${modal.guild.id}.supportrole`)}`,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: modal.member.id,
                allow: ['VIEW_CHANNEL']
            }]
        }).then(channel2=> channel2.setParent(icategory, { lockPermissions: false}));
        const title = modal.getTextInputValue('issue-title')
        const description = modal.getTextInputValue('issue-description')
		const reproduce = modal.getTextInputValue('issue-reproduce')
		const issueembed2 = new MessageEmbed()
			.setTitle("Ticket - " + title)
			.addFields(
				{
					name: 'Ticker information',
					value: `> **Ticket opener:** <@${modal.member.user.id}>\n> **Ticket opened:** <t:${Math.floor(Date.now()/1000)}:F>\n> **Issue description:** ${description}\n> **Issue reproduction:** ${reproduce}`
				})
			.setTimestamp()
		let ticketissue = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('tclose')
					.setLabel('Close')
					.setStyle('DANGER')
				)
			.addComponents(
				new MessageButton()
					.setCustomId('tclaim')
					.setLabel('Claim')
					.setStyle('SUCCESS')
				);
		ichannel.send({
			content: `<@&${db.get(`${modal.guild.id}.supportrole`)}>, <@${modal.member.user.id}>`,
			embeds: [issueembed2],
			components: [ticketissue]
		}).then(msg => msg.pin())
		await modal.deferReply({ ephemeral: true })
		modal.followUp({
			content: 'Ticket opened: <#' + ichannel.id + '>',
		});
		db.set(`${ichannel.id}`, {
			type: 'issue',
			title: `${title}`,
			status: `unclaimed`,
			channelid: `${ichannel.id}`,
			opened: `${Math.floor(Date.now()/1000)}`
		})
		db.set(`${ichannel.id}-member`, {
			userid: `${modal.member.user.id}`,
			displayname: `${modal.member.displayName}`,
			usertag: `${modal.member.user.tag}`,
			avatarurl: `${modal.member.displayAvatarURL({dynamic:true})}`,
		})
		db.add(`${modal.guild.id}.ticketcount`, 1)
	}
}