// VERY IMPORTANT! If you don't verify the token against the one on the app's
// Basic Info page, anyone can trigger these actions!

'use strict';

var slackVerifyToken = process.env.HUBOT_SLACK_VERIFY_TOKEN;
var slackToken = process.env.HUBOT_SLACK_TOKEN;

var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
global.navigator = require('web-midi-api');

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {    
UserPoolId : "us-east-1_GCLbICdBk", // Your user pool id here    
ClientId : "7agu46nelgv0ug52gtu3sshvj1" // Your client id here
}; 
const pool_region = 'us-east-1';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var userToken = null

function Login(uname, pwd, callback) {

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : uname,
        Password : pwd,
    });

    var userData = {
        Username : uname,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	userToken = null;
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
			userToken = result.getAccessToken().getJwtToken();
            console.log('access token : ' + result.getAccessToken().getJwtToken());
            console.log('userToken : ' + userToken);
            //console.log('id token : ' + result.getIdToken().getJwtToken());
            //console.log('refresh token : ' + result.getRefreshToken().getToken());
			callback(true);
        },
        onFailure: function(err) {
			userToken = null;
			console.log('Error occured');
            console.log(err);
			callback(false);
        },

    });
}

function ValidateToken(token) {
	var result = "Processing error"
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    return;
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
						result = "Invalid Token.";
                    } else {
                        console.log("Valid Token.");
                        console.log(payload);
						result = "Valid Token.";
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
            }
        });
	return result;
}

function postMessageAsJSON(responseURL, message){
	console.log('Posting to :', responseURL);
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        },
        json: message
    }
    request(postOptions, (error, response, body) => {
		console.log('error:', error);
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', body); // Print the HTML for the Google homepage.
        if (error){
            // handle errors as you see fit
			console.log('error:', error);
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.
        }
    })
}

function postMessage(responseURL, message){
	console.log('Posting to :', responseURL);
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=utf-8',
        },
        body: message
    }
    request(postOptions, (error, response, body) => {
		console.log('error:', error);
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', body); // Print the HTML for the Google homepage.
        if (error){
            // handle errors as you see fit
			console.log('error:', error);
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.
        }
    })
}

function postSlackMessage(responseURL, message){
	console.log('Posting to :', responseURL);
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=utf-8',
			'Authorization': 'Bearer ' + slackToken
        },
        body: message
    }
    request(postOptions, (error, response, body) => {
		console.log('error:', error);
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', body); // Print the HTML for the Google homepage.
        if (error){
            // handle errors as you see fit
			console.log('error:', error);
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			console.log('body:', body); // Print the HTML for the Google homepage.
        }
    })
}

module.exports = (robot) => {
  robot.router.post('/slack/actions/', (req, res) => {
    var data = null;
	var message = "Default message"
	robot.logger.info("Body Of /slack/actions")
	robot.logger.info(req.body)
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqPaylod = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
	robot.logger.info("reqPaylod.callback_id :" + reqPaylod.callback_id)
	robot.logger.info("reqPaylod.response_url :" + reqPaylod.response_url)
	robot.logger.info("reqPaylod.trigger_id :" + reqPaylod.trigger_id)

	if (reqPaylod.type == "interactive_message") {
		if(reqPaylod.actions[0].type == "static_select") {
			message = { "text": reqPaylod.user.name+" clicked ["+reqPaylod.actions[0].type+"]: "+reqPaylod.actions[0].name+" With Value: "+reqPaylod.actions[0].selected_option.value, "replace_original": false }
		} else if (reqPaylod.actions[0].type == "datepicker") {
			message = { "text": reqPaylod.user.name+" clicked ["+reqPaylod.actions[0].type+"]: "+reqPaylod.actions[0].name+" With Value: "+reqPaylod.actions[0].selected_date, "replace_original": false }
		} else if (reqPaylod.actions[0].type == "button") {
			message = { "text": reqPaylod.user.name+" clicked ["+reqPaylod.actions[0].type+"]: "+reqPaylod.actions[0].name+" With Value: "+reqPaylod.actions[0].value, "replace_original": false }
		}
		robot.logger.info("reqPaylod.response_url :" + reqPaylod.response_url)
		robot.logger.info("reqPaylod.trigger_id :" + reqPaylod.trigger_id)
		postMessageAsJSON(reqPaylod.response_url, message)

		if(reqPaylod.callback_id == "sreLogin") {
			if (reqPaylod.actions[0].value == "yes") {
				robot.logger.info("sreLogin-Yes")
				// now show the dialog
				message = '{"trigger_id": "' + reqPaylod.trigger_id + '", "dialog": { "callback_id": "sreLoginDialog", "title": "Sre Login", "submit_label": "Login", "notify_on_cancel": true, "state": "Limo", "elements": [{"type": "text", "label": "Username", "name": "username" }, { "type": "text", "label": "Password", "name": "password"}]}}'
				postSlackMessage("https://slack.com/api/dialog.open", message)
			} else if (reqPaylod.actions[0].value == "no") {
				robot.logger.info("sreLogin-No")
			} else if (reqPaylod.actions[0].value == "maybe") {
				robot.logger.info("sreLogin-MayBe")
			} else {
				robot.logger.info("sreLogin-Default")
			}
		}
	} else if (reqPaylod.type == "dialog_submission") {
		if (reqPaylod.callback_id == "sreLoginDialog") {
			robot.logger.info("reqPaylod.submission.username :" + reqPaylod.submission.username)
			robot.logger.info("reqPaylod.submission.password :" + reqPaylod.submission.password)
			Login(reqPaylod.submission.username, reqPaylod.submission.password, 
				function(status) { 
					if (status) {
						robot.messageRoom(reqPaylod.channel.id, "Success: Username: " + reqPaylod.submission.username + " has successfully logged in")
					} else {
						robot.messageRoom(reqPaylod.channel.id, "Failure: Username: " + reqPaylod.submission.username + " could not log in")
					}
				});
		} else {
			robot.logger.info("Dialog submission unknown callback_id :" + reqPaylod.callback_id)
		}
	} else if (reqPaylod.type == "dialog_cancellation") {
		robot.logger.info("Payload type : dialog_cancellation")
	} else if (reqPaylod.type == "block_actions") {
		robot.logger.info("Payload type : block_actions")
	} else {
		robot.logger.info("Unknown Payload type")
	}
  });
};

