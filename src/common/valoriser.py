import pandas as pd


class Valoriser(object):
    """
    Valoriser se encarga de obtener los datos desde fuentes externas o locales
    sanitisarlos y luego efectuar el calculo sobre ellos.
    """

    def __init__(self):
        self.__loaded = False

    def download(self, name, code, period, downloadPath):
        pass

    def load(self, csv_filepath):
        try:
            self.data = pd.read_csv(csv_filepath)
            self.__loaded = True
        except Exception:
            if csv_filepath == "":
                print("ERROR", "Ruta a CSV vacia", None)
            else:    
                print("ERROR", "CSV no encontrado", csv_filepath)

    def isValidData(self):
        if self.__loaded:
            return True
        return False

    def isLoaded(self):
        return self.__loaded

    def cleanData(self):
        return

    def eval(self):
        # This one is spooky
        pass

    def dummy_eval(self):
        # TEST
        return self.data["compra"].mean()