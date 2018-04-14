import pandas as pd


class Valoriser(object):
    """
    Valoriser se encarga de obtener los datos desde fuentes externas o locales
    sanitisarlos y luego efectuar el calculo sobre ellos.
    """

    def __init__(self):
        self.__loaded = False

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
                print("ERROR", "Ruta a CSV vacia", None)
            else:    
                print("ERROR", "CSV no encontrado", csv_filepath)

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
        return self.data["compra"].mean()