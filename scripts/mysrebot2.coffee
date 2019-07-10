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
	robot.hear /login/i, (res) ->
		robot.logger.info "Somebody called me with login"
		res.send "Hello How are you?"
		robot.adapter.client.web.chat.postMessage(res.message.room, "message content", {
			as_user: true,
			unfurl_links: false,
			attachments: [
				{
					title: 'a title',
					fallback: 'a fallback',
					title_link: 'http://example.com'
				}
			]
		})

	robot.hear /badger/i, (res) ->
		robot.logger.info "Somebody called me with badger"
		res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"
	