import sys
from time import sleep
from valoriser import Valoriser

def parseArgs(args):
    return None

def main():
    args = parseArgs(sys.argv)
    valoriser = Valoriser()

    # hacer diferentes cosas segun los argumentos dados


    # TEST
    print("Dormire 5 segundos")
    sleep(5)
    print("Termine")
    sys.stdout.flush()

if __name__ == '__main__':
    main()