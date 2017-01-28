var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});



var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1a3b2f38-149f-4fb6-a60e-b106101431a6?subscription-key=0fefdf81ed3d4b87b94232d361daf8f0';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.onDefault(builder.DialogAction.send('I\'m not sure what you mean...'));

intents.matches('hi', [
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
    ]);

intents.matches('profile', [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Okay! I made the changes %s :-)', session.userData.name);
    }
]);

intents.matches('history', [
	function (session) {
		//Get request here
		request('http://mrigeshmadaan.com/app/rajat', function (error, response, body) {
		    if (!error) {
		        session.send("Connected!");
		    }
		});
}]);
intents.matches('depressionscores', [
	function (session) {
		//Get request here
	}
	]);


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