const {
  MessageEmbed,
  splitMessage,
  MessageAttachment
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
const {
  inspect
} = require(`util`);
module.exports = {
  name: `test`,
  category: `Owner`,
  aliases: [`test`],
  description: `Test`,
  usage: `test`,
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
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
    try {
      const { createCanvas, loadImage, Canvas } = require('canvas')
      const canvas = createCanvas(1428, 357);
      const ctx = canvas.getContext('2d');
      const background = await loadImage('pics/welcome-banner.png')
      const avatar = await loadImage(message.member.displayAvatarURL({format:'png'}));
      ctx.drawImage(background, 0, 0, 1428, 357);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 120, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 120, 0, 2 * Math.PI, false);
      ctx.clip();
      ctx.drawImage(avatar, 585, 50 - 30, 250, 250);
      ctx.restore();
      const attachment = new MessageAttachment(canvas.toBuffer(), "welcome.png");
      message.channel.send({content: 'here', files: [attachment]});
    } catch (e) {
      console.log(e)
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
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
