# Description:
#   SRE Bot logic
#
# Dependencies:
#   None
#
# Configuration:
#   None
# 
# Commands:
#   hubot which is better[?] <text> or <text>?
#   hubot who is better[?] <text> or <text>?
#   hubot which is worse[?] <text> or <text>?
#   hubot who is worse[?] <text> or <text>?
#
# Author:
#   sheshikumar

module.exports = (robot) ->
	robot.hear /unusedlogout/i, (res) ->
		robot.logger.info "Somebody called me with logout"
		robot.adapter.client.web.chat.postMessage(res.message.room, "message content", {
			as_user: true,
			unfurl_links: false,
			attachments: [{
				blocks: [
					#blocks start here
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>"
						}
					},
					{
						"type": "image",
						"title": {
							"type": "plain_text",
							"text": "Example Image",
							"emoji": true
						},
						"image_url": "https://api.slack.com/img/blocks/bkb_template_images/goldengate.png",
						"alt_text": "Example Image"
					},
					{
						"type": "actions",
						"elements": [
							{
								"type": "button",
								"text": {
									"type": "plain_text",
									"text": "Button",
									"emoji": true
								},
								"value": "click_me_123"
							}
						]
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "Pick an item from the dropdown list"
						},
						"accessory": {
							"type": "static_select",
							"placeholder": {
								"type": "plain_text",
								"text": "Select an item",
								"emoji": true
							},
							"options": [
								{
									"text": {
										"type": "plain_text",
										"text": "Choice 1",
										"emoji": true
									},
									"value": "value-0"
								},
								{
									"text": {
										"type": "plain_text",
										"text": "Choice 2",
										"emoji": true
									},
									"value": "value-1"
								},
								{
									"text": {
										"type": "plain_text",
										"text": "Choice 3",
										"emoji": true
									},
									"value": "value-2"
								}
							]
						}
					},
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": "Pick a date for the deadline."
						},
						"accessory": {
							"type": "datepicker",
							"initial_date": "1990-04-28",
							"placeholder": {
								"type": "plain_text",
								"text": "Select a date",
								"emoji": true
							}
						}
					}
				]
			}]
		})

	robot.hear /badger/i, (res) ->
		robot.logger.info "Somebody called me with badger"
		res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"
	