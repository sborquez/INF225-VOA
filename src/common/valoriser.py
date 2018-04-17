import pandas as pd
import matplotlib.pyplot as plt
import datetime


TEMP_DATA_PATH="./"

class Valoriser(object):
    """
    Valoriser se encarga de obtener los datos desde fuentes externas o locales
    sanitisarlos y luego efectuar el calculo sobre ellos.
    """

    def __init__(self):
        self.__loaded = False
        self.data = None

    def download(self, name, code, period, downloadPath):
        """
        download toma los argumentos y descarga desde la página de Yahoo
        los datos correspondientes, los guarda en un el path dado y luego
        retorna la ruta de csv creado.
        """
        pass

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

        plt.tick_params(axis='both', which='major', labelsize=25)

        filename = TEMP_DATA_PATH + "plot_" + datetime.datetime.now().strftime("%y%m%d_%H%M%S") + ".png"
        plt.savefig(filename)
        return filename


    def eval(self):
        # This one is spooky
        """
        eval realiza el cálculo sobre los datos.
        """
        #TODO
        pass

    #TEST
    def dummy_eval(self):
        """
        dummy_eval realiza un cálculo simple sobre los datos.
        """
        return self.data["Close"].mean()