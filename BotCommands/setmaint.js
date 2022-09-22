module.exports = {
    name: 'setmaint',
    description: "allows scheduling of reminders by inputting parameters of month, time period in UTC, and event name",
    
    execute(message, args){

        var month;
        var monthnum;              
        var day;

        var hourstart;
        var minutestart;
        var hourend = '';
        var minuteend = '';

        var event = '';


        //testing months
        if(!args[1]) 
            return message.channel.send('Please input valid data.');
    
        else
        {
            month = args[1].toLowerCase();
            switch(month){
                case 'jan':
                case 'january':
                    month = 'Jan';
                    monthnum = 0;
                break;

                case 'feb':
                case 'february':
                    month = 'Feb';
                    monthnum = 1;
                break;

                case 'mar':
                case 'march':
                    month = 'Mar';
                    monthnum = 2;
                    break;

                case 'apr':
                case 'april':
                    month = 'Apr';
                    monthnum = 3;
                    break;

                case 'may':
                    month = 'May';
                    monthnum = 4;
                break;
                
                case 'jun':
                case 'june':
                    month = 'June';
                    monthnum = 5;
                break;

                case 'jul':
                case 'july':
                    month = 'July';
                    monthnum = 6;
                break;

                case 'aug':
                case 'august':
                    month = 'Aug';
                    monthnum = 7;
                break;

                case 'sep':
                case 'september':
                    month = 'Sep';
                    monthnum = 8;
                break;

                case 'oct':
                case 'october':
                    month = 'Oct';
                    monthnum = 9;
                break;

                case 'nov':
                case 'november':
                    month = 'Nov';
                    monthnum = 10;
                break;                   
                        
                case 'dec':
                case 'december':
                    month = 'Dec';
                    monthnum = 11;
                break;     
                    
                default:
                    month = '*';
                    return message.channel.send('Please input a valid month.');
                break;
                }

        }

        //testing days 1-31
        if(!args[2]) 
            return message.channel.send('Please input valid data.');
        else
        {
            if (args[2] >= 1 && args[2] <= 31)
                day = args[2];
            else{
                day = '*';
                return message.channel.send('Please input a valid day 1-31');
            }     
        }

        //testing time period xx:xx-xx:xx in UTC, so 5am to 10am UTC would be 05:00-10:00
        if(!args[3]) 
            return message.channel.send('Please input valid data.');
        else
        {
            if(args[3].substring(0,2) >= 0 && args[3].substring(0,2) <= 23)
                hourstart = args[3].substring(0,2);
            else
                return message.channel.send('Please input an hour 00-23');
            
            if(args[3].substring(2,3) !== ':')
                return message.channel.send('Please format the time as xx:xx');

            if(args[3].substring(3,5) >= 0 && args[3].substring(3,5) <= 59)
                minutestart = args[3].substring(3,5);
            else
                return message.channel.send('Please input minutes from 00-59');
            
          //  return message.channel.send(`${hourstart}:${minutestart} at ${month} ${day}`);            //test function

            //testing to see if there is an end time (there should be 11 characters in xx:xx-xx:xx), if not nothing happens, if yes then we record the end time
            //otherwise there's something wrong and we send an error msg
            if(args[3].length !== 11 && args[3].length !== 5)
            {
                return message.channel.send('Please format the time as xx:xx or xx:xx-xx:xx');
            }

            if(args[3].length == 11)
            {
                if(args[3].substring(5,6) !== '-')
                    return message.channel.send('Please format the time as xx:xx-xx:xx');
                
                if(args[3].substring(6,8) >= 0 && args[3].substring(6,8) <= 23)
                    hourend = args[3].substring(6,8);
                else
                    return message.channel.send('Please input an hour 01-23');
                
                if(args[3].substring(8,9) !== ':')
                    return message.channel.send('Please format the time as xx:xx');
    
                if(args[3].substring(9,11) >= 0 && args[3].substring(9,11) <= 59)
                    minuteend = args[3].substring(9,11);
                else
                    return message.channel.send('Please input minutes from 00-59');

               // return message.channel.send(`Maint at ${hourstart}:${minutestart}-${hourend}:${minuteend} at ${month} ${day}`);            //test function
            }
        }

        if(!args[4]) 
            return message.channel.send('Please input an event/maintenance');
        else
            for (i = 4; i < args.length; i++) 
                event += args[i] + ' ';



        var Year = new Date().getUTCFullYear()
        var DtStart = new Date(Year, monthnum, day, hourstart, minutestart)
        var DtEnd = new Date(Year, monthnum, day, hourend, minuteend)



        //the spacing here is weird, just leave it

        if(hourend == '' && minuteend == '')
        {
            message.channel.send(`Successfully set the next maintenance date to ${month} ${day} at ${hourstart}:${minutestart} UTC, Event: ${event}`);    
            return [`The next maintenance date is ${month} ${day} at ${hourstart}:${minutestart} UTC, Event: ${event}`, DtStart, 'x'];     
        }

        else
        {
            message.channel.send(`Successfully set the next maintenance date to ${month} ${day} at ${hourstart}:${minutestart}-${hourend}:${minuteend} UTC, Event: ${event}`);
            return [`The next maintenance date is ${month} ${day} at ${hourstart}:${minutestart}-${hourend}:${minuteend} UTC, Event: ${event}`, DtStart, DtEnd];
        }


    }
}
