// VERY IMPORTANT! If you don't verify the token against the one on the app's
// Basic Info page, anyone can trigger these actions!

'use strict';

var slackToken = process.env.HUBOT_SLACK_VERIFY_TOKEN;

var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    }
    request(postOptions, (error, response, body) => {
        if (error){
            // handle errors as you see fit
        }
    })
}

module.exports = (robot) => {
  robot.router.post('/slack/eventsTemp/', (req, res) => {
    var data = null;
	robot.logger.info("Body Of /slack/eventsTemp")
	robot.logger.info(req.body)
    var reqBody = req.body
	if (reqBody.event != null) {
		robot.logger.info("Body Of /slack/eventsTemp")
	} else if (reqBody.challenge != null) {
		robot.logger.info("Sending Challenge")
		res.status(200).send(reqBody.challenge) // best practice to respond with empty 200 status code
	}
});
};