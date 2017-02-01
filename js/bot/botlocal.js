"use strict";
var builder = require('botbuilder');
var request = require('request');
var restify = require('restify');
var botbuilder_azure = require("botbuilder-azure");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// var useEmulator = (process.env.NODE_ENV == 'development');

// var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
//     appId: process.env['MicrosoftAppId'],
//     appPassword: process.env['MicrosoftAppPassword'],
//     stateEndpoint: process.env['BotStateEndpoint'],
//     openIdMetadata: process.env['BotOpenIdMetadata']
// });

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1a3b2f38-149f-4fb6-a60e-b106101431a6?subscription-key=0fefdf81ed3d4b87b94232d361daf8f0';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.onDefault(builder.DialogAction.send('I\'m not sure what you mean...'))
.matches('hi', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.sendTyping();
            session.send('Hey, I am Content Holmes a.k.a CH. I\'ll be your assistant with the app.');
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.sendTyping();
        session.send('Hello %s!', session.userData.name);
    }
    ])
.matches('profile', [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.sendTyping();
        session.send('Okay! I made the changes %s :-)', session.userData.name);
    }
])
.matches('history', [
    function (session) {
        //Get request here
        session.sendTyping();
        session.send("I'll be able to access it once facebook approves me!");
}])
.matches('Report', [
    function(session,args,next) {
        if(!session.userData.email) {
            session.sendTyping();
            session.send("Your data is not available with me, let us go to the start :-)");
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function(session, response) {
        request('http://tfoxtrip.com/data/?email='+session.userData.email+'&password='+session.userData.password, function (error, response, body) {
            if (!error) {
                session.sendTyping();
                var res=JSON.parse(body);
                if(res.text.success==true) {
                    session.send("Report for %s - ", session.userData.child);
                    session.send("URLs -");
                    res.text.answers.history.URls.forEach(function(item,index) {
                        session.send(item.time+item.Url);
                    });
                    session.send("Depression Scores - ");
                    res.text.answers.history.depressionScores.forEach(function(item,index) {
                        session.send(item.time+item.score);
                    })
                } else {
                    session.send("Please be specific, your data is wrong. This doesn't help. Please \"Change your personal info\".");
                }
            }
        });
    }
    ])
.matches('aboutme', [
    function (session) {
        session.sendTyping();
        session.send("I am your own personal AI bot, capable of understanding normal human speech. You can ask me about -");
        session.send("1. Recent history of the browser");
        session.send("2. Depression profile of the user");
        session.send("3. Change your profile :-)");
        session.send("That's all for now %s, the game is on", session.userData.name);
    }
    ])
.matches('Name', [
    function (session) {
        session.sendTyping();
        session.send("I am Holmes. And I detect \'stuff\'. :-)");
    }
    ])
.matches('Age', [
    function (session) {
        session.sendTyping();
        session.send("Well, I first appeared in 1887 in Sir Doyle's works, but I was here long before that. I still have a knack for detective work depite my age :-P.");
    }
    ])
.matches('Location', [
    function (session) {
        session.sendTyping();
        session.send("The classic 221-B, Baker Street, London.");
    }
    ])
.matches('Language', [
    function (session) {
        session.sendTyping();
        session.send("I am proficient in many Languages known to man. Mastered to full capacity.");
    }
    ])
.matches('reality', [
    function (session) {
        session.sendTyping();
        session.send("Your questions amuse me %s. I once had a Doctor friend who asked such questions.", session.userData.name);
    }
    ])
.matches('depressionscores', [
    function (session) {
        //Get request here
        session.sendTyping();
        session.send("I'll be able to access it once facebook approves me!");
    }
    ]);

bot.dialog('/', intents);

bot.dialog('/profile', [
    function (session) {
        session.sendTyping();
        builder.Prompts.text(session, 'What can I call you?');
    },
    function (session, results) {
        session.sendTyping();
        session.userData.name = results.response;
        builder.Prompts.text(session, 'What\'s your child\'s name?');
    },
    function (session, results) {
        session.userData.child = results.response;
        session.sendTyping();
        builder.Prompts.text(session, 'Please give me your registered email id');
    },
    function (session,results) {
        session.userData.email = results.response;
        session.sendTyping();
        builder.Prompts.text(session, 'Please give me your password');
    },
    function (session, results) {
        session.userData.password = results.response;
        session.endDialog();
    }
]);

// if (useEmulator) {
//     var restify = require('restify');
//     var server = restify.createServer();
//     server.listen(3978, function() {
//         console.log('test bot endpont at http://localhost:3978/api/messages');
//     });
//     server.post('/api/messages', connector.listen());    
// } else {
//     module.exports = { default: connector.listen() }
// }