import numpy as np 
import pandas as pd

class OptionPricing(object):
    """
    OptionPricing is an abstract class of an European or American Option Pricing.
    """

    def __init__(self, S0, K, T, r, sigma, I):
        """
        S0  : initial price
        K   : strike price
        T   : time to maturity
        r   : riskless short rate
        s   : volatility 
        I   : Number of simulations
        """
        pass

    
class EuropeanOptionPricing(OptionPricing):
    pass

class AmericanOptionPricing(OptionPricing):
    pass