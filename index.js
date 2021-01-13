//2020/01/13
//Created by Joey Heo

//Variables
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
const os = require("os");
const ess = require('./ess');
const math = require('mathjs');
const prefix = "="
require('dotenv');

//Client-side
client.on('ready', () => {

  console.log(`Ready to server on 1 server, for ${client.users.size} users.`);
  client.user.setActivity('Calculus Videos', { type: 'WATCHING' })
  .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
  .catch(console.error);
});


client.on('message', message => {

  if (message.author.bot) return;
  // Return if it is a DM

  // Saving memory, if there is no prefix it quits.
  if (!message.content.slice(1) === prefix) return;

  const args = message.content.trim().split(/ +/g);
  //Function for command checking
  function commandIs(command) {
    if (message.content.startsWith(prefix + command)) {
      return true;
    }
  }

  if (commandIs("verify")) {
    let filter = m => m.author.id === message.author.id
        message.reply({embed: {
            color: 3447003,
            title: "Verification instructions",
            description: "To verify your account, please type your name in this following format within 30 seconds. (FirstName, LastName, KoreanNameWithoutLastName) => Ex. Joey, Heo, 성현",
        }})
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
        collector.on('collect', collected => {
          var collectedArr = collected.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi,'').split(",");
          if (collectedArr.length = 3) {
            let role = message.guild.roles.find(r => r.name === "Math Circle Member");
            let role2 = message.guild.roles.find(r => r.name === "Verification");
            if (!role) return;
            if (!role2) return;
            message.member.removeRole(role2);
            message.member.addRole(role);
            console.log(collectedArr[0]);
            console.log(collectedArr[1]);
            console.log(collectedArr[2]);
            console.log(collectedArr[0]+" "+collectedArr[2]+" "+collectedArr[1]);
            let name = collectedArr[0]+" ("+collectedArr[2]+") "+collectedArr[1];
            message.member.setNickname(name);
         }  
      })
    
}
  if(commandIs("serverinfo")){
        try {
          let guild = message.guild

          const embed = new Discord.RichEmbed()
            .setDescription("Description and information about this server")
            .setColor(3447003)
            .setThumbnail(guild.iconURL)
            .setTimestamp(new Date())
            .addField("Name", guild.name, true)
            .addField("ID", guild.id, true)
            .addField("Owner", guild.ownerID, true)
            .addField("Region", guild.region, true)

            .addField("Verification Level", guild.verificationLevel, true)
            .addField("Channels", guild.channels.array().length, true)
            .addField("Members", guild.memberCount, true)
            .addField("Creation Date", guild.createdAt, true)

          message.channel.send(embed)
          return;
        } catch (err) {
          console.log(err);
          message.channel.send(ess.errorHandle(err));
        }

      }
      /*
if(commandIs("send")){
  message.channel.send(`<@&798716494883717130>`)
  message.channel.send({
    
    embed: {
      color: 3447003,
      title: "Verfication Purpose & Steps",
      description: "Verfication is built into this discord bot, in order to provide the best server experience for everyone. This bot does not store any kind of information, so please don't be concerned about privacy issues.",
      fields: [{
          name: "Steps",
          value: "**Run command =verify, the bot will ask you for your name (First your English name in this format, Joey Heo | Next your Korean Name in this format, 성현). Please follow the format for a smooth verification. After typing all of the requested information, bot should automatically role you and rename you.**"
      }, 
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "KGSEA Math Circle"
      }
    }
  })
}

*/
if(commandIs("userinfo")){
  try {
     if (message.mentions.members.first()) {
       let member = message.mentions.members.first().user
       let guildMember = message.mentions.members.first()
       const embed = new Discord.RichEmbed()
         .setDescription("Description and information about " + member.tag)
         .setAuthor(member.username, member.displayAvatarURL)
         .setColor(3447003)
         .setThumbnail(member.displayAvatarURL)
         .setTimestamp(new Date())
         .setFooter("KGSEA bot", client.user.avatarURL)
         .addField("ID", member.id)
         .addField("Discriminator", member.discriminator)
         .addField("Status", member.presence.status)

         .addField("Nickname", guildMember.nickname)
         .addField("Moderator", guildMember.hasPermission("BAN_MEMBERS"))
         .addField("Joined at", guildMember.joinedAt)
         .addField("Role(s)", guildMember.roles.array().join(", "))
       message.channel.send(embed)
     } else {
       let member = message.author
       let guildMember = message.guild.member(member)
       const embed = new Discord.RichEmbed()
         .setDescription("Description and information about " + member.tag)
         .setAuthor(member.username, member.displayAvatarURL)
         .setColor(3447003)
         .setThumbnail(member.displayAvatarURL)
         .setTimestamp(new Date())
         .setFooter("KGSEA bot", client.user.avatarURL)
         .addField("ID", member.id)
         .addField("Discriminator", member.discriminator)
         .addField("Status", member.presence.status)

         .addField("Nickname", guildMember.nickname)
         .addField("Moderator", guildMember.hasPermission("BAN_MEMBERS"))
         .addField("Joined at", guildMember.joinedAt)
         .addField("Role(s)", guildMember.roles.array().join(", "))
       message.channel.send(embed)
     }
     return;
   } catch (err) {
     message.channel.send(ess.errorHandle(err));
   }
}

if (commandIs("help")) {
  const embed = new Discord.MessageEmbed()
    .setTitle("Commands List for KGSEA bot")
    .setDescription(`All the commands provided for the release version of KGSEA bot. Default prefix is ${prefix}`)
    .setColor(3447003)
    .addField("help", "This help panel")
    .addField("userinfo", "Information about user in the server")
    .addField("purge", "Delete a bulk load of messages (100 max)")
    .addField("serverinfo", "Gives all of the information of the server")
    .addField("botstatus" , "bot status from heroku hosting server.")
    .addField("info", "gives you information")
    .setFooter("KGSEA bot", client.user.avatarURL)
    .setThumbnail(client.user.avatarURL)

  message.channel.send(embed);
}
if(commandIs("botstatus")){
  try {

     //CPU Stuff
     function cpuAverage() {
       var totalIdle = 0,
         totalTick = 0;
       var cpus = os.cpus();

       for (var i = 0, len = cpus.length; i < len; i++) {
         var cpu = cpus[i];
         for (type in cpu.times) {
           totalTick += cpu.times[type];
         }
         totalIdle += cpu.times.idle;
       }
       return {
         idle: totalIdle / cpus.length,
         total: totalTick / cpus.length
       };
     }

     var startMeasure = cpuAverage();

     setTimeout(function() {
         var endMeasure = cpuAverage();
         var idleDifference = endMeasure.idle - startMeasure.idle;
         var totalDifference = endMeasure.total - startMeasure.total;
         var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
         //CPU STUFF OVER

         var botMembers = client.users.size

         //HHMMSS
         String.prototype.toHHMMSS = function() {
           var sec_num = parseInt(this, 10); // don't forget the second param
           var hours = Math.floor(sec_num / 3600);
           var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
           var seconds = sec_num - (hours * 3600) - (minutes * 60);

           if (hours < 10) {
             hours = "0" + hours;
           }
           if (minutes < 10) {
             minutes = "0" + minutes;
           }
           if (seconds < 10) {
             seconds = "0" + seconds;
           }
           var time = hours + ':' + minutes + ':' + seconds;
           return time;
         }
         //

         const rich = new Discord.RichEmbed()
           .setTitle("Server Internal Status")
           .setDescription("Shows you the internal specification of the server's status")
           .setColor(3447003)
           .setThumbnail("https://nodejs.org/static/images/logo-hexagon.png")
           .setTimestamp(new Date())
           .setFooter("KGSEA bot", client.user.avatarURL, true)
           .addField("CPU Percentage", `${percentageCPU}%`, true)
           .addField("RAM Usage", `${Math.round(process.memoryUsage().heapUsed/ 1024 / 1024 * 100) / 100} MB`, true)
           .addField("Uptime", `${process.uptime().toString().toHHMMSS()}`, true)
           .addField("Guilds", client.guilds.array().length, true)
           .addField("Users", botMembers, true)
           .addField("Bot Version", `beta`, true)

         message.channel.send(rich);

       },
       100);
     return;
   } catch (err) {
     message.channel.send(ess.errorHandle(err));
   }
}
if(commandIs("info")){
  message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "KGSEA Math Circle",
    url: "",
    description: "Korean Gifted Students Evaluation Association(K.G.S.E.A.)is a non-profit organization officially registered in Korea and it was established in 2009. K.G.S.E.A. have been opened a new door to pass on proper educational information and to discover gifted students, and we have been provided more opportunities for Korean students to participate in a diverse range of international competitions.",
    fields: [
      {
        name: "Learn More",
        value: "[Here](http://kgsea.org/)"
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "KGSEA bot"
    }
  }
});
}
if(commandIs("membercount")){
	try {
      let guild = message.guild

      const embed = new Discord.RichEmbed()
        .setDescription("membercount")
        .setColor(3447003)
        .setThumbnail(guild.iconURL)
        .setTimestamp(new Date())
        .addField("Name", guild.name, true)
        .addField("ID", guild.id, true)
        .addField("Owner", guild.owner.user.tag, true)
        .addField("Members", guild.memberCount, true)

      message.channel.send(embed)
      return;
    } catch (err) {
      console.log(err);
      message.channel.send(ess.errorHandle(err));
    }
}


if (commandIs("purge")) {
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
     try {
      if (!Number(message.content.split(" ")[1])) {
        message.channel.send("Please provide a number for amount of messages to be deleted.")
        return;
      }
      let deleteCount = parseInt(message.content.split(" ")[1])
      if (deleteCount > 99) {
        message.channel.send("Please try lower number than 100.");
        return;
      }

      message.channel.fetchMessages({
        limit: deleteCount + 1
      }).then(messages => message.channel.bulkDelete(messages));
      message.channel.send(`:white_check_mark: Purged messages.`).then(msg => msg.delete())


    } catch (err) {
      message.channel.send(ess.errorHandle(err));
    }
    }
  }

})

  // Return if it is a bot





client.login(process.env.TOKEN);