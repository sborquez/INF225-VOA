import sys
from time import sleep
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
        print("ERROR","invalid arguments", err, sep="\t")
        return exit(1)

    # do different things according given arguments
    valoriser = Valoriser()

    #TODO download csv
    if args["download_path"] != None:
        print("STATUS", "starting download", args["name"])        
        args["csv"] =  valoriser.download(args["name"], args["code"], args["start"], args["end"], args["download_path"])
        print("STATUS", "download ended", args["csv"])        

    # load csv
    print("STATUS", "loading Csv", args["csv"])
    valoriser.load(args["csv"])
    if not valoriser.isLoaded():
        print("ERROR", "data not loaded", None)
        #exit(100)  TODO
    elif not valoriser.isValidData():
        print("STATUS", "cleaning data", None)    
        fixed = valoriser.cleanData()
        if not fixed:
            print("ERROR", "invalid csv format", args["csv"], sep="\t")
            #exit(101) TODO
    else:
        # evaluate
        print("STATUS", "loaded", args["csv"], sep="\t")
        filename = valoriser.generatePlot()
        print("STATUS", "plot generated", filename, sep="\t")

        print("STATUS", "starting simulation", None, sep="\t")
        # TEST
        value = valoriser.dummy_eval()
        print("STATUS", "simulation ended", value, sep="\t")
        print("RESULT", value, sep="\t")

        sys.stdout.flush()

if __name__ == '__main__':
    main()