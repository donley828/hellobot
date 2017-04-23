// Add your requirements
var restify = require('restify'); 
var builder = require('botbuilder'); 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: 'ac5c0529-a240-44e5-905c-502ad47e7bf2', appPassword: 'OszipQkatbA4VMTUskLD4Ke' }); 
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
server.post('/api/messages', connector.listen());
server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
//Create model LUIS
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1811bd17-ffa1-4908-8b69-b85f0e41b53b?subscription-key=6d222998ce89474193b2ff0594d3cb9e&verbose=true&timezoneOffset=8.0&q=';
var recognizer = new builder.LuisRecognizer(model);


bot.dialog('/', intents);
intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);
intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

// Create bot dialogs
bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
