const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require('quick.db');
module.exports = {
  name: "remove",
  description: "Remove server from whitelist",
  cooldown: 0,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: ["329250127703441410"],
  options: [
    {"String":
      {
        name: "id",
        description: "Server ID",
        required: true,
      }
    },
  ],
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
    try{
    	const id = interaction.options.getString("id")
      if(db.get(`${id}.set`) === true){
        db.set(`${id}`, {set: false})
        return interaction.reply({content: `Server with ID \`${id}\` have been removed to the whitelist`})
      } else {
        return interaction.reply({content: `This server is not in the whitelistist.`})
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
