const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const { GetUser, GetGlobalUser } = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
const { MessageActionRow, MessageButton } = require("discord.js")
module.exports = {
  name: "ticketbuttons", 
  category: "Administration", 
  aliases: ["re"], 
  cooldown: 1, 
  usage: "tickets", 
  description: "Sends the tickets embed", 
  memberpermissions: [], 
  requiredroles: [], 
  alloweduserids: [], 
  minargs: 0, 
  maxargs: 0, 
  minplusargs: 0, 
  maxplusargs: 0, 
  argsmissing_message: "", 
  argstoomany_message: "", 
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
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
    try {
      let ticketbuttons = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('treport')
            .setLabel('😠 | Report')
            .setStyle('DANGER')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('tgeneral')
            .setLabel('❓ | General')
            .setStyle('SUCCESS')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('tappeal')
            .setLabel('🔓 | Appeal')
            .setStyle('PRIMARY')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('tissue')
            .setLabel('⚠️ | Issue Report')
            .setStyle('DANGER')
        )
        .addComponents(
          new MessageButton()
            .setCustomId('tpartner')
            .setLabel('🤝 | Partnership')
            .setStyle('SECONDARY')
        )
      let tickets = new MessageEmbed()
        .setColor('#00a3ff')
        .setTitle("Information")
        .setAuthor({
          name: 'Global Hangout Tickets',
          iconURL: message.guild.iconURL({dynamic: true})
        })
        .addFields(
          {
            name: '😠 | Report Ticket',
            value: '> Used to report server members or staff members. Evidence is **REQUIRED**.',
            inline: true
          },
          {
            name: '❓ | General Ticket',
            value: '> Used for general questions.',
            inline: true
          },
          {
            name: '🔓 | Appeal Ticket',
            value: '> Used to appeal server bans, warnings and mutes.',
            inline: true
          },
          {
            name: '⚠️ | Issue Report Ticket',
            value: '> Used to report server issues or bugs.',
            inline: true
          },
          {
            name: '🤝 | Partnership Ticket',
            value: '> Used to request partnerships.',
            inline: true
          },)
        .setDescription(`> Welcome to the ticket system. Here you can open a ticket in one of these categories listed below. Before you do, please keep in mind that trolling or abusing these tickets will result in a warning or worst case scenario, we remove your permission to open tickets ever again.\n> \n> If you are about to open a report ticket against a server member or a staff member **make sure to have photo/video evidence or at least 2 witnesses.** If you fail to meet these requirements your ticket will be closed immediately.\n> \n> For general questions or general support you **must provite the reason for opening your ticket,** or it will be closed by the support team without any warning.`)
      message.channel.send({
        embeds: [tickets],
        components: [ticketbuttons]
      })

    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
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
