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
  robot.router.post('/hubot/slack-msg-callback', (req, res) => {
    var data = null;
	robot.logger.info("Body")
	robot.logger.info(req.body)

    if(req.body.payload) {
      try {
        data = JSON.parse(req.body.payload);
      } catch(e) {
        robot.logger.error("Invalid JSON submitted to Slack message callback");
        res
          .status(422)
          .send('You supplied invalid JSON to this endpoint.');
        return;
      }
    } else {
      robot.logger.error("Non-JSON submitted to Slack message callback");
      res
        .status(422)
        .send('You supplied invalid JSON to this endpoint.');
      return;
    }

    if(data.token === slackToken) {
      robot.logger.info("Request is good");
    } else {
      robot.logger.error("Token mismatch on Slack message callback");
      res
        .status(403)
        .send('You are not authorized to use this endpoint.');
      return;
    }

    var handled = robot.emit(`slack:msg_action:${data.callback_id}`, data, res);
    if (!handled) {
      res
        .status(500)
        .send('No scripts handled the action.');
    }
  });
};