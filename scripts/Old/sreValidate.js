// Description:
//   SRE Bot logic
//
// Dependencies:
//   None
//
// Configuration:
//   None
// 
// Commands:
//   hubot which is better[?] <text> or <text>?
//   hubot who is better[?] <text> or <text>?
//   hubot which is worse[?] <text> or <text>?
//   hubot who is worse[?] <text> or <text>?
//
// Author:
//   sheshikumar

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const poolData = {    
UserPoolId : "us-east-1_GCLbICdBk", // Your user pool id here    
ClientId : "7agu46nelgv0ug52gtu3sshvj1" // Your client id here
}; 
const pool_region = 'us-east-1';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var userToken = "";

function Login(uname, pwd) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : uname,
        Password : pwd,
    });

    var userData = {
        Username : uname,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
			userToken = result.getAccessToken().getJwtToken();
            console.log('access token : ' + result.getAccessToken().getJwtToken());
            console.log('id token : ' + result.getIdToken().getJwtToken());
            console.log('refresh token : ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
			console.log('Error occured');
            console.log(err);
        },

    });
}

function ValidateToken(token) {
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
                    } else {
                        console.log("Valid Token.");
                        console.log(payload);
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
            }
        });
}

	var loginMessage = {
		"text": "This is your first interactive message sreValidate",
		"attachments": [
			{
				"text": "Building buttons is easy right?",
				"fallback": "Shame... buttons aren't supported in this land",
				"callback_id": "sreValidate",
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

module.exports = robot =>
	robot.hear(/validate (.*)/i, function(res) {
		console.log(res.match[0]);
		console.log(res.match[1]);
		token = res.match[1]
		robot.logger.info("Somebody called me with validate");
		ValidateToken(token);
		res.send(token);
	})
;