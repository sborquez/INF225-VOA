import sys
from time import sleep
from protocol import Protocol
from prices import Prices
from options import EuropeanOptionPricing, AmericanOptionPricing

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
        Protocol.sendError("invalid arguments", err)
        exit(1)

    # prices will get the company's data
    prices = Prices()

    # Enter only if we will pricing with remote data
    if args["download_path"] != None:
        Protocol.sendStatus("starting download", args["name"])
        # Use this CSV file in the load step.
        args["csv"] =  prices.download(args["name"], args["code"], args["start"], args["end"], args["download_path"])
        Protocol.sendStatus("download ended", args["csv"])

    # Load a downloaded CSV file.
    Protocol.sendStatus("loading csv", args["csv"])
    prices.load(args["csv"])

    # Check if prices loaded the CSV correctly.
    if not prices.isLoaded():
        Protocol.sendError("data not loaded")
        #exit(100)  TODO

    # Check if data doesn't have any invalid value
    elif not prices.isValidData():
        Protocol.sendStatus("cleaning data")
        # If there are any wrong value, try to fix it.
        fixed = prices.cleanData()

        # Otherwise, we can handle this data.
        if not fixed:
            Protocol.sendError("invalid csv format", args["csv"])
            #exit(101) TODO

    # Data is valid and is ready to process.
    else:
        Protocol.sendStatus("loaded", args["csv"])
        
        # Plot the prices
        filename = prices.getPlot()
        Protocol.sendStatus("plot generated", filename)

        # Here we will price the option
        Protocol.sendStatus("starting simulation")
        volatility = prices.getVolatility()
        #value = prices.dummy_eval()
        Protocol.sendStatus("simulation ended", volatility)
        #Protocol.sendStatus("simulation ended", value)
        Protocol.sendResult(volatility)

        sys.stdout.flush()

if __name__ == '__main__':
    main()