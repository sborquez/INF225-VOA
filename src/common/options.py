from protocol import Protocol

try:
    import numpy as np
    import pandas as pd
except ImportError as err:
    Protocol.sendError("Module not installed", err.name)
    exit(0)


class OptionPricing(object):
    """
    OptionPricing is an abstract class of an European or American Option Pricing.
    """

    def __init__(self, S0, K, T, r, sigma, I):
        """
        S0   : initial price
        K    : strike price
        T    : time to maturity in years
        r    : riskless short rate
        sigma: volatility 
        I    : Number of simulations
        """
        self.initial_price = S0
        self.strike_price  = K
        self.maturity_time = T
        self.riskless_rate = r
        self.volatility  = sigma
        self.I = I

    def simulatePrices(self, T=0, simulations = 0):
        """
        simulatePrices generate I's Monte Carlo simulations of the price at T
        if T is 0 we use the madurity time.  
        if simulations is 0 we use the I
        """
        
        if T == 0:
            T = self.maturity_time

        if simulations == 0:
            simulations = self.I

        # Get an array of random values X~N(0,1), it'll be used to generate the Monte Carlo simulations
        simulations = np.random.normal(0, 1, simulations)

        # The price simulated at time T, with risk less rate of r and a volatility sigma
        # S(t) = S(0) * exp((r - 0.5*sigma**2)*T  + sigma*X*sqrt(T))
        prices = self.initial_price*np.exp(T*(self.riskless_rate - 0.5*self.volatility**2) + self.volatility * (T**.5) * simulations)

        # prices can't be negative
        prices[prices < 0] = 0

        return prices

    def simulateTrajectories(self, steps=10, T=0, simulations=0):
        """
        simulateTrajectories generate I's Monte Carlo simulations of the price trajectories from T0 to T using time steps.
        If T is 0 we use the madurity time, if simulations is 0 we use the I.
        """
        
        if T == 0:
            T = self.maturity_time
        if simulations == 0:
            simulations = self.I

        # T is the vector of times steps, reshaped to a vertical vector.
        T = np.linspace(0, T, steps + 2).reshape((steps + 2, 1))

        # Get a matrix of random values X~N(0,1), 
        # it'll be used to generate the Monte Carlo simulations at differents times.
        simulations = np.random.normal(0, 1, [T.size , simulations])
        
        # The price simulated at time T, with risk less rate of r and a volatility sigma
        # S(t) = S(0) * exp((r - 0.5*sigma**2)*T  + sigma*X*sqrt(T))
        prices = self.initial_price*np.exp(T*(self.riskless_rate - 0.5*self.volatility**2) + self.volatility * np.sqrt(T) * simulations)

        # prices can't be negative
        prices[prices < 0] = 0

        return prices

    def evaluate(self, right_type):
        """
        evaluate get the payoff of the call option or sell option at the given T
        """
        if right_type == "buy":
            return self.getCallOption()
        elif right_type == "sell":
            return self.getPullOption()
        else:
            raise ValueError

    def getCallOption(self):
        raise NotImplementedError

    def getPullOption(self):
        raise NotImplementedError


class EuropeanOptionPricing(OptionPricing):
    """
    EuropeanOptionPricing is european style option.
    A European option may be exercised only at the expiration
    date of the option, at a single pre-defined point in time T.
    """
    def getCallOption(self, recalculate=True):
        t = self.maturity_time
        if recalculate:
            self.prices = self.simulatePrices()
        payoff = np.mean(self.prices) - self.strike_price
        return np.exp(-1.0 * self.riskless_rate * t) * payoff, np.mean(self.prices)
        
    def getPullOption(self, recalculate=True):
        t = self.maturity_time     
        if recalculate:
            self.prices = self.simulatePrices()
        payoff = self.strike_price - np.mean(self.simulatePrices())
        return np.exp(-1.0 * self.riskless_rate * t) * payoff, np.mean(self.prices)


class AmericanOptionPricing(OptionPricing):
    """
    AmericanOptionPricing
    An American option may be exercised at any time before 
    the expiration date, that is from t in (0,T).
    """
    def getCallOption(self, steps=10, recalculate=True):
        T = np.linspace(0, 1, steps+2)*(self.maturity_time)
        if recalculate:
            self.prices = self.simulateTrajectories()
        payoff = np.mean(self.prices, axis=1) - self.strike_price
        return np.exp(-1.0 * self.riskless_rate * T) * payoff, np.mean(self.prices, axis=1)
        
    def getPullOption(self, steps=10, recalculate=True):
        T = np.linspace(0, 1, steps+2)*(self.maturity_time)
        if recalculate:
            self.prices = self.simulateTrajectories()
        payoff = self.strike_price - np.mean(self.prices, axis=1)
        return np.exp(-1.0 * self.riskless_rate * T) * payoff, np.mean(self.prices, axis=1)

if __name__ == "__main__":
    from prices import Prices
    netflix = Prices()
    netflix.load("../../test/data/NFLX.csv")
    S0 = netflix.getLastPrice()
    K = 310
    T = 0.08333
    r = 0.05
    sigma = netflix.getVolatility()
    I = 10
    european_option = EuropeanOptionPricing(S0, K, T, r, sigma, I)
    american_option = AmericanOptionPricing(S0, K, T, r, sigma, I)

    print("==Option Parameters==")
    print("Test data:", "../../test/data/NFLX.csv")
    print("Initial price:", S0)
    print("Strike price:", K)
    print("Maturity time:", T, "[year]")
    print("Volatility:", sigma)
    print("Simulation:", I)
    print()
    print("==Test European Option==")
    print("CALL")
    payoff, price = european_option.getCallOption()
    print("\tpayoff:", payoff)
    print("\testimated price:", price)

    print("PULL")
    payoff, price = european_option.getPullOption(recalculate=False)
    print("\tpayoff:", payoff)
    print("\testimated price:", price)

    print("==Test American Option==")
    print("CALL")
    payoff, price = american_option.getCallOption()
    print("payoff\testimated price")
    for i in range(len(payoff)):
        print(payoff[i], price[i], sep="\t")

    print("PULL")
    payoff, price = american_option.getPullOption(recalculate=False)
    print("payoff\testimated price")
    for i in range(len(payoff)):
        print(payoff[i], price[i], sep="\t")
    