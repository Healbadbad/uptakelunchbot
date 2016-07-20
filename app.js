var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var routes = require('./routes/index');
var users = require('./routes/users');


function mkSeq(low,high){
  var list = [];
  for (var i = low; i <= high; i++) {
    list.push(i);
  }
  return(list)
}

function mapTeam(num){
  if ((mkSeq(0,9).indexOf(num)) > -1){
    return("Development Groups: A-H");

  }
  if  ((mkSeq(10,19).indexOf(num)) > -1){
    return ("Corporate Development or Marketing & Communications");
  }
  if  ((mkSeq(20,29).indexOf(num)) > -1){
    return ("Data Science");
  }
  if  ((mkSeq(30,39).indexOf(num)) > -1){
    return("Development Groups: I-Z")

  }
  if  ((mkSeq(40,49).indexOf(num)) > -1){
    return("Finance or Sales or Operations or Customer Service/ Success");
  }
  if  ((mkSeq(50,59).indexOf(num)) > -1){
    return( "Mission Teams (Construction & Agriculture + Energy");
  }
  if  ((mkSeq(60,69).indexOf(num)) > -1){
    return( "Mission Teams (Mining + Rail + Aviation + Healthcare");
  }
  if  ((mkSeq(70,79).indexOf(num)) > -1){
    return ("Product (Strategy + Emerging)");
  }
  if  ((mkSeq(80,89).indexOf(num)) > -1){
    return("People or Legal or Security (Physical + Digital)");
  }
  if  ((mkSeq(90,99).indexOf(num)) > -1){
    return ("IoT or UX")

  }
}

var app = express();


var lunchSessions = []
var lunchSession = {active:false, users:[], timeout:''}

var params = {
  icon_emoji: ':coffee:'
};


var Bot = require('slackbots');

// create a bot
var settings = {
  token: process.env.BOT_API_KEY,
  name: 'Hitch Bot'
};
var bot = new Bot(settings);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.post('/wow', function(req, res){
  console.log("posted: ", req.length);
  res.status(200);
  res.render('Success!');
});


var output= function(power, time){
  var options = { method: 'POST',
    url: 'https://api-http.littlebitscloud.cc/devices/00e04c03497b/output',
    headers:
    { 'postman-token': '9c57f00e-8bd6-7b50-2100-280be9cc5aa5',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      authorization: '632adf9b358f49f74167f073ec2ef07ece4b13d57ac4008426ce005fd7168483' },
    body: { percent: power, duration_ms: time },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // console.log(body);
  });
}




app.post('/datastream',function(req,res) {
  console.log("DATA");
  console.log(req.body.payload.percent)
  if(!lunchSession.active){
    bot.postMessageToGroup('random-coffee', "A coffee chat invitation from a member of *" + mapTeam(req.body.payload.percent) + "* has been sent. Type '@hitch: join' to accept the invite.", params);
    lunchSession.active = true;
    lunchSession.users = ["LittleBit"];
    output(50,150);
    setTimeout(function(){
      output(50,150);
    },1000*1);
    lunchSession.timeout = setTimeout(function(){ // 5 minute timeout
      bot.postMessageToGroup('random-coffee', "Coffee session ended, no one accepted!", params);
      lunchSession.active = false;

      output(10,100);
      setTimeout(function(){
        output(5,100);
      },1000*1);
      // output(100,500);
      setTimeout(function(){
        output(3,100);
      },1000*2);
      // output(100,500)
      setTimeout(function(){
        output(3,500);
      },1000*3);

    }, 1000*5*60);
  } else {
    // bot.postMessageToGroup('random-lunch', "Stop Hitting the button.", params);
    // Do nothing
  }
  res.render("Posted");
});

app.post('/test', function(req,res){
  output(100,1000)
  res.status(200);
  res.render('Post Success!');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





bot.on('start', function() {
  bot.postMessageToGroup('random-coffee', 'Random Coffee Service Running.', params);
  // bot.postMessageToUser('nathanblank', 'hello bro!', params);
  // bot.postMessageToGroup('some-private-group', 'hello group chat!');
});
console.log("Posted spam!");

bot.on('message', function(msg){
  if(msg.type == 'message') {
    text = msg.text;
    // console.log(text.find("<@U1P11PZLH>"));
    if(text.startsWith("<@U1P11PZLH>") && (text.split(" ")[1] == "accept" || text.split(" ")[1] == "join" || text.split(" ")[1] == "Join")){
      if(lunchSession.users.indexOf(msg.user) == -1 && lunchSession.active) {
        lunchSession.users.push(msg.user)
        bot.postMessageToGroup('random-coffee', "Coffee invitation accepted! Please head to the kitchen to meet them. :smile:", params);
        output(50, 150);
        setTimeout(function () {
          output(50, 150);
        }, 400 * 1);
        setTimeout(function () {
          output(50, 150);
        }, 400 * 2);
        if (lunchSession.timeout != ''){
          clearTimeout(lunchSession.timeout);
          lunchSession.active = false;
          lunchSession.users = [];
        }
      } else{
        bot.postMessageToGroup('random-lunch', "Lunch invitation already accepted.", params);
      }

      // TODO: send stuff to littlebits session
    }

    if(text.startsWith("<@U1P11PZLH>") && text.split(" ")[1] == "start"){
      if(!lunchSession.active){
        bot.postMessageToGroup('random-lunch', "Test Lunch session started.");
        lunchSession.active = true;
        lunchSession.users = [msg.user];
        var timer = setTimeout(function(){ // 5 minute timeout
          bot.postMessageToGroup('random-lunch', "Lunch Session Created for " + lunchSession.users.length + " users");
          lunchSession.active = false;
        }, 1000*1*60);

        output(100,500);
        setTimeout(function(){
          output(100,500);
        },1000*1);


      } else {
        bot.postMessageToGroup('random-lunch', "Test Lunch session alread active!. type '@hitch: join' to join the session.");
      }
    }
    // console.log(msg.text);

  }
  return;
});



module.exports = app;
