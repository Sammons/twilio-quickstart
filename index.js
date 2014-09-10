var twilio      = require('twilio');
var credentials = require('./credentials');
var config      = require('./config.js');
var client = new twilio.RestClient(
  /* you get these values from the twilio website,
     put them in the credentials.js file */
  credentials.sid,
  credentials.token
  );

/* once you get a phone number from twilio, put it in the config.js file.
  then, if you have put your credentials in the credentials.js file, this
  function will send texts!!

  note that texting the twilio number requires a little more configuration */
function sendMessage( to_number, message, doneCallback ) {
  client.messages.create({
    to:'+1' + to_number,
    from: config.twilioNumber,
    body: message
  }, function( error, message ) {
    if ( error ) {
      throw( "sending twilio message failed!", error );
    }
    if ( doneCallback ) doneCallback();
  });
}

sendMessage( 3148537371, "sup", function() {
  console.log('done');
})

/*
Real developers in the wild have a static domain name which Twilio can POST
to when a message comes in... this is not a luxury hackers at hackathons
always have. What this means is that when a user texts a Twilio number which
has not been configured, they get an unconfigured-esque message back. Not cool.

If you have a digital
ocean or AWS server, you can configure the Twilio API to post to a url at your static
ip. Again, this won't work for people running servers off their local machine.

So what we can do at a hacakathon, is be dirty and configure the phone number 
(without having a domain and endpoint for twilio to post to). Go to
https://www.twilio.com/user/account/phone-numbers/incoming
and buy a number if you don't have one (top right)...
Search anything, then pick one which is $1 a month. Note there are fees for usage too...
yes it does cost money. Hopefully Twilio gives you some credit so it won't cost you money
right this second. You can always cancel anyways.

Now you go back to  (Numbers)
https://www.twilio.com/user/account/phone-numbers/incoming

You should see the number you just bought. Click it.

You will see Voice and Messaging. Right now we are worried about texting only,
so look to the right of the Messaging header... and click 
configure with app OR create new app

to create a new app:
-put values like this below... Yes you are posting at 
google, but hey! that url 404s so there should be no problem, 
the request is just ignored in the void:

Name: "Practice"
// under Voice
Request URL: "http://www.google.com/nothinghere" 
// under Messaging
Request URL: "http://www.google.com/nothinghere"

click save. 
go back to numbers, click your number again, (get back to the configure page for the number)

click configure with app, if it is a link on the right.
in the Application dropdown, select your newly made app.

now this function will go grab the 10 most recent messages for the number
in the config.js file

this is node... so the return value is passed to a callback

cheers! =)
*/
function getLast10Messages( doneCallback ) {
  client.messages.list({  
    to: config.twilioNumber,  
  }, function(err, data) {
    if (err) {
      throw err;
    }
    var last10 = [];
    var length = ( 10 < data.messages.length ? 10 : data.messages.length );
    for (var i = 0; i < length; i++) {
      last10.push( data.messages[ i ] );
    }
    doneCallback( last10 );
  });
}

getLast10Messages(function( last10 ) {
  console.log( last10 );
})