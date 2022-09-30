const config = require(`../../botconfig/config.json`);
const { MessageEmbed } = require("discord.js");
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const db = require('quick.db');
module.exports = async (client, invite) => {
	const invites = await invite.guild.invites.fetch();

	const codeUses = new Map();
	invites.each(inv => codeUses.set(inv.code, inv.uses));

	guildInvites.set(invite.guild.id, codeUses);
}