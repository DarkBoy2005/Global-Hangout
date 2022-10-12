//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const db = require('quick.db');
const wait = require('node:timers/promises').setTimeout;
const { fetchTranscript } = require("discord-ghost-transcript");
const discordTranscripts = require('discord-html-transcripts');
const guilds = ["804930743255957514","862430954718494720"]
const reportmodal = new Modal()
  .setCustomId('report-modal')
  .setTitle('Report ticket submission!')
  .addComponents(
    new TextInputComponent()
      .setCustomId('report-title')
      .setLabel('Title of the report')
      .setStyle('SHORT')
      .setMinLength(0)
      .setMaxLength(20)
      .setPlaceholder('Short title of the report')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('report-user')
      .setLabel('User you are reporting')
      .setStyle('SHORT')
      .setPlaceholder('Discord username of the reported user')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('report-details')
      .setLabel('Report description')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(500)
      .setPlaceholder('A short description and details of the report')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('report-witnesses')
      .setLabel('The name of the witnesses separated by commas')
      .setStyle('LONG')
      .setPlaceholder('Discord username of the reported user')
      .setRequired(false)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('report-evidence')
      .setLabel('Link to the evidence(s)')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(2000)
      .setPlaceholder('Discord username of the reported user')
      .setRequired(false)
  );
const generalmodal = new Modal()
  .setCustomId('general-modal')
  .setTitle('General ticket submission!')
  .addComponents(
    new TextInputComponent()
      .setCustomId('general-title')
      .setLabel('Title of the ticket')
      .setStyle('SHORT')
      .setMinLength(0)
      .setMaxLength(20)
      .setPlaceholder('Short title of the ticket')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('general-details')
      .setLabel('Description')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(500)
      .setPlaceholder('A short description of the ticket opening reason.')
      .setRequired(true)
  )
const appealmodal = new Modal()
  .setCustomId('appeal-modal')
  .setTitle('Appeal ticket submission!')
  .addComponents(
    new TextInputComponent()
      .setCustomId('appeal-title')
      .setLabel('Title of the appeal')
      .setStyle('SHORT')
      .setMinLength(0)
      .setMaxLength(20)
      .setPlaceholder('Short title of the appeal')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('appeal-punisher')
      .setLabel('User that punished you')
      .setStyle('SHORT')
      .setPlaceholder('Discord username of the user who punished you')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('appeal-reason')
      .setLabel('Reason of the punishment')
      .setStyle('SHORT')
      .setPlaceholder('The reason of the punishment issues by the mentioned user')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('appeal-details')
      .setLabel('Punishment details')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(500)
      .setPlaceholder('When, where, who saw it, etc...')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('appeal-sentence')
      .setLabel('Why should we remove your punishment?')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(500)
      .setPlaceholder('State why we should remove your punishment')
      .setRequired(true)
  )
const partnermodal = new Modal()
  .setCustomId('partner-modal')
  .setTitle('Partnership ticket submission!')
  .addComponents(
    new TextInputComponent()
      .setCustomId('partner-name')
      .setLabel('Server name')
      .setStyle('SHORT')
      .setMinLength(0)
      .setMaxLength(20)
      .setPlaceholder('Short name of the server (Like: Global Hangout = GH)')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('partner-fullname')
      .setLabel('Server name')
      .setStyle('SHORT')
      .setPlaceholder('The full name of the server')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('partner-link')
      .setLabel('Invite link')
      .setStyle('SHORT')
      .setPlaceholder('Invite link to the server')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('partner-ad')
      .setLabel('Partnership ad')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(4000)
      .setPlaceholder('The partnership ad of the server.')
      .setRequired(true)
  )
const issuemodal = new Modal()
  .setCustomId('issue-modal')
  .setTitle('Issue ticket submission!')
  .addComponents(
    new TextInputComponent()
      .setCustomId('issue-title')
      .setLabel('Title of the issue')
      .setStyle('SHORT')
      .setMinLength(0)
      .setMaxLength(20)
      .setPlaceholder('A short title of the issue')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('issue-description')
      .setLabel('Description')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(500)
      .setPlaceholder('The description of the issue')
      .setRequired(true)
  )
  .addComponents(
    new TextInputComponent()
      .setCustomId('issue-reproduce')
      .setLabel('Issue reproduction')
      .setStyle('LONG')
      .setMinLength(0)
      .setMaxLength(500)
      .setPlaceholder('How to reproduce this issue?')
      .setRequired(true)
  )
module.exports = async (client, interaction) => {
  const erroremoji = client.emojis.cache.get("993183132448739430");
  const error2emoji = client.emojis.cache.get("993183130913603605");
  const yesemoji = client.emojis.cache.get("993182821965369374");
  const noemoji = client.emojis.cache.get("993182968967335958");
  const successemoji = client.emojis.cache.get("993183917039431740")
  const checkemoji = client.emojis.cache.get("993183915693047849")
  const maintenanceemoji = client.emojis.cache.get("993184898007445634")
  const offlineemoji = client.emojis.cache.get("993184896686231552")
  const onlineemoji = client.emojis.cache.get("993184895151132694")
  const loadingemoji = client.emojis.cache.get("993229855443398656")
	const CategoryName = interaction.commandName;
	let command = false;
	try{
    	    if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
      		command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
    	    }
  	}catch{
    	    if (client.slashCommands.has("normal" + CategoryName)) {
      		command = client.slashCommands.get("normal" + CategoryName);
   	    }
	}
	if(command) {
    if(interaction.commandName === "giveaway") {
      console.log("debug 1")
      if(!interaction.member.roles.cache.has('909559133034917910')) {
        console.log("debug 2")
        return interaction.reply({content: "You can't use this command!", ephemeral: true})
      }
    }
    console.log(`${interaction} was used in ${interaction.guild.name}`)
		if (onCoolDown(interaction, command)) {
			  return interaction.reply({ephemeral: true,
				embeds: [new Discord.MessageEmbed()
				  .setColor(ee.wrongcolor)
				  .setTitle(replacemsg(settings.messages.cooldown, {
					command: command,
					timeLeft: onCoolDown(interaction, command)
				  }))]
			  });
			}
		//if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
              .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
                command: command
              }))]
          });
        }
        //if Command has specific needed roles return error
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
              command: command
			}))]
          })
        }
        //if Command has specific users return error
        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
              command: command
            }))]
          });
        }
		//execute the Command
		command.run(client, interaction, interaction.member, interaction.guild)
	}
  if(!interaction.isButton()) return;
  if (interaction.customId === "treport") {
    showModal(reportmodal, {
      client: client,
      interaction: interaction
    })
  }
  if (interaction.customId === "tissue") {
    showModal(issuemodal, {
      client: client,
      interaction: interaction
    })
  }
  if (interaction.customId === "tgeneral") {
    showModal(generalmodal, {
      client: client,
      interaction: interaction
    })
  }
  if (interaction.customId === "tappeal") {
    showModal(appealmodal, {
      client: client,
      interaction: interaction
    })
  }
  if (interaction.customId === "tpartner") {
    showModal(partnermodal, {
      client: client,
      interaction: interaction
    })
  }
  if (interaction.customId === "tclose") {
    if(interaction.member.roles.cache.some(role => role.id === `${db.get(`${interaction.guild.id}.supportrole`)}`)) {
      let confirm = new MessageEmbed()
        .setTitle('❓ | Confirmation')
        .setDescription('You sure you want to close this ticket?')
        .setColor("#ff6200")
      let confirmation = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('tcancel')
            .setLabel('Cancel')
            .setStyle('DANGER')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('tconfirm')
            .setLabel('Confirm')
            .setStyle('SUCCESS')
        )
      interaction.reply({
        embeds: [confirm],
        components: [confirmation],
      })
    } else {
      let error66 = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("<a:no:964126733341196318> | Error")
        .setDescription("You can't use this button.")
      interaction.reply({
        embeds: [error66],
        ephemeral: true,
      })
    }
  }
  if (interaction.customId === "tclaim") {
    const handler = db.get(`${interaction.channel.id}-handler`)
    if(!handler) {
      if(interaction.member.roles.cache.some(role => role.id === `${db.get(`${interaction.guild.id}.supportrole`)}`)) {
        let type = db.get(`${interaction.channel.id}.type`)
        let opener = db.get(`${interaction.channel.id}-member.displayname`)
        db.set(`${interaction.channel.id}.status`, "claimed")
        interaction.channel.edit({ name: `${opener}-${type}-claimed-${interaction.member.displayName}` })
        db.set(`${interaction.channel.id}-handler`, {
          userid: `${interaction.member.user.id}`,
          displayname: `${interaction.member.displayName}`,
          usertag: `${interaction.member.user.tag}`,
          avatarurl: `${interaction.member.displayAvatarURL({dynamic:true})}`,
        })
        let ttclaim = new MessageEmbed()
          .setTitle(`${checkemoji} | Ticket Claimed`)
          .setDescription(`The ticket was claimed by <@${interaction.member.id}>.`)
          .setColor("#2bf207")
        interaction.reply({
          embeds: [ttclaim]
        })
      } else {
        let tterror2 = new MessageEmbed()
          .setTitle(`${error2emoji} | Ticket Error`)
          .setDescription(`You can't claim this ticket.`)
          .setColor("#ff0000")
        interaction.reply({
          embeds: [tterror2],
          ephemeral: true
        })
      }
    } else {
      let tterror3 = new MessageEmbed()
        .setTitle(`${error2emoji} | Ticket Error`)
        .setDescription(`This ticket is already claimed.`)
        .setColor("#ff0000")
      interaction.reply({
        embeds: [tterror3],
        ephemeral: true
      })
    }
  }
  if (interaction.customId === "tcancel") {
    let ttcancel = new MessageEmbed()
      .setTitle(`${checkemoji} | Cancelled`)
      .setDescription('Ticket closing action cancelled')
      .setColor("#2bf207")
    const messages = await interaction.channel.messages.fetch({ limit: 1 });
    interaction.channel.bulkDelete(messages, true);
    interaction.channel.send({
      embeds: [ttcancel],
    })
  }
  if (interaction.customId === "tconfirm") {
    let ttconfirm = new MessageEmbed()
      .setTitle(`${checkemoji} | Confirmed`)
      .setDescription('Ticket will be deleted soon.')
      .setColor("#2bf207")
    let tclosedembed = new MessageEmbed()
      .setTitle(`Ticket ${db.get(`${interaction.guild.id}.ticketcount`)} - ${db.get(`${interaction.channel.id}.title`)}`)
      .setAuthor({
        name:`${db.get(`${interaction.channel.id}-member.usertag`)}`,
        iconURL: `${db.get(`${interaction.channel.id}-member.avatarurl`)}`
      })
      .addFields(
        {
          name: `Ticket owner`,
          value: `<@${db.get(`${interaction.channel.id}-member.userid`)}>`,
          inline: true,
        },
        {
          name: `Opened at`,
          value: `<t:${db.get(`${interaction.channel.id}.opened`)}:F>`,
          inline: true,
        },
      )
    if(!db.get(`${interaction.channel.id}-handler.userid`)) {
      tclosedembed.addFields(
        {
          name: `Ticket handler`,
          value: `No ticket handler`,
          inline: true,
        },
      )
    } else {
      tclosedembed.addFields(
        {
          name: `Ticket handler`,
          value: `<@${db.get(`${interaction.channel.id}-handler.userid`)}>`,
          inline: true,
        },)
    }
    const attachment = await discordTranscripts.createTranscript(interaction.channel);
    client.channels.cache.get(`${db.get(`${interaction.guild.id}.ticketlog`)}`).send({
      embeds: [tclosedembed],
      files: [attachment]
    });
    interaction.channel.send({
      embeds: [ttconfirm],
    })
    await wait(2000);
    interaction.channel.delete()
  }
}
