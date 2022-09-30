/**
 * @INFO
 * Loading all needed File Information Parameters
 */
 const config = require("../../botconfig/config.json"); //loading config file with token and prefix
 const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
 const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
 const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
 const db = require('quick.db');
 //here the event starts
 module.exports = async (client, reaction, user) => {
   try {
      if (user.bot) return;
      const loadingemoji = client.emojis.cache.get("993229855443398656")
      const message = reaction.message
      const emoji = reaction.emoji
      const server = client.guilds.cache.get(reaction.message.guild.id)
      const roleid = db.get(`${server.id}-${message.id}-${emoji.id}.roleId`)
      if(roleid) {
         let role = server.roles.cache.find(role => role.id === roleid)
         let member = server.members.cache.get(user.id)
         member.roles.remove(roleid)
         reaction.message.channel.send({content: `${loadingemoji} \`Removing ${role.name} role...\` | The role will be removed from you shortly <@${user.id}>...`}).then(msg => {
            setTimeout(() => {
               msg.delete()
            }, 3000)
         })
      }
   } catch (e) {
      console.log(e)
   }
}