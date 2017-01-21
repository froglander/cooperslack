var Slack = require('slack-node');
var express = require('express');
var axios = require('axios');
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
    var userText = urlObject.text.split(" ");


    var userCommand = userText[0];
    var userInput = userText[1];

    var responseText = "";

    switch (userCommand.toLowerCase()) {
        case "8ball":
            responseText = "The Magic 8 Ball says: " + eightBall();
            break;
        case "weather":
            //responseText = "Weather";

            // http://api.openweathermap.org/data/2.5/weather?zip=34715&appid=f747acb2d754a444965cf18e4f1eab22
            // axios.get('http://api.openweathermap.org/data/2.5/weather?zip=' + userInput + ',us&appid=f747acb2d754a444965cf18e4f1eab22', {
            axios.get('http://api.openweathermap.org/data/2.5/weather', {
                params: {
                    zip: userInput,
                    appid: "f747acb2d754a444965cf18e4f1eab22",
                    units: "imperial"
                }
            })
                .then(function (response) {
                    console.log("Weather response: ", response.data.weather);
                    console.log("Weather description: ", response.data.weather[0].description);
                    console.log("Weather temp: ", response.data.main.temp);

                    responseText = "The weather is " + response.data.weather[0].description + " and " + response.data.main.temp + " degrees fahrenheit";

                })
                .catch(function (error) {
                    console.log(error);
                });


            //"http://api.openweathermap.org/data/2.5/weather?zip=" + "userInput" + ",us&appid=f747acb2d754a444965cf18e4f1eab22"

            break;
        default:
            responseText = "You need to choose an option! [8ball, weather]";
    }


    slack.webhook({
        channel: urlObject.channel_name,

        text: responseText

    }, function (err, response) {
        if (err) {
            console.log(err)
        }
    });
}

/////////////////////////////////////////////////////////

function eightBall() {
    var responseArray = [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes, definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Yes",
        "Signs point to yes",
        "Reply hazy try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful"
    ]

    var randResponse = Math.floor(Math.random() * responseArray.length);

    return responseArray[randResponse];
}
