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
        plot_data = {}
        x = list(dates)
        for name, values in prices.items():
            plot_data[name] = {
                "x" : x,
                "y" : list(values)
            }
        return dumps(plot_data), plot_data

    @staticmethod
    def europeanOption(price, payoff):
        """
        var chart = c3.generate({
            size: {
                width: 350
            },
            data: {
                columns: [
                    ['data1', -2]
                ],
                type: 'bar',
                colors: {
                    data1: '#ff0000',
                },
                labels: {
        //            format: function (v, id, i, j) { return "Default Format"; },
                    format: {
                        data1: function (v, id, i, j) { return "$28 (" + v + ")"; },
                    }
                }
            },
            bar: {
                width: 200 // this makes bar width 100px
            },
            axis: {
                y: {
                    max: 2.2,
                    min: -2.2,
                    label: 'Payoff [USD]'
                }
            },
            grid: {
                y: {
                    lines: [
                        {value: 0}
                    ],
                    show:true
                }
            },
            legend: {
                show: false
            }
        });
        """
        pass

    @staticmethod
    def americanOption(prices, payoffs):
        """
var chart = c3.generate({
            zoom: {
                enabled: true
            },
            data: {
                x: 'x',
                columns: [
                    ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
                    ['price', 28, 42, 10, 40, 30, -5],
                    ['payoff', 0, 12, -20, 10, 0, -35]
                ],
                types: {
                    payoff: 'area-step'
                },
                axes: {
                    price: 'y',
                    payoff: 'y2'
                },
                colors: {
                    payoff: '#ff0000'
                },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
                },
                y: {
                    label: 'Price [USD]'
                },
                y2: {
                    show: true,
                    label: 'Payoff [USD]'
                }
            },
            grid: {
                y: {
                    lines: [
                        {value: 30, text: 'strike price', axis: 'y', position: 'start'},
                        {value: 0}
                    ],
                    show: true
                }
            }
        });
        """
        pass

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
    print(p1)