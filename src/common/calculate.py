import sys
from time import sleep
from utils import log_error, log_result, log_status
from valoriser import Valoriser

def parseArgs(args):
    new_args = {
        "csv"  :  None,
        "download_path": None,
        "name"  : None,
        "code"  : None,
        "r": None,
        "type": None,
        "start": None,
        "end":  None #one year #TODO change for user-defined period
        }
    for arg in args:
        if arg.startswith("--csv="):
            new_args["csv"] = arg.split("--csv=")[1]
        elif arg.startswith("--code="):
            new_args["code"] = arg.split("--code=")[1]
        elif arg.startswith("--name="):
            new_args["name"] = arg.split("--name=")[1]
        elif arg.startswith("--r="):
            new_args["r"] = arg.split("--r=")[1]
        elif arg.startswith("--type="):
            new_args["type"] = arg.split("--type=")[1]
        elif arg.startswith("--start="):
            new_args["start"] = arg.split("--start=")[1]
        elif arg.startswith("--end="):
            new_args["end"] = arg.split("--end=")[1]
        elif arg.startswith("--download_path="):
            new_args["download_path"] = arg.split("--download_path=")[1]
        #TODO add other arguments for download, number of simulations...
    return new_args

def validateArgs(args):
    #TODO validate arguments, return error
    return None

def main():
    args = parseArgs(sys.argv[1:])
    err = validateArgs(args)
    if err is not None:
        log_error("invalid arguments", err)
        return exit(1)

    # do different things according given arguments
    valoriser = Valoriser()

    #TODO download csv
    if args["download_path"] != None:
        log_status("starting download", args["name"])
        args["csv"] =  valoriser.download(args["name"], args["code"], args["start"], args["end"], args["download_path"])
        log_status("download ended", args["csv"])

    # load csv
    log_status("loading Csv", args["csv"])
    valoriser.load(args["csv"])
    if not valoriser.isLoaded():
        log_error("data not loaded")
        #exit(100)  TODO
    elif not valoriser.isValidData():
        log_status("cleaning data")
        fixed = valoriser.cleanData()
        if not fixed:
            log_error("invalid csv format", args["csv"])
            #exit(101) TODO
    else:
        # evaluate
        log_status("loaded", args["csv"])
        filename = valoriser.generatePlot()
        log_status("plot generated", filename)

        log_status("starting simulation")
        # TEST
        value = valoriser.dummy_eval()
        log_status("simulation ended", value)
        log_result(value)

        sys.stdout.flush()

if __name__ == '__main__':
    main()