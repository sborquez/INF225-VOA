from prices import Prices
from protocol import Protocol
from json import dumps

import datetime as dt

class Plotter(object):
    """
    Plotter can generate differtent types of plot and send them to electron.
    """

    @staticmethod
    def timeSeries(dates, **prices):
        """
        timeSeries use dates as x axis and uses prices as y values.
        dates and values are pd.Series
        """
        plot_data = {}
        x = list(dates)
        for name, values in prices.items():
            plot_data[name] = {
                "x" : x,
                "y" : list(values)
            }
        return dumps(plot_data), plot_data

    @staticmethod
    def americanOption(prices, payoff):
        base = dt.datetime.today()
        date_list = [base + dt.timedelta(days=x) for x in range(1,1 + len(prices))]
        dates = [ dt.datetime.strftime(date, "%Y-%m-%d") for date in date_list]
        plot_data = {
            "prices" :{
                "x": dates,
                "y": prices
            },
            "payoff" : {
                "x": dates,
                "y": payoff
            }
        }
        return dumps(plot_data), plot_data

    @staticmethod
    def europeanOption(price, payoff):
        """
        """
        pass

if __name__ == '__main__':
    #main()
    netflix = Prices()
    netflix.load("../../test/data/NFLX.csv")
    p1, d1 = Plotter.timeSeries(netflix.data.Date, High=netflix.data.High , Low=netflix.data.Low, Close=netflix.data.Close)
    print(p1)