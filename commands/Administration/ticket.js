const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const { GetUser, GetGlobalUser } = require("../../handlers/functions")
const settings = require("../../botconfig/settings.json");
const { MessageActionRow, MessageButton } = require("discord.js");
const db = require('quick.db');
let types = ["report", "general", "partner", "issue", "appeal"]
module.exports = {
	name: "ticket", 
	category: "Administration", 
	aliases: ["re"], 
	cooldown: 1, 
	usage: "tickets", 
	description: "Ticket setup", 
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
      if(!args[0]) return message.reply({content:'Please provide what do you want to do. `setcategory, setlog, setsupport`', ephemeral: true})
			if(args[0] && args[0].toLowerCase() == "setcategory") {
				if(types.includes(args[1] && args[1].toLowerCase())) {
					if(!message.guild.channels.cache.find((c) => c.id === `${args[2]}`&&c.type ==="GUILD_CATEGORY")) return message.reply({content: 'You must provide a category id', ephemeral: true})
					db.set(`${message.guild.id}.${args[1]}-category`, `${args[2]}`)
					message.reply({
						content: `You successfully set the ${args[1]} category id.`,
						ephemeral: true
					})
				} else {
          message.reply({content: 'This is an unsupported ticket type. Types: `' + types + '`', ephemeral: true})
        }
			} else if(args[0] && args[0].toLowerCase() == "setlog") {
        if(!message.guild.channels.cache.find((c) => c.id === `${args[1]}`&&c.type ==="GUILD_TEXT")) return message.reply({content: 'You must provide a channel id', ephemeral: true})
        db.set(`${message.guild.id}.ticketlog`, `${args[1]}`)
        message.reply({
            content: `You successfully set the log channel id.`,
            ephemeral: true
          })
      } else if(args[0] && args[0].toLowerCase() == "setsupport") {
        db.set(`${message.guild.id}.supportrole`, `${args[1]}`)
        message.reply({
            content: `You successfully set the support role ud.`,
            ephemeral: true
          })
      } else {
        message.reply({content:'Please provide what do you want to do. `setcategory, setlog, setsupport`', ephemeral: true})
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
        ],
        ephemeral: true
      });
		}
	}
}
