const Discord = require('discord.js');



module.exports.run = async (bot, message) => {

    const guildConf = enmap.ensure(message.guild.id, defaultSettings);

    if (!message.guild || message.author.bot) return;
  
    if (message.content.indexOf(guildConf.prefix) !== 0) return;


    // list available bot commands
     
            message.author.send({embed: {
                color: 3447003,
                fields: [{
                    name: "**__Public Commands__**",
                    value: "**!help** : list of commands"
                },
                {
                    name: "**__Admin Commands__**",
                    value: "**!showconf** : show current configurations \n**!setconf** : edit configurations \n **!resetconf** : resets configurations to default settings"
                }
                ]
            }
            });

            message.reply(`Check your DM!`);
       

        
    };


module.exports.help = {
    name: "help"
};