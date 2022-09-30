const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const ms = require('ms');
const db = require('quick.db');
module.exports = {
	name: "delete",
	description: "Deletes a giveaway",
	cooldown: 1,
	memberpermissions: [],
	requiredroles: [],
	alloweduserids: [],
	options: [


		{"String":
			{
				name: "messageId",
				description: "The message id of the giveaway",
				required: true,
			}
		}

		//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
	],
	run: async (client, interaction) => {
		try{
			const messageId = interaction.options.getString('messageId');
				client.giveawaysManager.delete(messageId).then(() => {
					const success = new MessageEmbed()
						.setTitle(`${config.succem} | Success`)
						.setDescription('Giveaway was successfully deleted.')
						.setColor("#00ff33")
					interaction.reply({
						embeds: [success],
						ephemeral: true
					});
			})
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
