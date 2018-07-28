from __future__ import print_function

import sys

class Protocol(object):
	"""
	Protocol is used to comunication between javascript and python
	"""

	@staticmethod
	def receiveParameters(parameters):
		"""
		receiveParameters it is used to parse parameters using the 'defined_parameters' dict.
		"""

		# parameter: (type, optional, default, description)		
		defined_parameters = {\
			"filepath_data": (str, True , None, "path to csv file"),
			"download_path": (str, True , None, "path to download file"),
			"name"  : 	     (str, True, None, "company's name"),
			"code"  : 		 (str, False, None, "company's code"),
			"r": 			 (float, False, 0.05, "riskless rate"),
			"type":			 (str, False, "EU", "option type"),
			"simulations":   (int, False, 1000, "MonteCarlo simulations"),
			"strike_price":  (float, False, None, "strike price"),
			"maturity_time": (float, False, None, "days to buy or sell"),
			"start": 		 (int, False, None, "start"),
			"end":  		 (int, False, None, "end")
		}	
		
		# Parse input parameters
		parsed_params = {key:default for key, (_,_,default,_) in defined_parameters.items()}
		for param in parameters:
			if param.startswith("--") and len(param.split("=")) == 2:
				key, value = param[2:].split("=")
				parsed_params[key] = value
			else:
				return param, True
		

		# Validate input parameter
		for key, rule in defined_parameters.items():
			rule_type, rule_null, _, rule_desc = rule
			value = parsed_params[key]
			if value is None and not rule_null:
				return (key, value, rule_desc), True
			try:
				value = rule_type(value)
			except ValueError:
				return (key, value, rule_desc), True
				
		return parsed_params, False

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
