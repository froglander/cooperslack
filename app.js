var Slack = require('slack-node');
var express = require('express');
var url = require('url');
var app = express();


////////////// THE SETUP ///////////////////////////////////////////

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'))

app.get('/', function (request, response) {

    var urlObject = url.parse(request.url, true).query
    console.log(urlObject)
    sendMessage(urlObject);

}); //app.get


/////////////// THE SEND MESSAGE //////////////////////////////////////////

function sendMessage(urlObject) {

    slack = new Slack();
    slack.setWebhook(urlObject.response_url);

    //   /mySlashCommand catfish    'catfish' is stored in var userCommand
    var userText = urlObject.text;

    slack.webhook({
        channel: urlObject.channel_name,

        text: "hello you typed: " + userText + " length: " + userText.length                // the response back to slack

    }, function (err, response) {
        if (err) {
            console.log(err)
        }
    });
}

/////////////////////////////////////////////////////////
