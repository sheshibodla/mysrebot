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

	robot.hear /badger/i, (res) ->
		robot.logger.info "Somebody called me with badger"
		res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"
	