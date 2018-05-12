import sys
from time import sleep

from protocol import Protocol
from prices import Prices
from options import EuropeanOptionPricing, AmericanOptionPricing, DumbOptionPricing


##TODO ESTA SERA ELIMINADA
# Reemplazada por Protocol.reciveParams()    
def parseArgs(args):
    """
    parseArgs ...
    """

    # parsed_args 
    parsed_args = {
        "csv"  :  None,
        "download_path": None,
        "name"  : None,
        "code"  : None,
        "r": None,
        "type": None,
        "simulations": None,   #TODO using this to calculate I simulations.
        "strike_price": None,  #TODO change for user-defined strike price, in dollars maybe ?)
        "maturity_time": None,  #TODO change for user-defined period in days
        "start": None, # TODO delete this and use only maturity_time
        "end":  None # TODO delete this and use only maturity_time
    }
    
    for arg in args:
        if arg.startswith("--csv="):
            parsed_args["csv"] = arg.split("--csv=")[1]
        elif arg.startswith("--code="):
            parsed_args["code"] = arg.split("--code=")[1]
        elif arg.startswith("--name="):
            parsed_args["name"] = arg.split("--name=")[1]
        elif arg.startswith("--r="):
            parsed_args["r"] = arg.split("--r=")[1]
        elif arg.startswith("--type="):
            parsed_args["type"] = arg.split("--type=")[1]
        elif arg.startswith("--start="):
            parsed_args["start"] = arg.split("--start=")[1]
        elif arg.startswith("--end="):
            parsed_args["end"] = arg.split("--end=")[1]
        elif arg.startswith("--download_path="):
            parsed_args["download_path"] = arg.split("--download_path=")[1]
        elif arg.startswith("--simulations="):
            parsed_args["simulations"] = arg.split("--simulations=")[1]
        elif arg.startswith("--strike_price="):
            parsed_args["strike_price"] = arg.split("--strike_price=")[1]
        elif arg.startswith("--maturity_time="):
            parsed_args["maturity_time"] = arg.split("--maturity_time=")[1]
    return parsed_args

# TODO ESTA SERA ELIMINADA
# Reemplazada por Protocol.reciveParams()   
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
        Protocol.sendStatus("starting download", args["code"])
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

        Protocol.sendStatus("setting simulation params")

        # Initial price
        S0 = prices.getLastPrice()
        Protocol.sendStatus("setting initial price", S0)

        # Strike price
        #TEST --- TODO Agregar estos argumentos a la vista.
        K = args["strike_price"]
        Protocol.sendStatus("setting strike price", K)

        # Maturity time
        #TEST --- TODO Agregar estos argumentos a la vista.
        T = args["maturity_time"]
        Protocol.sendStatus("setting maturity time", T)
        
        # Simulations
        #TEST --- TODO Agregar estos argumentos a la vista.
        I = args["simulations"]
        Protocol.sendStatus("setting Monte Carlo simulations", I)
        
        # Riskless rate
        r = args["r"]
        Protocol.sendStatus("setting riskless rate", r)
        
        # Here we will price the option
        Protocol.sendStatus("starting simulation")
        
        # Calculate Volatility
        sigma = prices.getVolatility()
        Protocol.sendStatus("using volatility", sigma)

        # option is ...
        Protocol.sendStatus("using Dumb Option")
        option = DumbOptionPricing(S0, K, T, r, sigma, I)
        """
        # TODO fix algorithm
        if args["type"] == "EU":
            option = EuropeanOptionPricing(S0, K, T, r, sigma, I)
            Protocol.sendStatus("using European Option")
        elif args["type"] == "USA":
            option = AmericanOptionPricing(S0, K, T, r, sigma, I)
            Protocol.sendStatus("using American Option")            
        else:
            Protocol.sendError("wrong option type", args["type"])
            exit(1)
        """

        # TODO ONLY BUY CALL
        Protocol.sendStatus("getting call option")
        results = option.getCallOption()
        """
        if args["option"] == "call":
            Protocol.sendStatus("getting call option")        
            result = option.getCallOption()
            
        elif args["option"] == "pull":
            Protocol.sendStatus("getting pull option")        
            result = option.getPullOption()
        """
        Protocol.sendStatus("simulation ended")
        Protocol.sendResult(results)
        sys.stdout.flush()

if __name__ == '__main__':
    main()