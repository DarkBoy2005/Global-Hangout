const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require('quick.db');
module.exports = {
  name: "deny",
  description: "Decline a suggestion",
  cooldown: 1,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [


  	{"String":
  		{
  			name: "id",
  			description: "The message id of the suggestion",
  			required: true,
  		}
  	},
  	{"String":
  		{
  			name: "feedback",
  			description: "The feedback for this suggestion",
  			required: true,
  		}
  	},

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
  	const msgemoji = client.emojis.cache.get("994540437182369792")
  	const erroremoji = client.emojis.cache.get("993183132448739430");
  	const error2emoji = client.emojis.cache.get("993183130913603605");
  	const yesemoji = client.emojis.cache.get("993182821965369374");
  	const noemoji = client.emojis.cache.get("993182968967335958");
  	const successemoji = client.emojis.cache.get("993183917039431740")
  	const checkemoji = client.emojis.cache.get("993183915693047849")
  	const maintenanceemoji = client.emojis.cache.get("993184898007445634")
  	const offlineemoji = client.emojis.cache.get("993184896686231552")
  	const onlineemoji = client.emojis.cache.get("993184895151132694")
  	const crossemoji = client.emojis.cache.get("994576023008063640")
  	let channel2 = db.get(`${interaction.guild.id}-channel.id`) || null
  	let staffchannel = db.get(`${interaction.guild.id}-staffchannel.id`) || null
  	let approvalchannel = db.get(`${interaction.guild.id}-approvalchannel.id`) || null
  	let staffsuggestions = db.get(`${interaction.guild.id}-staffsuggestionschannel.id`) || null
    try{
    	if(!channel2 || !staffchannel|| !approvalchannel|| !staffsuggestions) {
		   	return interaction.reply({
		   		content: '<@' + member.user.id + '>',
			    embeds: [new MessageEmbed()
		   		.setTitle(`${error2emoji} | Usage error`)
		   		.setDescription(`The suggestion system isn't ready. Run ${config.prefix}suggestions to check what you need to set up.`)
		   		.setColor(ee.wrongcolor)],
			    ephemeral: true
		   	})
    	}
    	if(interaction.channel.id === staffsuggestions, channel2) {
    		const id = interaction.options.getString("id")
	    	const member = interaction.member
	    	const feedback = interaction.options.getString("feedback")
	    	if (feedback.length > 1024) {
	    		return interaction.reply({
	    			embeds: [new MessageEmbed()
		   			.setTitle(`${error2emoji} | Usage error`)
		   			.setDescription("The feedback can't be more than 1024 characters.")
		   			.setColor(ee.wrongcolor)]
	    		})
	    	}
	    	let msgid2 = db.fetch(`${interaction.guild.id}.${id}`)
	    	if(msgid2 === null) {
		   		interaction.reply({
		   			content: '<@' + member.user.id + '>',
			      embeds: [new MessageEmbed()
		   			.setTitle(`${error2emoji} | Usage error`)
		   			.setDescription("There is no suggestion with this ID.")
		   			.setColor(ee.wrongcolor)],
			      ephemeral: true
		   		})
	    	} else {
	    		let suggestion = db.get(`${interaction.guild.id}.${id}.suggestion`);
	    		let avatara = db.get(`${interaction.guild.id}.${id}.avatar`);
	    		let taga = db.get(`${interaction.guild.id}.${id}.tag`);
	    		let uid = db.get(`${interaction.guild.id}.${id}.uid`)
			  		interaction.reply({
			  			embeds: [new MessageEmbed()
			    		.setTitle(`${successemoji} | Success`)
			    		.setDescription("Action performed successfully.")
			    		.setColor("#00ff33")],
			  			ephemeral: true
			  		})
			    	let msg2 = db.get(`${interaction.guild.id}.${id}.message`)
			    	interaction.channel.messages.fetch(`${msg2}`).then(msg3 => {msg3.reply({
			    		content: `<@${uid}>`,
			    		embeds: [new MessageEmbed()
					   		.setTitle("Suggestion Declined")
					   		.setColor("#ff0000")
					   		.setAuthor({
					   			name: `${taga}'s suggestion got declined`,
					        iconURL: `${avatara}`,
					        url: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${id}`
					   		})
					   		.setThumbnail(member.displayAvatarURL({dynamic:true}))
					   		.setDescription(`**Feedback:** ${feedback}`)
								.setFooter({
									text: `This suggestion got declined by <@${member.user.id}>`,
									iconURL: interaction.guild.iconURL({dynamic: true})
								})
					   		.setTimestamp()]
			    	})})
			    	interaction.channel.messages.fetch(`${msg2}`).then(msg4 => {
				   	msg4.edit({
					   	content: `<@${uid}>`,
					   	embeds: [new MessageEmbed()
					   	.setTitle("Suggestion")
						  .setColor("#ff0000")
						 	.setAuthor({
						 		name: taga,
						    iconURL: avatara,
						 	})
						 	.setThumbnail(avatara)
						 	.setDescription(suggestion)
						 	.addFields(
						 		{
									name: 'Submitter:', value: `<@${uid}>`, inline: true
								},
								{
									name: 'Status:', value: `Declined ${crossemoji}`, inline: true
								},
								{
									name: 'Feedback:', value: `${feedback}`, inline: false
								},
								{
									name: 'Feedback submitter:', value: `<@${member.user.id}>`, inline: false
								}
							)
					   	.setFooter({
					   		text: "The final decision have been made on this suggestion.",
					   		iconURL: interaction.guild.iconURL({dynamic: true})
					   	})
					   	.setTimestamp()]
					   	})
				   	})
				   	try {
				   		let m = interaction.guild.members.cache.get(uid)
				   		m.send({embeds: [new MessageEmbed()
				   			.setTitle(`${msgemoji} | New notification`)
				   			.setDescription(`Your [suggestion](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${id}) was declined in **${interaction.guild.name}**.`)
				   			.addFields(
				   				{
										name: 'Feedback:', value: `${feedback}`, inline: false
									},
									{
										name: 'Feedback submitter:', value: `<@${member.user.id}>`, inline: false
									})
				   			.setTimestamp()
				   			]
				   		})
				   	} catch (e) {
				   		return
				   	}
	    		}
    		} else {
		    		interaction.reply({
		    			content: '<@' + member.user.id + '>',
			        embeds: [new MessageEmbed()
		    			.setTitle(`${error2emoji} | Usage error`)
		    			.setDescription("You can't use this command in this channel.")
		    			.setColor(ee.wrongcolor)],
			        ephemeral: true
		    		})
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
