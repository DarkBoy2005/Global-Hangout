const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const { GetUser, GetGlobalUser } = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
const db = require('quick.db');
const { ReactionRole } = require("discordjs-reaction-role");
module.exports = {
  name: "reactionroles", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Administration", //the command category for helpcmd [OPTIONAL]
  aliases: ["rr", "rroles", "reactionr"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "reactionroles [channel id] [message id] [icon/icon id] [role id]", //the command usage for helpcmd [OPTIONAL]
  description: "Add a reaction role to a message", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["ADMINISTRATOR"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 3, // minimum args for the message, 0 == none [OPTIONAL]
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
      if(!args[0]) return message.reply({embeds: [new MessageEmbed()
        .setTitle(`Help message for reaction roles.`)
        .addFields({
          name: `Example:`,
          value: `> ${config.prefix}rr 909563023658725376 998968336576675860 😂 998544392220577936`,
          inline: false
        })], ephemeral: true})
      if(!args[1]) return message.reply({embeds: [new MessageEmbed()
        .setTitle(`Help message for reaction roles.`)
        .addFields({
          name: `Example:`,
          value: `> ${config.prefix}rr ${args[0]} 998968336576675860 😂 998544392220577936`,
          inline: false
        })], ephemeral: true})
      if(!args[2]) return message.reply({embeds: [new MessageEmbed()
        .setTitle(`Help message for reaction roles.`)
        .addFields({
          name: `Example:`,
          value: `> ${config.prefix}rr ${args[0]} ${args[1]} 😂 998544392220577936`,
          inline: false
        })], ephemeral: true})
      if(!args[3]) return message.reply({embeds: [new MessageEmbed()
        .setTitle(`Help message for reaction roles.`)
        .addFields({
          name: `Example:`,
          value: `> ${config.prefix}rr ${args[0]} ${args[1]} ${args[2]} 998544392220577936`,
          inline: false
        })], ephemeral: true})
      const server = await message.guild
      const role = await message.guild.roles.cache.get(args[3]) || null
      const channel = await client.channels.cache.get(`${args[0]}`) || null
      const msg = await channel.messages.fetch(args[1]) || null
      const emoji = await client.emojis.cache.get(args[2]) || null
      if(role){if(channel){if(msg){
            if(isNaN(args[2])){
              db.set(`${server.id}-${args[1]}-${args[2]}`, {roleId: args[3]})
              msg.react(emoji)
              return message.reply({
                embeds: [new MessageEmbed()
                .setTitle(`${checkemoji} | Success`)
                .setDescription("Reaction role created successfully.")
                .setColor("#00ff33")],
                ephemeral: true
              })
            }
            if(emoji){
              db.set(`${server.id}-${args[1]}-${args[2]}`, {roleId: args[3]})
              msg.react(emoji)
              return message.reply({
                embeds: [new MessageEmbed()
                .setTitle(`${checkemoji} | Success`)
                .setDescription("Reaction role created successfully.")
                .setColor("#00ff33")],
                ephemeral: true
              })
            } else {
              return interaction.reply({
                embeds: [new MessageEmbed()
                .setTitle(`${error2emoji} | Usage error`)
                .setDescription("There is no emoji with this ID.")
                .setColor(ee.wrongcolor)]
              })
            }
          } else {
            return interaction.reply({
              embeds: [new MessageEmbed()
              .setTitle(`${error2emoji} | Usage error`)
              .setDescription("There is no message with this ID.")
              .setColor(ee.wrongcolor)]
            })
          }
        } else {
          return interaction.reply({
            embeds: [new MessageEmbed()
            .setTitle(`${error2emoji} | Usage error`)
            .setDescription("There is no channel with this ID.")
            .setColor(ee.wrongcolor)]
          })
        }
      } else {
        return interaction.reply({
          embeds: [new MessageEmbed()
          .setTitle(`${error2emoji} | Usage error`)
          .setDescription("There is no role with this ID.")
          .setColor(ee.wrongcolor)]
        })
      }
      
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
        ]
        , ephemeral: true
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
