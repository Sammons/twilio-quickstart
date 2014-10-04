var twilio      = require('twilio');
var credentials = require('./credentials');
var config      = require('./config.js');
var bodyParser  = require('body-parser');
var express     = require('express');
var fs          = require('fs');
var app         = express();

var client = new twilio.RestClient(
  /* you get these values from the twilio website,
     put them in the credentials.js file */
  credentials.sid,
  credentials.token
  );
app.use(express.static('public'));
app.use(bodyParser())
// app.use()
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
      console.log(error)
      throw( "sending twilio message failed!", error );
    }
    if ( doneCallback ) doneCallback();
  });
}
app.post('/send',function(req,res) {
  var numbers =   JSON.parse(req.body.nums);
  var message =   req.body.msg;
   for (var i = 0; i < numbers.length; i++) {
    console.log( numbers[i] )
     sendMessage( numbers[ i ], message );
   }
})
app.get('/',function(req,res){
  res.end(fs.readFileSync('./form.html'));
})
app.listen(3000)
// sendMessage( 3148537371, "sup", function() {
//   console.log('done');
// })


