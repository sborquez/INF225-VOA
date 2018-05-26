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
        columns = [['Date'] + list(dates)]
        for name, value in prices.items():
            columns.append([name] + list(value))
        
        plot_data = {
            'bindto': '#prices',
            'data': {
                'x':'Date',
                'columns' : columns
            }, 
            'axis': {
                'x': {
                    'type': 'timeseries',
                    'tick': {
                        'format': '%Y-%m-%d'
                    }

                },
                'y': {
                    'label': 'USD'
                }
            },
            'grid': {
                'y': {
                    'show': 'true'
                }
            },
            'zoom' : {
                'enabled': 'true'
            }
        }
        return dumps(plot_data), plot_data

    @staticmethod
    def dummyPlot():
        plot_data = {
            'bindto': '#prices',        
            'data': {
                'x': 'x',
                'columns': [
                    ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06', '2013-01-07', '2013-01-08', '2013-01-09', '2013-01-10', '2013-01-11', '2013-01-12', '2013-01-13', '2013-01-14', '2013-01-15', '2013-01-16', '2013-01-17', '2013-01-18', '2013-01-19', '2013-01-20', '2013-01-21', '2013-01-22', '2013-01-23', '2013-01-24'],
                    ['data1', 30.000123, 200.92123, 100.92123, 400.92123, 150.92123, 250.92123, 30.000123, 200.92123, 100.92123, 400.92123, 150.92123, 250.92123, 30.000123, 200.92123, 100.92123, 400.92123, 150.92123, 250.92123, 30.000123, 200.92123, 100.92123, 400.92123, 150.92123, 250.92123, 30.000123, 200.92123, 100.92123, 400.92123, 150.92123, 250.92123],
                    ['data2', 130.92123, 340.92123, 200.92123, 500.92123, 250.92123, 350.92123, 130.92123, 340.92123, 200.92123, 500.92123, 250.92123, 350.92123, 130.92123, 340.92123, 200.92123, 500.92123, 250.92123, 350.92123, 130.92123, 340.92123, 200.92123, 500.92123, 250.92123, 350.92123, 130.92123, 340.92123, 200.92123, 500.92123, 250.92123, 350.92123]
                ]
            },
            'axis': {
                'x': {
                    'type': 'timeseries',
                    'tick': {
                        'format': '%Y-%m-%d'
                    }
                }
            }
        }
        return dumps(plot_data), plot_data

if __name__ == '__main__':
    #main()
    netflix = Prices()
    netflix.load("../../test/data/NFLX.csv")
    p1, d1 = Plotter.timeSeries(netflix.data.Date, High=netflix.data.High , Low=netflix.data.Low, Close=netflix.data.Close)
    p2, d2 = Plotter.dummyPlot()
