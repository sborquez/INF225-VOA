import pandas as pd
import matplotlib.pyplot as plt
import datetime
import urllib
import csv
import QuantLib as ql

TEMP_DATA_PATH="./"

class Valoriser(object):
    """
    Valoriser se encarga de obtener los datos desde fuentes externas o locales
    sanitisarlos y luego efectuar el calculo sobre ellos.
    """

    def __init__(self):
        self.__loaded = False
        self.data = None

    def download(self, name, code, start, end, downloadPath):
        """
        download toma los argumentos y descarga desde la página de Yahoo
        los datos correspondientes, los guarda en un el path dado y luego
        retorna la ruta de csv creado.
        """
        cookier = urllib.request.HTTPCookieProcessor()
        opener = urllib.request.build_opener(cookier)
        urllib.request.install_opener(opener)

        # Cookie and corresponding crumb
        _cookie = None
        _crumb = None

        # Headers to fake a user agent
        _headers={
            'User-Agent': 'Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11'
        }

        # Perform a Yahoo financial lookup on SP500
        req = urllib.request.Request('https://finance.yahoo.com/quote/^GSPC', headers=_headers)
        f = urllib.request.urlopen(req)
        alines = f.read().decode('utf-8')

        # Extract the crumb from the response
        cs = alines.find('CrumbStore')
        cr = alines.find('crumb', cs + 10)
        cl = alines.find(':', cr + 5)
        q1 = alines.find('"', cl + 1)
        q2 = alines.find('"', q1 + 1)
        _crumb = alines[q1 + 1:q2]

        # Extract the cookie from cookiejar

        for c in cookier.cookiejar:
            if c.domain != '.yahoo.com':
                continue
            if c.name != 'B':
                continue
            _cookie = c.value

        # Print the cookie and crumb
        #print('Cookie:', _cookie)
        #print('Crumb:', _crumb)
        # Prepare the parameters and the URL

        param = dict()
        param['period1'] = int(start)
        param['period2'] = int(end)
        param['interval'] = '1d'
        param['events'] = 'history'
        param['crumb'] = _crumb
        params = urllib.parse.urlencode(param)
        url = 'https://query1.finance.yahoo.com/v7/finance/download/{}?{}'.format(code, params)
        req = urllib.request.Request(url, headers=_headers)

            # Perform the query
            # There is no need to enter the cookie here, as it is automatically handled by opener
            #Agregado try y except debido a error 401 ocasional
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
            #Se genera el nombre del csv con la sigla y fechas indicada
        filename = downloadPath + code + end + '.csv'
            #Se crea el csv
        with open(filename, 'w') as csvfile:
            filewriter = csv.writer(csvfile, delimiter=',',
                                    quotechar='|', quoting=csv.QUOTE_MINIMAL)
            for line in holder:
                b = line.split(',')
                filewriter.writerow(b)
            return filename

    def load(self, csv_filepath):
        """
        load lee un archivo de csv y lo carga para un analisis posterior
        """
        try:
            self.data = pd.read_csv(csv_filepath)
            self.__loaded = True
        except Exception:
            if csv_filepath == "":
                print("ERROR", "Ruta a CSV vacia", None, sep="\t")
            else:    
                print("ERROR", "CSV no encontrado", csv_filepath, sep="\t")

    def isValidData(self):
        """
        isValidData verifica la integridad de los datos en el CSV, si son válidos para el cálculo.
        """
        if self.__loaded:
            #TODO revisar los datos
            return True
        else:
            return False

    def isLoaded(self):
        """
        isLoaded verifica si hay datos cargados.
        """
        return self.__loaded

    def cleanData(self):
        """ 
        cleanData elimina cualquier incongruencia en los datos.
        """
        #TODO
        pass

    def generatePlot(self):
        """
        generatePlot crea un plot de los datos cargados, guarda la imagen en una carpeta predeterminada.
        """
        if not self.isLoaded:
            return

        data = self.data

        plt.figure(figsize=(20,10))

        # Close
        plt.plot(data["Date"],data["Close"], "g", linewidth=5)
        # High y Low
        plt.plot(data["Date"], data["High"], "r--", data["Low"], "b--", linewidth=2)
        

        # Formatear ejes #TODO
        #ax.yaxis.set_major_formatter(mticker.FormatStrFormatter('$%1.2f'))
        #ax.xaxis.set_major_formatter(mdates.DateFormatter('%d'))
        plt.gcf().autofmt_xdate()
        plt.grid()
        plt.ylabel('Valor $',  fontsize=24)
        plt.legend(["Close", "High", "Low"], prop={'size': 24})

        plt.tick_params(axis='both', which='major', labelsize=22)

        filename = TEMP_DATA_PATH + "plot_" + datetime.datetime.now().strftime("%y%m%d_%H%M%S") + ".png"
        plt.savefig(filename)
        return filename


    def eval(self, r, optionType):
        """
        eval realiza el cálculo sobre los datos.
        """
        #TODO
        volatility = self.data["Close"].std()
        
        return volatility

    #TEST
    def dummy_eval(self):
        """
        dummy_eval realiza un cálculo simple sobre los datos.
        """
        return self.data["Close"].std()