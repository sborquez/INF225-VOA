import os
import sys
import json
from time import sleep

from protocol import Protocol
from prices import Prices
from options import EuropeanOptionPricing, AmericanOptionPricing
from plotter import Plotter

def mkdir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)


def main():
    
    args, err = Protocol.receiveParameters(sys.argv[1:])
    if err:
        Protocol.sendError("invalid arguments", args)
        return 

    # prices will get the company's data
    prices = Prices()

    # Enter only if we will pricing with remote data
    if args["download_path"] != None:
        Protocol.sendStatus("starting download", args["code"])
        # Use this CSV file in the load step.
        mkdir(args["download_path"])
        args["filepath_data"] =  prices.download(args["code"], args["start"], args["end"], args["download_path"], "Yahoo")
        Protocol.sendStatus("download ended", args["filepath_data"])

    # Load a downloaded CSV file.
    Protocol.sendStatus("loading csv", args["filepath_data"])
    prices.load(args["filepath_data"])

    # Check if prices loaded the CSV correctly.
    if not prices.isLoaded():
        Protocol.sendError("data not loaded")
        return

    # Check if data doesn't have any invalid value
    elif not prices.isValidData():
        Protocol.sendStatus("cleaning data")
        # If there are any wrong value, try to fix it.
        fixed = prices.cleanData()

        # Otherwise, we can handle this data.
        if not fixed:
            Protocol.sendError("invalid csv format", args["filepath_data"])
            return 

    # Data is valid and is ready to process.
    else:
        Protocol.sendStatus("loaded", args["filepath_data"])
        
        # Plot the prices
        #filename = prices.getPlot()
        json_plot, _ = Plotter.timeSeries(prices.data.Date, High=prices.data.High , Low=prices.data.Low, Close=prices.data.Close)
        Protocol.sendStatus("plot generated", json_plot)

        Protocol.sendStatus("setting simulation params")

        # Initial price
        S0 = prices.getLastPrice()
        Protocol.sendStatus("setting initial price", S0)

        # Strike price
        K = float(args["strike_price"])
        Protocol.sendStatus("setting strike price", K)

        # Maturity time
        T = float(args["maturity_time"])
        Protocol.sendStatus("setting maturity time", T)
        
        # Simulations
        I = int(args["simulations"])
        Protocol.sendStatus("setting Monte Carlo simulations", I)
        
        # Riskless rate
        r = float(args["r"])
        Protocol.sendStatus("setting riskless rate", r)
        
        # Here we will price the option
        Protocol.sendStatus("starting simulation")
        
        # Calculate Volatility
        sigma = prices.getVolatility()
        Protocol.sendStatus("using volatility", sigma)

        # using the correct option type
        if args["option_type"] == "EU":
            option = EuropeanOptionPricing(S0, K, T, r, sigma, I)
            Protocol.sendStatus("using European Option")
        elif args["option_type"] == "USA":
            option = AmericanOptionPricing(S0, K, T, r, sigma, I)
            Protocol.sendStatus("using American Option")            
        else:
            # European is the default option
            Protocol.sendError("wrong option type", args["option_type"])
            option = EuropeanOptionPricing(S0, K, T, r, sigma, I)
            Protocol.sendStatus("using European Option")
            args["option_type"] = "EU"

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

        # Build result


        if args["option_type"] == "EU":
            result_data = {
                "type" : "EU",
                "result" : {
                    "payoff": results[0],
                    "price": results[1],
                }
            } 
        elif args["option_type"] == "USA":
            result_data = {
                "type" : "USA",
                "result" : {
                    "plot_data" :  Plotter.americanOption(list(results[1]),list(results[0]))[1]  
                }
            } 

        Protocol.sendResult(json.dumps(result_data))
        sys.stdout.flush()

if __name__ == '__main__':
    main()