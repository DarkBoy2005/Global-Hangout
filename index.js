const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const colors = require("colors");
const db = require('quick.db');
const client = new Discord.Client({
	//fetchAllMembers: false,
	//restTimeOffset: 0,
	//restWsBridgetimeout: 100,
	shards: "auto",
	allowedMentions: {
		parse: ['users', 'roles', 'everyone'],
		repliedUser: false,
	},
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'INVITE'],
	intents: [ 
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_BANS,
		Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
		Discord.Intents.FLAGS.GUILD_WEBHOOKS,
		Discord.Intents.FLAGS.GUILD_INVITES,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_PRESENCES,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
	],
	presence: {
		activity: {
		name: `Music`, 
		type: "LISTENING", 
		},
		status: "online"
	}
});
const discordModals = require('discord-modals')
discordModals(client);
//Define some Global Collections
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
//Require the Handlers					Add the antiCrash file too, if its enabled
["events", "commands", "slashCommands", settings.antiCrash ? "antiCrash" : null]
	.filter(Boolean)
	.forEach(h => {
		require(`./handlers/${h}`)(client);
	})
//Start the Bot
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#00ff1a',
        embedColorEnd: '#ff0000',
        reaction: '🎉'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

// Initialize the invite cache
const invites = new Discord.Collection();

// A pretty useful method to create a delay without blocking the whole script.
const { MessageEmbed, MessageAttachment } = require("discord.js");
const wait = require("timers/promises").setTimeout;
client.on("ready", async () => {
	// "ready" isn't really ready. We need to wait a spell.
	await wait(1000);

	// Loop over all the guilds
	client.guilds.cache.forEach(async (guild) => {
	// Fetch all Guild Invites
	const firstInvites = await guild.invites.fetch();
	// Set the key as Guild ID, and create a map which has the invite code, and the number of uses
	invites.set(guild.id, new Discord.Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
	});
});
client.on("inviteDelete", (invite) => {
	// Delete the Invite from Cache
	invites.get(invite.guild.id).delete(invite.code);
});

client.on("inviteCreate", (invite) => {
	// Update cache on new invites
	invites.get(invite.guild.id).set(invite.code, invite.uses);
});
client.on("guildCreate", (guild) => {
	// We've been added to a new Guild. Let's fetch all the invites, and save it to our cache
	guild.invites.fetch().then(guildInvites => {
	// This is the same as the ready event
	invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
	})
});

client.on("guildDelete", (guild) => {
	// We've been removed from a Guild. Let's delete all their invites
	invites.delete(guild.id);
});

client.on("guildMemberAdd", async (member) => {
	if(member.user.bot) return
	// To compare, we need to load the current invite list.
	const newInvites = await member.guild.invites.fetch()
	// This is the *existing* invites for the guild.
	const oldInvites = invites.get(member.guild.id);
	// Look through the invites, find the one for which the uses went up.
	const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
	// This is just to simplify the message being sent below (inviter doesn't have a tag property)
	const inviter = await client.users.fetch(invite.inviter.id) || null;
	// Get the log channel (change to your liking)
	const logChannel = member.guild.channels.cache.find(channel => channel.id === "998914287819030578");
	// A real basic message with the information we need. 
	const erroremoji = client.emojis.cache.get("993183132448739430")
	const error2emoji = client.emojis.cache.get("993183130913603605")
	const yesemoji = client.emojis.cache.get("993182821965369374")
	const noemoji = client.emojis.cache.get("993182968967335958")
	const successemoji = client.emojis.cache.get("993183917039431740")
	const checkemoji = client.emojis.cache.get("993183915693047849")
	const maintenanceemoji = client.emojis.cache.get("993184898007445634")
	const offlineemoji = client.emojis.cache.get("993184896686231552")
	const onlineemoji = client.emojis.cache.get("993184895151132694")
	const welcome1emoji = client.emojis.cache.get("998693068557533285")
	const welcome2emoji = client.emojis.cache.get("998693066644934767")
    const suseyes = client.emojis.cache.get("998917176578818119")
    const { createCanvas, loadImage, Canvas } = require('canvas')
    const canvas = createCanvas(1428, 357);
    const ctx = canvas.getContext('2d');
    const background = await loadImage('pics/welcome-banner.png')
    const avatar = await loadImage(member.displayAvatarURL({format:'png'}));
    ctx.drawImage(background, 0, 0, 1428, 357);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 120, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 30, 120, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(avatar, 589, 55 - 30, 250, 250);
    ctx.restore();
    const attachment = new MessageAttachment(canvas.toBuffer(), "welcome.png");
	inviter
	? logChannel.send({
        files: [attachment],
		embeds: [new MessageEmbed()
			.setTitle(`${welcome1emoji}${welcome2emoji} | Welcome to the server *${member.user.username}*!`)
			.setTimestamp()
			.setColor(`#00ff26`)
			.setDescription(`Welcome to the server, enjoy your stay <@${member.user.id}>! You are now the **\`${member.guild.members.cache.filter(member => !member.user.bot).size}.\`** member on this server.`)
            .setImage("attachment://welcome.png")
			.addFields(
				{
					name: `Invite tracker:`,
					value: `You used the invite \`${invite.code}\` from \`${inviter.tag}\`. It was previously used **${invite.uses}** times.`
				}
			)],
		})
	: logChannel.send({
        files: [attachment],
        embeds: [new MessageEmbed()
            .setTitle(`${welcome1emoji}${welcome2emoji} | Welcome to the server *${member.user.username}*!`)
            .setTimestamp()
            .setColor(`#00ff26`)
            .setDescription(`Welcome to the server, enjoy your stay <@${member.user.id}>! You are now the **\`${member.guild.members.cache.filter(member => !member.user.bot).size}.\`** member on this server.`)
            .setImage("attachment://welcome.png")
            .addFields(
                {
                    name: `Invite tracker:`,
                    value: `I don't know who invited you **${member.user.username}** so I'll keep an eye on you ${suseyes}.`
                }
            )],
        })
});

client.on("guildMemberRemove", async (member) => {
	if(member.user.bot) return
	const logChannel = member.guild.channels.cache.find(channel => channel.id === "998914287819030578");
    logChannel.send({
        embeds: [new MessageEmbed()
            .setTitle(`Goodbye *${member.user.username}*!`)
            .setTimestamp()
            .setColor(`#fc0303`)
            .setDescription(`Goodbye <@${member.user.id}>! We hope you enyojed your stay.\nNow we only have **\`${member.guild.members.cache.filter(member => !member.user.bot).size}\`** members on this server.`)],
        })})
const { StarboardClient } = require("discord-starboard");
const object = {
		starboardChannel: "909858938734931968", //required
		starCount: "1", // required
		emoji: "⭐", // optional defualt ⭐
  };
  	const starboard = new StarboardClient(client, {
		debug: false, //optional default true
  });
  	client.on("messageReactionAdd", (reaction, user) => {
		starboard.listnerAdd(reaction, object);
  });
  	client.on("messageReactionRemove", (reaction, user) => {
		starboard.listnerRemove(reaction, object);
	});

client.login(config.token)