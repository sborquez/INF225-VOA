def log_error(msg, err=None):
  print("ERROR", msg, err, sep='\t')

def log_status(msg, arg=None):
  print("STATUS", msg, arg, sep='\t')

def log_result(msg):
  print("RESULT", msg, sep='\t')