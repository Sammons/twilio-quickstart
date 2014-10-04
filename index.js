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
var count_successes = 0;
function sendMessage( to_number, message, doneCallback ) {
  try {

  client.messages.create({
    to:'+1' + to_number,
    from: config.twilioNumber,
    body: message
  }, function( error, message ) {
    if ( error ) {
      console.log(error)
      throw( "sending twilio message failed!", error );
    }
    count_successes++;
    if ( doneCallback ) doneCallback();
  });
  } catch(e) {
    console.log(e);
    throw( "sending twilio message failed", e)
  }
}

var Q = [];
function add_to_q( num, msg ) {
  Q.push({ num: num, msg: msg });
}

function drain_q() {
  if (Q.length == 0) {
    var count = count_successes;
    sendMessage( '13148537371', 'Ben, this is HackMizzou bot, I just texted successfully - ' + count + ' people',
      function() {
      count_successes = 0;  
      });
    //sendMessage( '16363888236', 'Dan, this is HackMizzou bot, I just texted successfully - ' + count + ' people');
    return;
  }
  var next = Q.pop();
  console.log( 'sending:', next);
  try {
    sendMessage( next.num, next.msg, function() {
      console.log('completed');
      setImmediate(function() {
        drain_q();
      });
    });
  } catch (e) {
    setImmediate(function() {
      drain_q();
    });
  }
}

app.post('/send',function(req,res) {
  res.end();

  var numbers = req.body.nums;
  var message = req.body.msg;
  for (var i = 0; i < numbers.length; i++) {
    add_to_q( numbers[ i ], message );
  }
  drain_q();
})
app.get('/',function(req,res){
  res.end(fs.readFileSync('./form.html'));
})
app.listen(3000)


