// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var routes = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', routes);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });
//
//
// module.exports = app;


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
  bot.postMessageToGroup('random-lunch', 'Hello channel!', params);
  bot.postMessageToUser('nathanblank', 'hello bro!');
  // bot.postMessageToGroup('some-private-group', 'hello group chat!');
});

bot.on('message', function(msg){
  console.log(msg)

});