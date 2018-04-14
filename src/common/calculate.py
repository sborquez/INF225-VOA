import sys

action_code = sys.argv[1]
action_name = sys.argv[2]

def valorize(action_code, action_name):
  #TODO implement this function
  not_implemented_log = "esta caracteristica aun no esta implementada, pero sus inputs fueron: {}, {}"
  return not_implemented_log.format(action_code, action_name)

print(str(valorize(action_code, action_name)))
sys.stdout.flush()