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
  robot.router.post('/slack/actions/', (req, res) => {
    var data = null;
	robot.logger.info("Body Of /slack/actions")
	robot.logger.info(req.body)
    res.status(200).end() // best practice to respond with empty 200 status code
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
	var message = "Default message"
	if(actionJSONPayload.actions[0].type == "static_select") {
		message = { "text": actionJSONPayload.user.name+" clicked ["+actionJSONPayload.actions[0].type+"]: "+actionJSONPayload.actions[0].name+" With Value: "+actionJSONPayload.actions[0].selected_option.value, "replace_original": false }
	} else if (actionJSONPayload.actions[0].type == "datepicker") {
		message = { "text": actionJSONPayload.user.name+" clicked ["+actionJSONPayload.actions[0].type+"]: "+actionJSONPayload.actions[0].name+" With Value: "+actionJSONPayload.actions[0].selected_date, "replace_original": false }
	} else if (actionJSONPayload.actions[0].type == "button") {
		message = { "text": actionJSONPayload.user.name+" clicked ["+actionJSONPayload.actions[0].type+"]: "+actionJSONPayload.actions[0].name+" With Value: "+actionJSONPayload.actions[0].value, "replace_original": false }
	}
	robot.logger.info("actionJSONPayload.response_url :" + actionJSONPayload.response_url)
    sendMessageToSlackResponseURL(actionJSONPayload.response_url, message)
});
};

