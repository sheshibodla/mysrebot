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

	var loginMessage = {
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

module.exports = robot =>
	robot.hear(/login/i, function(res) {
		robot.logger.info("Somebody called me with login");
		res.send(loginMessage);
	})
;