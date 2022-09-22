module.exports = {
    name: 'setlink',
    description: "alows creation of command for embed links",
    
    execute(message, args){
        if(!args[1] || !args[2]) 
            return message.channel.send('Please input valid data.');
    }
}