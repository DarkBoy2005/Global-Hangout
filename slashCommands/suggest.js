const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const db = require('quick.db');
module.exports = {
  name: "suggest",
  description: "Submit a suggestion, used by everyone",
  cooldown: 0,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  options: [


  	{"String":
  		{
  			name: "suggestion",
  			description: "Your suggestion",
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
  	const suggestion = interaction.options.getString("suggestion")
		const member = interaction.member
  	const erroremoji = client.emojis.cache.get("993183132448739430");
  	const error2emoji = client.emojis.cache.get("993183130913603605");
  	const yesemoji = client.emojis.cache.get("993182821965369374");
  	const noemoji = client.emojis.cache.get("993182968967335958");
  	const successemoji = client.emojis.cache.get("993183917039431740")
  	const checkemoji = client.emojis.cache.get("993183915693047849")
  	const maintenanceemoji = client.emojis.cache.get("993184898007445634")
  	const offlineemoji = client.emojis.cache.get("993184896686231552")
  	const onlineemoji = client.emojis.cache.get("993184895151132694")
  	let channel2 = db.get(`${interaction.guild.id}-channel.id`) || null
  	let staffchannel = db.get(`${interaction.guild.id}-staffchannel.id`) || null
  	let approvalchannel = db.get(`${interaction.guild.id}-approvalchannel.id`) || null
  	let staffsuggestions = db.get(`${interaction.guild.id}-staffsuggestionschannel.id`) || null
    try{
    	try {
    		if(!channel2 || !staffchannel || !approvalchannel || !staffsuggestions) {
		   		return interaction.reply({
		   		content: '<@' + member.user.id + '>',
			    embeds: [new MessageEmbed()
		   			.setTitle(`${error2emoji} | Error`)
		   			.setDescription(`The suggestion system isn't ready. Run \`${config.prefix}suggestions\``)
		   			.setColor(ee.wrongcolor)],
			    ephemeral: true
		   	}) 
    		}
    	} catch {
    		return interaction.reply({
		   		content: '<@' + member.user.id + '>',
			    embeds: [new MessageEmbed()
		   			.setTitle(`${error2emoji} | Error`)
		   			.setDescription(`The suggestion system isn't ready. Run \`${config.prefix}suggestions\``)
		   			.setColor(ee.wrongcolor)],
			    ephemeral: true
		   	})
    	}
    	if (suggestion.length > 4096) {
	    	return interaction.reply({
	    		embeds: [new MessageEmbed()
		   		.setTitle(`${error2emoji} | Usage error`)
		   		.setDescription("The suggestion can't be more than 4096 characters.")
		   		.setColor(ee.wrongcolor)]
	    	})
	    }
    	if(channel2){
		    interaction.reply({
		    	content: '<@' + member.user.id + '>',
		      embeds: [new MessageEmbed()
		    	.setTitle("<:check:865122245012750346> | Success")
		    	.setDescription("Your suggestion was successfully posted.")
		    	.setColor("#00ff33")],
		      ephemeral: true
		    })
    	}
	    let msg = await client.channels.cache.get(`${channel2}`).send({content: '<@' + member.user.id + '>',embeds: [new MessageEmbed()
	    	.setTitle("Suggestion")
	    	.setColor("#ed8309")
	    	.setAuthor({
	    		name: member.user.tag,
	        iconURL: member.displayAvatarURL({dynamic: true}),
	    	})
	    	.setThumbnail(member.displayAvatarURL({dynamic: true}))
	    	.setDescription(suggestion)
	    	.addFields(
	    		{
						name: 'Submitter:', value: `<@${member.user.id}>`, inline: true
					},
					{
						name: 'Status:', value: `Pending... ${maintenanceemoji}`, inline: true
					}
				)
	    	.setFooter({
	    		text: "Keep in mind that the final decision depends on the authorities.",
	    		iconURL: member.guild.iconURL({dynamic:true})
	    	})
	    	.setTimestamp()]})
	    db.set(`${interaction.guild.id}.${msg.id}`, {suggestion: suggestion,tag: member.user.tag,avatar: member.displayAvatarURL({dynamic:true}), message: msg.id, uid: member.user.id, status: "pending"})
	    msg.react(yesemoji);
			msg.react(noemoji);
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
