const Discord = require('discord.js');
const CronTime = require('cron').CronTime;

module.exports.run = async (bot, message, args, reminder) => {

    const guildConf = enmap.ensure(message.guild.id, defaultSettings);

    if (!message.guild || message.author.bot) return;
  
    if (message.content.indexOf(guildConf.prefix) !== 0) return;
  
  
    // setting configurations command
    
     
    // grabbing value of admin
    const adminRole = message.guild.roles.find(role => role.name === guildConf.adminRole);

    if(!adminRole) return message.reply("Administrator Role Not Found");
    
    // exits if user is not admin
    if(!message.member.roles.has(adminRole.id)) {
      return message.reply("Hey, you're not the boss of me!");
    }
    
    const [prop, ...value] = args;

    
    let botembed = new Discord.RichEmbed()
        .setTitle(`${prop} changed!`)
        .setDescription(`Your \`${prop}\` has been changed to: \n \`${value.join(" ")}\``)
        .setColor("#15f153");

    let timeembed = new Discord.RichEmbed()
        .setTitle(`${prop} changed!`)
        .setDescription(`Your \`${prop}\` has been changed to: \n \`${value.join(":")}\``)
        .setColor("#15f153");

    let channelembed = new Discord.RichEmbed()
        .setTitle(`${prop} changed!`)
        .setDescription(`Your \`${prop}\` has been changed to: \n \`${value.join("-")}\``)
        .setColor("#15f153");

    if (prop === 'help') {
        message.author.send({embed: {
            color: 3447003,
            title: '**__Configuration Help__**',
            description: `Hey GM! I'm here to teach you how to set up your own guild-specific configurations.`,
            fields: [{
                name: "**__Why do I need to set configurations?__**",
                value: "Every guild discord is different - they have their own specific channels, banquet times, GMs want their own reminder messages, etc etc. \n\n By setting configs, you are able to edit all of these to your liking."
              },
              {
                  name: "**__Configuration Keys and Value__**",
                  value: "There are 2 parts to my configurations: **keys and values**. \n\n The **key** is the type of configuration. \n\n Some examples of **keys** include 'expoMessage', 'expoChannel' & 'banquetTime'. \n\n The **value** is the value of that particular **key**, and it is what you will be changing. \n\n For example, the default **value** of the **key** 'expoChannel' is set to 'general'. This means that my expedition reminders will be sent to the channel called 'general' by default. \n\n If you don't have a channel called 'general', or want me to send exped reminders to a different channel, let's say to a channel called 'expedition-reminders', you would change the **value** of expoChannel to 'expedition-reminders'."
              },
              {
                name: "**__Changing values__**",
                value: "To change the value of a key, type !setconf followed by the **key** and then the **value** you want. \n\n For the example above, simply type **!setconf expoChannel expedition-reminders**. This will set my expedition reminder messages to send only to the channel **expedition-reminders**. \n\n You can then type **!showconf** to view your changes. \n\n Simple enough, right? \n\n If you're not getting reminders from me, there is probably an error in your configs (check spelling and/or letter casing). \n\n Now go edit your configs! "
              },
              {
                name: "**__Keys and their functions__**",
                value: "**adminRole**: name of role you must have to use admin commands \n\n **prefix**: prefix used before every command \n\n **privateMessage**: private message sent to new discord members \n\n **expoChannel/banquetChannel/fortChannel**: The channel I will send my reminders to. \n\n **expoMessage/banquetMessage/fortMessage**: content of reminder messages \n\n **expoTime1/expoTime2/banquetTime/fortTime**: time for reminders to be sent. \n\n **teamChannel/gfChannel**: !team and !gf commands will only work in these channels \n\n **team/party/guildFort**: used for each commands. cannot customize! \n\n **region**: timezone for reminder times"
              },
              {
                name: "**__Guide to Setting Times__**",
                value: "All times are set in PST (Pacific Time Zone) \n\n Times are in HH MM format, military time. For example, 15 00 = 3:00pm; 02 00 = 2:00am \n\n  \n\n **__Examples__** \n !setconf time1 09 45 - this sets reminder time 1 to 9:45am PST"
              }
            ]
          }
        });

        return message.reply(`Check your DM!`);
    }

    // if invalid key is entered
    if(!enmap.has(message.guild.id, prop)) {
        return message.reply("This key is not in the configuration. Type !showconf to see your current keys.")
        .catch(console.error);
    }

    else if (prop === 'team' || prop === 'party') {
        return message.reply(`You cannot set these configurations. Use the !${prop} command`);
    }

    else if (prop === 'guildFort') {
        return message.reply(`You cannot set these configurations. Use the !gf command`);
    }

    //settings banquet configs

    // expo = 1
        // banquet = 2
        // fort = 3

    else if (prop === 'time2') {

        let minute = Number(value[1]);
        let hour = Number(value[0]);

        if (isNaN(minute) || isNaN(hour)) {
            return message.channel.send(`Please enter a valid time.`);
        }

        if ( minute > 60 || hour > 24) {
            return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm.`);
        }

        if (minute < 0 || hour < 0) {
            return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm`);
        }

        if (value[2]) {
           return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm.`);
        }

       
            enmap.set(message.guild.id, value.join(" "), 'time2');

            if (!!reminder) {
                let timezone = reminder.cronTime.zone;

                
                var time2 = new CronTime(`00 ${value[1]} ${value[0]} * * *`, timezone);
                reminder.setTime(time2);
                
                reminder.stop();
                reminder.start();
                               
            }  

            
            message.channel
                .send(timeembed)
                .catch(err => console.log(err));
        
           
        
    }

    else if (prop === 'time3') {

        let minute = Number(value[1]);
        let hour = Number(value[0]);

        if (isNaN(minute) || isNaN(hour)) {
            return message.channel.send(`Please enter a valid time.`);
        }

        if ( minute > 60 || hour > 24) {
            return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm.`);
        }

        if (minute < 0 || hour < 0) {
            return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm`);
        }

        if (value[2]) {
           return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm.`);
        }

       
            enmap.set(message.guild.id, value.join(" "), 'time3');

            if (!!reminder) {
                let timezone = reminder.cronTime.zone;

                
                var time3 = new CronTime(`00 ${value[1]} ${value[0]} * * *`, timezone);
                reminder.setTime(time3);
                
                reminder.stop();
                reminder.start();
                               
            }

            message.channel
                .send(timeembed)
                .catch(err => console.log(err));
        
    }

    else if (prop === 'time1') {

        let minute = Number(value[1]);
        let hour = Number(value[0]);

        if (isNaN(minute) || isNaN(hour)) {
            return message.channel.send(`Please enter a valid time.`);
        }

        if ( minute > 60 || hour > 24) {
            return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm.`);
        }

        if (minute < 0 || hour < 0) {
            return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm`);
        }

        if (value[2]) {
           return message.channel.send(`Please enter a valid time, with hour first and minute second, in military time. \n For example: 18 30 = 6:30pm.`);
        }

       
            enmap.set(message.guild.id, value.join(" "), 'time1');

            if (!!reminder) {
                let timezone = reminder.cronTime.zone;

                
                var time1 = new CronTime(`00 ${value[1]} ${value[0]} * * *`, timezone);
                reminder.setTime(time1);
                
                reminder.stop();
                reminder.start();
                               
            }

            message.channel
                .send(timeembed)
                .catch(err => console.log(err));
        
    }

     // if changing channel configs
    else if (prop === 'channel1' || prop === 'channel2' || prop === 'channel3') {
        enmap.ensure(message.guild.id, defaultSettings);
    
        enmap.set(message.guild.id, value.join("-").toLowerCase(), prop);
        
        return message.channel
            .send(channelembed);
    }
    

    // if changing prefix
    else if (prop === 'prefix') {

        if (value.length == 0) return message.channel.send("Please enter a valid prefix!");

        if (value.length > 1) return message.channel.send("Please enter only one prefix!");

        if (value[0].length > 1) return message.channel.send("Your selected prefix is too long, please use only 1 character!");

    

        enmap.set(message.guild.id, value, prop);

        

        return message.channel.send(botembed);  
    }

    // if changing region
    else if (prop === 'region') {

        if (value.join(" ").toLowerCase() === 'na') {
            enmap.ensure(message.guild.id, defaultSettings);
    
            enmap.set(message.guild.id, value.join(" ").toLowerCase(), prop);

         

            return message.channel
                .send(botembed)
                .then(process.exit);
        }

        if (value.join(" ").toLowerCase() === 'eu') {
            enmap.ensure(message.guild.id, defaultSettings);
    
            enmap.set(message.guild.id, value.join(" ").toLowerCase(), prop);

            

            return message.channel
                .send(botembed)
                .then(process.exit);
        }

        if (value.join(" ").toLowerCase() === 'asia') {
            enmap.ensure(message.guild.id, defaultSettings);
    
            enmap.set(message.guild.id, value.join(" ").toLowerCase(), prop);

           

            return message.channel
                .send(botembed)
                .then(process.exit);
        }

        else {
            return message.channel
                .send(`Please enter **'na'**, **'eu'**, or **'asia'**.`);
        }
    }   

    else {

        // if blank key is entered
        if (prop === undefined ) {
            return message.reply("You cannot enter a blank key. Type '!setconf help' for configuration help, or '!showconf' for your current configurations.")
            .catch(console.error);
        }

        // if blank value is entered
        if (value === undefined || value === null || value.join(" ") === '') {
            return message.reply(`You cannot enter a blank value. Type '!setconf help' for configuration help, or '!showconf' for your current configurations.`);
        }

        // else if (prop === ('expoReminder') || prop === 'fortReminder' || prop === 'banquetReminder') {

        //     if (value.join(" ").toLowerCase() === 'on') {
        //         enmap.ensure(message.guild.id, defaultSettings)
        
        //         enmap.set(message.guild.id, value.join(" ").toLowerCase(), prop)

        //         return message.channel
        //         .send(`Your **${prop}** has been turned ON`)
        //         .then(process.exit);
        //     }

        //     if (value.join(" ").toLowerCase() === 'off') {
        //         enmap.ensure(message.guild.id, defaultSettings)
        
        //         enmap.set(message.guild.id, value.join(" ").toLowerCase(), prop)

        //         return message.channel
        //         .send(`Your **${prop}** has been turned OFF`)
        //         .then(process.exit);
        //     }

        //     else {
        //         return message.channel
        //             .send(`Please enter **'on'** or **'off'** `)
        //     }
        // } 

        
        // changing all other configs
        else {

            let botembed = new Discord.RichEmbed()
                    .setTitle(`${prop} changed!`)
                    .setDescription(`Your \`${prop}\` has been changed to: \n \`${value.join(" ")}!\``)
                    .setColor("#15f153");

            enmap.ensure(message.guild.id, defaultSettings);
        
            enmap.set(message.guild.id, value.join(" "), prop);
        
            return message.channel
                .send(botembed);
                
        }
        }

        
    };

module.exports.help = {
    name: 'setconf'
};