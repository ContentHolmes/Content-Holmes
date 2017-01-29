"use strict";
var builder = require('botbuilder');
var request = require('request');
var botbuilder_azure = require("botbuilder-azure");

// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
// });

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

// var connector = new builder.ChatConnector({
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });
var bot = new builder.UniversalBot(connector);
// server.post('/api/messages', connector.listen());
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1a3b2f38-149f-4fb6-a60e-b106101431a6?subscription-key=0fefdf81ed3d4b87b94232d361daf8f0';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.onDefault(builder.DialogAction.send('I\'m not sure what you mean...'))
.matches('hi', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.send('Hey, I am Content Holmes a.k.a CH. I\'ll be your assistant with the app.');
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
    ])
.matches('profile', [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Okay! I made the changes %s :-)', session.userData.name);
    }
])
.matches('history', [
    function (session) {
        //Get request here
        request('http://mrigeshmadaan.com/app/rajat', function (error, response, body) {
            if (!error) {
                session.send("Connected!");
            }
        });
}])
.matches('aboutme', [
    function (session) {
        session.send("I am your own personal AI bot, capable of understanding normal human speech. You can ask me about -");
        session.send("1. Recent history of the browser");
        session.send("2. Depression profile of the user");
        session.send("3. Change your profile :-)");
        session.send("That's all for now %s, the game is on", session.userData.name);
    }
    ])
.matches('depressionscores', [
    function (session) {
        //Get request here
    }
    ]);

bot.dialog('/', intents);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'What can I call you?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.text(session, 'What\'s your child\'s name?');
    },
    function (session, results) {
        session.userData.child = results.response;
        session.endDialog();
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}