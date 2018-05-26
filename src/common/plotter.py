from prices import Prices
from protocol import Protocol
from json import dumps

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
        columns = [["x"] + list(dates)]
        for name, value in prices.items():
            columns.append([[name] + list(value)])

        plot_data = {
            "bindto": '#prices',
            "data": {
                "x":"x",
                "columns" : columns
            }, 
            "axis": {
                "x": {
                    "type": 'timeseries',
                    "tick": {
                        "format": '%Y-%m-%d'
                    }
                }
            }
        }
        return dumps(plot_data)

    @staticmethod
    def dummyPlot():
        plot_data = {
                'bindto': '#prices',        
                'data': {
                    'columns': [
                        ['data1', 30, 200, 100, 400, 150, 250],
                        ['data2', 50, 20, 10, 40, 15, 25]
                        ]
                    }
            }
        return dumps(plot_data)

def main():
    netflix = Prices()
    netflix.load("../../test/data/NFLX.csv")
    json_plot = Plotter.timeSeries(netflix.data.Date, High=netflix.data.High , Low=netflix.data.Low, Close=netflix.data.Close)
    print(json_plot)

if __name__ == '__main__':
    main()