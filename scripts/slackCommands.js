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
  robot.router.post('/slack/slash-commands/', (req, res) => {
    var data = null;
	robot.logger.info("Body Of /slack/slash-commands")
	robot.logger.info(req.body)
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
	var responseURL = reqBody.response_url
	var message = "Default message"
    if (reqBody.token != 'TOKSx3mvT1Vwew852dhiJ2LE'){
        res.status(403).end("Access forbidden")
    }else{
		if (reqBody.command == '/sendmebuttons') {
			robot.logger.info("In send me buttons")
			message = {
				"text": "This is your first interactive message sendmebuttons",
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
		} else if (reqBody.command == '/secondbuttons') {
			robot.logger.info("In second")
			message = {
				"text": "This is your first interactive message second buttons",
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
				"text": "This is your first interactive message Default",
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
		}
        sendMessageToSlackResponseURL(responseURL, message)
    }
});
};