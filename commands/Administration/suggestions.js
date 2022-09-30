const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const { GetUser, GetGlobalUser } = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
const db = require(`quick.db`);
module.exports = {
  name: "suggestions", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Administration", //the command category for helpcmd [OPTIONAL]
  aliases: ["suggestions"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "suggestions", //the command usage for helpcmd [OPTIONAL]
  description: "Manage the suggestion system", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["ADMINISTRATOR"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
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
    const member = message.member
    try {
      if(!args[0]) return message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`Suggestions command help embed`)
          .setDescription(`Here are the sub commands you can use with this command:`)
          .addFields(
            {
              name: `${config.prefix}suggestions setstaffrole`,
              value: `> Sets the staff role which is able to manage the suggestions (accept/deny/send it for consideration)`
            },
            {
              name: `${config.prefix}suggestions setsuggestionchannel`,
              value: `> The channel where the suggestions go submitted by the community`
            },
            {
              name: `${config.prefix}suggestions setprivatesuggestionsubmitchannel`,
              value: `> The channel where people can use the 2nd (private/staff) suggestion command. The command only works in that channel.`
            },
            {
              name: `${config.prefix}suggestions setprivatesuggestionchannel`,
              value: `> The channel where the suggestions go submitted via the /suggest2 command.`
            },
            {
              name: `${config.prefix}suggestions setconsiderationchannel`,
              value: `> The channel where the athorities are able to make the final decision about a suggestion.`
            },
            {
              name: `${config.prefix}suggestions status`,
              value: `> Sends you a status message about the suggestion system settings.`
            })
          ],
          ephemeral: true})
      if(args[0] && args[0].toLowerCase() == "status"){
        return message.reply({
          content: `<@` + member.user.id + `>`,
          embeds: [new MessageEmbed()
            .setTitle(`Suggestion system status`)
            .addFields({
              name: `Suggestion channel:`, value: `<#${db.get(`${message.guild.id}-channel.id`)}>`
            },{
              name: `Private Suggestion channel:`, value: `<#${db.get(`${message.guild.id}-staffsuggestionschannel.id`)}>`
            },{
              name: `Private Suggestions submit channel:`, value: `<#${db.get(`${message.guild.id}-staffchannel.id`)}>`
            },{
              name: `Consideration channel:`, value: `<#${db.get(`${message.guild.id}-approvalchannel.id`)}>`
            },)
            .setColor("#ffffff")],
          ephemeral: true
        })
      } else if(args[0] && args[0].toLowerCase() == "setstaffrole"){
        try{
          db.set(`${message.guild.id}-staffs`, {id: args[1]})
          message.reply({content: `\`<@&${args[1]}>\` have been set to the staff role.`})
        } catch {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("There is no channel with that ID.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
      }else if(args[0] && args[0].toLowerCase() == "setsuggestionchannel"){
        try{
          let channel = message.guild.channels.cache.get(args[1])
          await channel.send({content: `${loadingemoji} Setting up the channel for suggestion system...`}).then(msg => {setTimeout(()=>{msg.edit(`${successemoji} Setup completed! Use \`/suggest\` in any of the bot command channels to submit your suggestion.`)}, 5000)})
          channel.setTopic(`Use \`/suggest\` in any of the bot command channels to submit your suggestion.`)
          db.set(`${message.guild.id}-channel`, {id: args[1]})
        } catch {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("There is no channel with that ID.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
      } else if(args[0] && args[0].toLowerCase() == "setprivatesuggestionsubmitchannel"){
        try{
          let channel = message.guild.channels.cache.get(args[1])
          await channel.send({content: `${loadingemoji} Setting up the channel for suggestion system...`}).then(msg => {setTimeout(()=>{msg.edit(`${successemoji} Setup completed! Use \`/suggest2\` in this channel to submit a private suggestion.`)}, 5000)})
          channel.setTopic(`Use \`/suggest2\` in this channel to submit a private suggestion.`)
          db.set(`${message.guild.id}-staffchannel`, {id: args[1]})
        } catch {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("There is no channel with that ID.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
      } else if(args[0] && args[0].toLowerCase() == "setprivatesuggestionchannel"){
        let channelt = db.get(`${message.guild.id}-staffchannel.id`)
        if(!channelt) {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("Please set up the submit channel first.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
        try{
          let channel = message.guild.channels.cache.get(args[1])
          await channel.send({content: `${loadingemoji} Setting up the channel for suggestion system...`}).then(msg => {setTimeout(()=>{msg.edit(`${successemoji} Setup completed! Use \`/suggest2\` in <#${db.get(`${message.guild.id}-staffchannel.id`)}> to submit your suggestion.`)}, 5000)})
          channel.setTopic(`Use \`/suggest2\` in <#${db.get(`${message.guild.id}-staffchannel.id`)}> to submit your suggestion.`)
          db.set(`${message.guild.id}-staffsuggestionschannel`, {id: args[1]})
        } catch {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("There is no channel with that ID.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
      } else if(args[0] && args[0].toLowerCase() == "setconsiderationchannel"){
        let channelt = db.get(`${message.guild.id}-staffchannel.id`)
        if(!channelt) {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("Please set up the submit channel first.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
        let channelt2 = db.get(`${message.guild.id}-channel.id`)
        if(!channelt2) {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("Please set up the submit channel first.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
        try{
          let channel = message.guild.channels.cache.get(args[1])
          await channel.send({content: `${loadingemoji} Setting up the channel for suggestion system...`}).then(msg => {setTimeout(()=>{msg.edit(`${successemoji} Setup completed! Use \`/suggestion consider\` in <#${db.get(`${message.guild.id}-staffchannel.id`)}> or <#${db.get(`${message.guild.id}-channel.id`)}> to send a final suggestion vote in here.`)}, 5000)})
          channel.setTopic(`Use \`/suggestion consider\` in <#${db.get(`${message.guild.id}-staffchannel.id`)}> or <#${db.get(`${message.guild.id}-channel.id`)}> to send a final suggestion vote in here.`)
          db.set(`${message.guild.id}-approvalchannel`, {id: args[1]})
        } catch {
          return message.reply({
            content: `<@` + member.user.id + `>`,
            embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("There is no channel with that ID.")
              .setColor(ee.wrongcolor)],
            ephemeral: true
          })
        }
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.errorcolor)
          .setTitle(`${erroremoji} Error | An internal error occurred`)
          .setDescription(`Please take a screenshot of this message and send it to <@${settings.ownerIDS}>`)
          .addField({
            name: `Log message:`,
            value: `\`\`\`fix\n${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\n\`\`\``
          })
        ],
        ephemeral: true
      });
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
