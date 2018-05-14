import datetime
import urllib
import csv

from protocol import Protocol

try:
    import pandas as pd
    import numpy as np
except ImportError:
    Protocol.sendError("Module not installed", "pandas")
    exit(0)

try:
    import matplotlib.pyplot as plt
except ImportError:
    Protocol.sendError("Module not installed", "matplotlib")
    exit(0)

TEMP_DATA_PATH="./"


class Prices(object):
    """
    Prices gets local or remote data, clean it and gets some statistic from the data.
    """

    def __init__(self):
        self.__loaded = False
        self.data = None
        self._volatility = None
        #self.roll_volatility = None

    def download(self, name, code, start, end, downloadPath):
        """
        download take arguments and download from Yahoo! the data, save
        them in the given path and returns the csv route.
        """
        cookier = urllib.request.HTTPCookieProcessor()
        opener = urllib.request.build_opener(cookier)
        urllib.request.install_opener(opener)

        # cookie and corresponding crumb
        _cookie = None
        _crumb = None

        # headers to fake a user agent
        _headers={
            'User-Agent': 'Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11'
        }

        # perform a Yahoo financial lookup on SP500
        req = urllib.request.Request('https://finance.yahoo.com/quote/^GSPC', headers=_headers)
        f = urllib.request.urlopen(req)
        alines = f.read().decode('utf-8')

        # extract the crumb from the response
        cs = alines.find('CrumbStore')
        cr = alines.find('crumb', cs + 10)
        cl = alines.find(':', cr + 5)
        q1 = alines.find('"', cl + 1)
        q2 = alines.find('"', q1 + 1)
        _crumb = alines[q1 + 1:q2]

        # extract the cookie from cookiejar

        for c in cookier.cookiejar:
            if c.domain != '.yahoo.com':
                continue
            if c.name != 'B':
                continue
            _cookie = c.value

        # print the cookie and crumb
        #print('Cookie:', _cookie)
        #print('Crumb:', _crumb)
        # prepare the parameters and the URL

        param = dict()
        param['period1'] = int(start)
        param['period2'] = int(end)
        param['interval'] = '1d'
        param['events'] = 'history'
        param['crumb'] = _crumb
        params = urllib.parse.urlencode(param)
        url = 'https://query1.finance.yahoo.com/v7/finance/download/{}?{}'.format(code, params)
        req = urllib.request.Request(url, headers=_headers)

        # perform the query
        # there is no need to enter the cookie here, as it is automatically handled by opener
        try:
            f = urllib.request.urlopen(req)
        except urllib.error.URLError as e:
            if hasattr(e,'code'):
                print (e.code)
            if hasattr(e,'reason'):
                print (e.reason)
            return False
        except urllib.error.HTTPError as e:
            if hasattr(e,'code'):
                print(e.code)
            if hasattr(e,'reason'):
                print(e.reason)
            print('HTTPError!!!')
            return False

        #urlopen(req)
        alines = f.read().decode('utf-8')

        #print(alines)
        holder = alines.split('\n')

        # generates csv filename
        filename = downloadPath + code + end + '.csv'

        # creates csv
        with open(filename, 'w') as csvfile:
            filewriter = csv.writer(csvfile, delimiter=',',
                                    quotechar='|', quoting=csv.QUOTE_MINIMAL)
            for line in holder:
                b = line.split(',')
                filewriter.writerow(b)
            return filename

    def load(self, csv_filepath):
        """
        load loads and reads csv file
        """
        try:
            self.data = pd.read_csv(csv_filepath)
            self.__loaded = True
        except Exception:
            if csv_filepath == "":
                Protocol.sendError("csv path empty")
            else:    
                Protocol.sendError("csv not found", csv_filepath)

    def isValidData(self):
        """
        isValidData verifies data integrity in csv, if valid use them for calculations.
        """
        if self.__loaded:
            #TODO check data
            return True
        else:
            return False

    def isLoaded(self):
        """
        isLoaded verifies if there are loaded data
        """
        return self.__loaded

    def cleanData(self):
        """ 
        cleanData removes incongruencies in data
        """
        #TODO
        pass
    
    def getLastPrice(self):
        """
        getLastPrice return the last closing price of the loaded data, otherwise return None
        """
        if  self.isLoaded and self.isValidData():
            return self.data["Close"].iloc[-1]
        
        return None

    def getPlot(self):
        """
        getPlot plots loaded data, saves image in predefines path
        """
        if not self.isLoaded:
            return

        data = self.data

        plt.figure(figsize=(20,10))

        # close
        plt.plot(data["Date"],data["Close"], "g", linewidth=5)
        # high and low
        plt.plot(data["Date"], data["High"], "r--", data["Low"], "b--", linewidth=2)
        

        # format axes #TODO
        #ax.yaxis.set_major_formatter(mticker.FormatStrFormatter('$%1.2f'))
        #ax.xaxis.set_major_formatter(mdates.DateFormatter('%d'))
        plt.gcf().autofmt_xdate()
        plt.grid()
        plt.ylabel('Valor $',  fontsize=24)
        plt.legend(["Close", "High", "Low"], prop={'size': 24})

        plt.tick_params(axis='both', which='major', labelsize=25)

        filename = TEMP_DATA_PATH + "plot_" + datetime.datetime.now().strftime("%y%m%d_%H%M%S") + ".png"
        plt.savefig(filename)
        return filename
    
    def getVolatility(self):
        """
        getVolatility evaluate data and retrives its volatility

        This method was taken from 'A Review of Volatility and Option Pricing' by Sovan Mitra, Section 3.2

        We can calculate the historical volatility (or sigma) of prices X using this

        sigma = sqrt(Vx)/sqrt(dt)

        where
        Vx is the sample variance 
            Vx = 1/(n-1) * SUM((Xi - MEAN(X))**2)

        Xi is calculated in all steps
            Xi = ln(X(t_{i})/ X(t_{i-1}))

        dt is the interval between to samples, we use one day
            dt = 1 day

        X(t_{i}) is a sample price.
        """
        if self._volatility == None:
            X = self.data["Close"]
            self._volatility = np.diff(np.log(X)).std() 
        return self._volatility