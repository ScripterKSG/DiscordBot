const Discord = require('discord.js');
const bot = new Discord.Client();

//set up Command Handler
const fs = require('fs');
bot.commands =new Discord.Collection();
const commandFiles = fs.readdirSync('./BotCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./BotCommands/${file}`);

    bot.commands.set(command.name, command);
}
//
const channelID = ``; 


var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: 'x'
});

const params = {screen_name: 'ArknightsEN', count: '3', tweet_mode: 'extended'};

var lastTweet = '';


bot.login('');    
//bot.login(process.env.BOT_TOKEN);                             //login bot so it can function


// Twitter Updates from specific account, see screen_name params
//
setInterval(function(){
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            if (tweets[0].full_text.startsWith("@")) {
                console.log("tweet reply")
                return;
            }

            let tweet = {
                tweet_id: tweets[0].id_str,
                tweet_profile_name: tweets[0].user.name,
                tweet_profile_handle: tweets[0].user.screen_name,
                tweet_profile_avatar: tweets[0].user.profile_image_url,
                tweet_timestamp: tweets[0].created_at,
                tweet_text: tweets[0].full_text
            }

            //console.log(tweet)
            if(lastTweet == ''){
                lastTweet = tweet.tweet_id;
                //this is the first tweet which each subsequent query is checked against
            } else if(tweet.tweet_id == lastTweet){
                //console.log(`No new tweet. ${tweet.tweet_id}.`)
            } else if(tweet.tweet_id > lastTweet){
                console.log(`New Tweet! Tweet URL: https://twitter.com/ArknightsEN/status/${tweet.tweet_id}`)     // test on personal account
                
                const channel = bot.channels.cache.get(channelID);    
                channel.send(`https://twitter.com/ArknightsEN/status/${tweet.tweet_id}`);
                
            } else {
                console.log(`Possibly deleted tweet?: ${tweet.tweet_id}.`)
            }

            lastTweet = tweet.tweet_id;
        } else {
            console.log('Error fetching tweets: \'' + JSON.stringify(error) + '\'.');
        }
    });
}, 5000);

//
// Cron job for daily and weekly resets

const cron = require("node-cron");

cron.schedule("0 0 10 * * 0,2-6", () =>{
    console.log("One hour before daily reset.");

    const channel = bot.channels.cache.get(channelID);    
    channel.send("One hour before daily reset.");
}, {
    scheduled: true,
    timezone: "Etc/UTC"
});

cron.schedule("0 30 10 * * 0,2-6", () =>{
    console.log("One hour before daily reset.");
    
    const channel = bot.channels.cache.get(channelID);    
    channel.send("30 minutes before daily reset.");
}, {
    scheduled: true,
    timezone: "Etc/UTC"
});

cron.schedule("0 0 11 * * 0,2-6", () =>{
    console.log("Daily reset.");
    
    const channel = bot.channels.cache.get(channelID);    
    channel.send("Daily reset.");
}, {
    scheduled: true,
    timezone: "Etc/UTC"
});

cron.schedule("0 0 10 * * 1", () =>{
    console.log("One hour before weekly and daily reset.");

    const channel = bot.channels.cache.get(channelID);    
    channel.send("One hour before weekly and daily reset.");
}, {
    scheduled: true,
    timezone: "Etc/UTC"
});


cron.schedule("0 30 10 * * 1", () =>{
    console.log("One hour before weekly and daily reset.");
      
    const channel = bot.channels.cache.get(channelID);    
    channel.send("30 minutes before weekly and daily reset.");
}, {
    scheduled: true,
    timezone: "Etc/UTC"
});

cron.schedule("0 0 11 * * 1", () =>{
    console.log("Weekly and daily reset.");
      
    const channel = bot.channels.cache.get(channelID);    
    channel.send("Weekly and daily reset.");
}, {
    scheduled: true,
    timezone: "Etc/UTC"
});


bot.on('ready', () =>{
    console.log('Reporting for duty!');
})


//  BOT COMMANDS BELOW HERE
const PREFIX = '?';
var maintdate ='*';
var array = '';
let commandwhitelist = [
    '129043800277385216',               //Scripter's discord ID
    '209330478719696897'                   // swdn's discord ID
  ];

 /* if (commandwhitelist.contains(msg.author.id)) {                                     //code for username recognition
      //run command
  } else {
      //msg.reply("You do not have permission to use this command!")
  }*/

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'setmaint':
            if (commandwhitelist.includes(message.author.id))
            {
                if (maintdate != '*')
                    message.channel.send('Maintenance date already set. Please ?clearmaint to reset.');
                else
                    array = bot.commands.get('setmaint').execute(message, args);                    //array has maintdate message and Date objects for start and end times

                    if (typeof array[1] == 'undefined')
                    {
                        maintdate = '*'
                        array = ''
                    }
                    else
                    {
                        maintdate = array[0]
                        setReminder(array)
                    }
            }
         else
            message.channel.send("You do not have permission to use this command!");

        break;

        case 'maint':
            if (maintdate == '*')
                message.channel.send('No currently scheduled maintenance');
            else
                message.channel.send(maintdate);
        break;

        case 'clearmaint':
            if (commandwhitelist.includes(message.author.id))
            {
                maintdate = '*';
                array = '';
                clearReminder();
                message.channel.send('Successfuly removed maintenance date');
            }
            else
                message.channel.send("You do not have permission to use this command!");

        break;

        case 'setlink':
            if (commandwhitelist.includes(message.author.id))
            {
                bot.commands.get('setlink').execute(message,args);
            }
            else
                message.channel.send("You do not have permission to use this command!");

        break;
            

        case 'help':
            var text = `**?setmaint** - mods only, sets future maintenance date, input as "?setmaint" *month* *1-31* *xx:xx-xx:xx* "event name"
**?clearmaint** - mods only, clears set maintenance date
**?maint** - displays next maintenance date`;

            message.channel.send(text);
        break;
            
            

    }


})

//helper functions below

var arrayTimer = new Array()

//Sends automatic reminders for when maintenance will begin and end
function setReminder(info)
 {
    const channel = bot.channels.cache.get(channelID);
    var now = new Date()
    now.setDate(now.getUTCDate())
    now.setHours(now.getUTCHours())

    if (info[1] - now > 0)
    {
        if (info[1] - now >= 21600000)
            arrayTimer.push(setTimeout(function(){channel.send("Six hours until maintenance begins!")} , info[1] - now - 21600000)) 
        if (info[1] - now >= 7200000)
            arrayTimer.push(setTimeout(function(){channel.send("Two hours until maintenance begins!")} , info[1] - now - 7200000))
        if (info[1] - now >= 3600000)
            arrayTimer.push(setTimeout(function(){channel.send("One hour until maintenance begins!")} , info[1] - now - 3600000))
        if (info[1] - now >= 1800000)
            arrayTimer.push(setTimeout(function(){channel.send("Thirty minutes until maintenance begins!")} , info[1] - now - 1800000))

        arrayTimer.push(setTimeout(function(){channel.send("Maintenance begins!")} , info[1] - now))
    }

    if (info[2] != 'x')
        if (info[2] - now > 0)
        {
            if (info[2] - info[1] >= 21600000)
                arrayTimer.push(setTimeout(function(){channel.send("Six hours until maintenance ends!")} , info[2] - now - 21600000)) 
            if (info[2] - info[1] >= 7200000)
                arrayTimer.push(setTimeout(function(){channel.send("Two hours until maintenance ends!")} , info[2] - now - 7200000))
            if (info[2] - info[1] >= 3600000)
                arrayTimer.push(setTimeout(function(){channel.send("One hour until maintenance ends!")} , info[2] - now - 3600000))
            if (info[2] - info[1] >= 1800000)
                arrayTimer.push(setTimeout(function(){channel.send("Thirty minutes until maintenance ends!")} , info[2] - now - 1800000))

            arrayTimer.push(setTimeout(function(){channel.send("Maintenance has ended!")} , info[2] - now))
        }
  }

function clearReminder()
{
    const channel = bot.channels.cache.get(channelID);
    for (i = 0; i < arrayTimer.length; i++)
    {
        clearTimeout(arrayTimer[i])
    }
    arrayTimer = new Array()

}

