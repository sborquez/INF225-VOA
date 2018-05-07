import numpy as np 
import pandas as pd

class OptionPricing(object):
    """
    OptionPricing is an abstract class of an European or American Option Pricing.
    """

    def __init__(self, S0, K, T, r, sigma, I):
        """
        S0   : initial price
        K    : strike price
        T    : time to maturity in days
        r    : riskless short rate
        sigma: volatility 
        I    : Number of simulations
        """
        self.initial_price = S0
        self.strike_price  = K
        self.time_to_maturity = T
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
            T = self.time_to_maturity
        if simulations == 0:
            simulations = self.I

        # if self.pc == 'call':
        #     calc[:,1] = mult*np.exp(np.sqrt((self.sigma**2)*self.T)*rand) - self.K
        # elif self.pc == 'put':
        #     calc[:,1] = self.K - mult*np.exp(np.sqrt((self.sigma**2)*self.T)*rand)
 
        # avg_po = np.sum(np.amax(calc, axis=1))/float(self.iterations)
 
        # return np.exp(-1.0*self.r*self.T)*avg_po

        # Get an array of random values X~N(0,1), it'll be used to generate the Monte Carlo simulations
        simulations = np.random.normal(0, 1, simulations)


        # The price simulated at time T, with risk less rate of r and a volatility sigma
        # S(t) = S(0) * exp((r - 0.5*sigma**2)*T  + sigma*X*sqrt(T))

        prices = self.initial_price*np.exp(T*(self.riskless_rate - 0.5*self.volatility**2) + self.volatility * (T**.5) * simulations)

        # prices can't be negative
        prices[prices < 0] = 0

        return prices

    def simulateTrajectories(self, steps=1, T=0, simulations=0):
        """
        simulateTrajectories generate I's Monte Carlo simulations of the price trajectories from T0 to T using time steps.
        If T is 0 we use the madurity time, if simulations is 0 we use the I.
        """
        
        if T == 0:
            T = self.time_to_maturity
        if simulations == 0:
            simulations = self.I

        # T is the vector of times steps, reshaped to a vertical vector.
        T = np.linspace(0, T, T//steps).reshape((T//steps, 1))

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
    #TODO    
    def getCallOption(self):
        raise NotImplementedError

    def getPullOption(self):
        raise NotImplementedError


class AmericanOptionPricing(OptionPricing): 
    #TODO   
    def getCallOption(self):
        raise NotImplementedError

    def getPullOption(self):
        raise NotImplementedError
