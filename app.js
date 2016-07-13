var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


var lunchSessions = []
var lunchSession = {active:false, users:[]}


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
  if(!lunchSession.active){
    bot.postMessageToGroup('random-lunch', "Lunch session started.");
    lunchSession.active = true;
    lunchSession.users = ["LittleBit"];
    var timer = setTimeout(function(){ // 5 minute timeout
      bot.postMessageToGroup('random-lunch', "Test Lunch session ended with " + lunchSession.users.length + " users");
      lunchSession.active = false;
    }, 1000*1*60);
  } else {
    bot.postMessageToGroup('random-lunch', "Stop Hitting the button.");
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




var Bot = require('slackbots');

// create a bot
var settings = {
  token: process.env.BOT_API_KEY,
  name: 'Botty McBotface'
};
var bot = new Bot(settings);

bot.on('start', function() {
  params = {"attachments": [
    {
      "title": "The Further Adventures of Slackbot",
      "fields": [
        {
          "title": "Volume",
          "value": "1",
          "short": true
        },
        {
          "title": "Issue",
          "value": "3",
          "short": true
        }
      ],
      "author_name": "Stanford S. Strickland",
      "author_icon": "https://api.slack.com/img/api/homepage_custom_integrations-2x.png",
      "image_url": "http://i.imgur.com/OJkaVOI.jpg?1"
    },
    {
      "title": "Synopsis",
      "text": "After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy..."
    },
    {
      "fallback": "Would you recommend it to customers?",
      "title": "Would you recommend it to customers?",
      "callback_id": "comic_1234_xyz",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [
        {
          "name": "recommend",
          "text": "Recommend",
          "type": "button",
          "value": "recommend"
        },
        {
          "name": "no",
          "text": "No",
          "type": "button",
          "value": "bad"
        }
      ]
    }
  ]};
  bot.postMessageToGroup('random-lunch', 'Random Lunch Service Running.');
  // bot.postMessageToUser('nathanblank', 'hello bro!', params);
  // bot.postMessageToGroup('some-private-group', 'hello group chat!');
});
console.log("Posted spam!");

bot.on('message', function(msg){
  if(msg.type == 'message') {
    text = msg.text;
    // console.log(text.find("<@U1P11PZLH>"));
    if(text.startsWith("<@U1P11PZLH>") && (text.split(" ")[1] == "accept" || text.split(" ")[1] == "join")){
      if(lunchSession.users.indexOf(msg.user) == -1){
        lunchSession.users.push(msg.user)
        bot.postMessageToGroup('random-lunch', "Lunch invitation accepted. (do stuff here)");

      } else{
        bot.postMessageToGroup('random-lunch', "Lunch invitation already accepted.");
      }

      // TODO: send stuff to littlebits session
    }

    if(text.startsWith("<@U1P11PZLH>") && text.split(" ")[1] == "start"){
      if(!lunchSession.active){
        bot.postMessageToGroup('random-lunch', "Test Lunch session started.");
        lunchSession.active = true;
        lunchSession.users = [msg.user];
        var timer = setTimeout(function(){ // 5 minute timeout
          bot.postMessageToGroup('random-lunch', "Test Lunch session ended with " + lunchSession.users.length + " users");
          lunchSession.active = false;
        }, 1000*1*60);
      } else {
        bot.postMessageToGroup('random-lunch', "Test Lunch session alread active!. Tell me accept to join the session.");
      }
    }
    // console.log(msg.text);

  }
  return;
});



module.exports = app;
