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
  robot.router.post('/slack/events/', (req, res) => {
    var data = null;
	robot.logger.info("Body Of /slack/events")
	robot.logger.info(req.body)
    var reqBody = req.body
	if (reqBody.event != null) {
		var responseURL = reqBody.response_url
		var message = "Default message"
		if (reqBody.token != 'TOKSx3mvT1Vwew852dhiJ2LE'){
			res.status(403).end("Access forbidden")
		}else{
			if (reqBody.event.type == 'app_mention') {
				robot.logger.info("App mention")
				message = {
					"text": "This is your first interactive message app_mention",
					"attachments": [
						{
							"text": "Building buttons is easy right?",
							"fallback": "Shame... buttons aren't supported in this land",
							"callback_id": "button_tutorial",
							"color": "#3AA3E3",
							"attachment_type": "default",
							"actions": [
								{
									"name": "yes",
									"text": "yes",
									"type": "button",
									"value": "yes"
								},
								{
									"name": "no",
									"text": "no",
									"type": "button",
									"value": "no"
								},
								{
									"name": "maybe",
									"text": "maybe",
									"type": "button",
									"value": "maybe",
									"style": "danger"
								}
							]
						}
					]
				}
			} else {
				robot.logger.info("In default section")
				message = {
					"text": "This is your first interactive message slack/events Default",
					"attachments": [
						{
							"text": "Building buttons is easy right?",
							"fallback": "Shame... buttons aren't supported in this land",
							"callback_id": "button_tutorial",
							"color": "#3AA3E3",
							"attachment_type": "default",
							"actions": [
								{
									"name": "yes",
									"text": "yes",
									"type": "button",
									"value": "yes"
								},
								{
									"name": "no",
									"text": "no",
									"type": "button",
									"value": "no"
								}
							]
						}
					]
				}
			}
			//sendMessageToSlackResponseURL(responseURL, message)
			robot.logger.info("Sending the below message: " + JSON.stringify(message))
			res.status(200).send(message)
		}
	} else if (reqBody.challenge != null) {
		robot.logger.info("Sending Challenge")
		res.status(200).send(reqBody.challenge) // best practice to respond with empty 200 status code
	}
});
};