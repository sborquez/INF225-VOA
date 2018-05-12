from __future__ import print_function

import sys

class Protocol(object):
	"""
	Protocol is used to send messages to javascript's shell
	"""

	@staticmethod
	def sendError(msg, err=None):
		"""
		sendError send a error message to javascript's shell,
		the message can contain details of the error using 'err' argument. 
		"""
		print("ERROR", msg, err, sep='\t')
	
	@staticmethod
	def sendStatus(msg, arg=None):
		"""
		sendStatus send a partial results message to javascript's shell, 
		you can use 'arg' to add more information about the status.
		"""
		print("STATUS", msg, arg, sep='\t')
	
	@staticmethod
	def sendResult(msg):
		"""
		sendResult send a result message to javascript's shell.
		"""
		print("RESULT", msg, sep='\t')

Protocol.sendStatus("Interpreter path", sys.executable)

if sys.version_info < (3, 0):
    Protocol.sendError("Requires Python 3.x", sys.version_info.major)
    sys.exit(0)
