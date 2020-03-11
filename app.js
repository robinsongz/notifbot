const Discord = require('discord.js');
const config = require('./config.json');
const Enmap = require('enmap');
const fs = require('fs');
const CronJob = require('cron').CronJob;

// enmap settings back-end
enmap = new Enmap({
    name: "settings",
    fetchAll: true,
    autoFetch: true,
    cloneLevel: 'deep'
  });

// enmap settings front-end  
defaultSettings = {		
    adminRole: "GM",
    prefix: "!",	
    time1: "09 45",
    channel1: "general",
    message1: "please edit this to your liking",
    time2: "18 00",
    channel2: "general",
    message2: "please edit this to your liking",
    time3: "18 45",
    channel3: 'general',
    message3: 'please edit this to your liking',
    region: 'na'
};

const bot = new Discord.Client({
});


bot.commands = new Discord.Collection(); 
  // expo = 1
        // banquet = 2
        // fort = 3

const timeA = [];

const timeB = [];

const timeC = [];

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
   
      if (!file.endsWith(".js")) return;
      
      const event = require(`./events/${file}`);
     
      let eventName = file.split(".")[0];
     
      bot.on(eventName, event.bind(null, bot));
    });
  });

// This loop reads the /commands/ folder and registrates every js file as a new command
fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    if (files.length <= 0) {
        return;
    }

    files.forEach((f, i) => {
        fs.readdir("./commands/" + f, (err, file) => {
            for (i in file) {
                let props = require(`./commands/${f}/${file[i]}`);
                if (!!props.help) {
                bot.commands.set(props.help.name, props);
                }
            }
        });
    });
});

bot.on('ready', () => {
    console.log(`Serving ${bot.guilds.size} servers`);
    console.log('Ready boss!');

    bot.guilds.forEach((guild) => {
        

        enmap.ensure(guild.id, defaultSettings);

        const reminder1 = () => {
        
            let channel1 = enmap.get(guild.id, "channel1");
                            
            let message1 = enmap.get(guild.id, "message1");
            
           
                guild.channels
                    .find((channel) => {
                        if (channel.name === channel1) {
                            channel
                                .send(message1)
                                .catch(console.error);
                        } else {
                            return;
                        }
                    });
        };
    
        const reminder2 = () => {
            let channel2 = enmap.get(guild.id, "channel2");
                            
            let message2 = enmap.get(guild.id, "message2");
    
           
            guild.channels
                .find((channel) => {
                    if (channel.name === channel2) {
                        channel
                            .send(message2)
                            .catch(console.error);
                    } else {
                        return;
                    }
            });
        };
    
        const reminder3 = () => {
         
            let channel3 = enmap.get(guild.id, 'channel3');
            let message3 = enmap.get(guild.id, 'message3');

            guild.channels
                .find(channel => {
                    if (channel.name === channel3) {
                        channel
                            .send(message3)
                            .catch(console.error);
                    } else {
                        return;
                    }
                });
        };
    

        let region = enmap.get(guild.id, 'region');

        let time2 = enmap.get(guild.id, 'time2');

        let time2Min = time2.charAt(3) + time2.charAt(4);

        let time2hr = time2.charAt(0) + time2.charAt(1);
       
        let time3 = enmap.get(guild.id, 'time3');

        let time3min = time3.charAt(3) + time3.charAt(4);

        let time3hr = time3.charAt(0) + time3.charAt(1);

        let time1 = enmap.get(guild.id, 'time1');

        let time1min = time1.charAt(3) + time1.charAt(4);

        let time1hr = time1.charAt(0) + time1.charAt(1);

        if (region === 'eu') {

            timeA[guild.id] = new CronJob(`00 ${time1min} ${time1hr} * * *`, reminder1, null, true, 'Europe/Helsinki');
               
            timeB[guild.id] = new CronJob(`00 ${time3min} ${time3hr} * * *`, reminder3, null, true, 'Europe/Helsinki');
                      
            timeC[guild.id] = new CronJob(`00 ${time2Min} ${time2hr} * * *`, reminder2, null, true, 'Europe/Helsinki');
               
        }

        else if (region === 'asia') {

            timeA[guild.id] = new CronJob(`00 ${time1min} ${time1hr} * * *`, reminder1, null, true, 'Asia/Taipei');
               
            timeB[guild.id] = new CronJob(`00 ${time3min} ${time3hr} * * *`, reminder3, null, true, 'Asia/Taipei');
                      
            timeC[guild.id] = new CronJob(`00 ${time2Min} ${time2hr} * * *`, reminder2, null, true, 'Asia/Taipei');
        }
        
        else {

            timeA[guild.id] = new CronJob(`00 ${time1min} ${time1hr} * * *`, reminder1, null, true, 'America/Anchorage');
               
            timeB[guild.id] = new CronJob(`00 ${time3min} ${time3hr} * * *`, reminder3, null, true, 'America/Anchorage');
                      
            timeC[guild.id] = new CronJob(`00 ${time2Min} ${time2hr} * * *`, reminder2, null, true, 'America/Anchorage');
    
        }

         
    });

    
});
     

bot.on('message', function(message) {

    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    // if guild does not have enmap settings, set defaultSettings as default
    enmap.ensure(message.guild.id, defaultSettings);

    let msgPrefix = message.content.charAt(0);
    let prefix = enmap.get(message.guild.id, 'prefix');
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));

    if (prefix == msgPrefix && commandfile && args[0] == "time2") {
        commandfile.run(bot, message, args, timeB[message.guild.id]);
    } 

    else if (prefix == msgPrefix && commandfile && args[0] == "time3") {
        commandfile.run(bot, message, args, timeC[message.guild.id]);
    } 

    else if (prefix == msgPrefix && commandfile && args[0] == "time1") {
        commandfile.run(bot, message, args, timeA[message.guild.id]); 
    } 

    else if (prefix == msgPrefix && commandfile && cmd == prefix + 'setconf') {
        commandfile.run(bot, message, args);
    }

    else if (prefix == msgPrefix && commandfile) {
        commandfile.run(bot, message, args,);
    } 
 
});

// logs unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason);
});

// bot login
bot.login(config.token); 
