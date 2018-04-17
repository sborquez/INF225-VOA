import sys
from time import sleep
from valoriser import Valoriser

def parseArgs(args):
    new_args = {
        "csv"  :  None,
        "download_path": None,
        "name"  : None,
        "code"  : None,
        "r": None,
        "type": None,
        "start": None,
        "end":  None #one year #TODO cambia para el perido pedido por usario
        }
    for arg in args:
        if arg.startswith("--csv="):
            new_args["csv"] = arg.split("--csv=")[1]
        elif arg.startswith("--code="):
            new_args["code"] = arg.split("--code=")[1]
        elif arg.startswith("--name="):
            new_args["name"] = arg.split("--name=")[1]
        elif arg.startswith("--r="):
            new_args["r"] = arg.split("--r=")[1]
        elif arg.startswith("--type="):
            new_args["type"] = arg.split("--type=")[1]
        elif arg.startswith("--start="):
            new_args["start"] = arg.split("--start=")[1]
        elif arg.startswith("--end="):
            new_args["end"] = arg.split("--end=")[1]
        elif arg.startswith("--download_path="):
            new_args["download_path"] = arg.split("--download_path=")[1]
        #TODO agregar otros argumentos para la descarga, numero de simulaciones,...
    return new_args

def validateArgs(args):
    #TODO validar argumetos, retornar error
    return None

def main():
    args = parseArgs(sys.argv[1:])
    err = validateArgs(args)
    if err is not None:
        print("ERROR","argumentos invalidos", err, sep="\t")
        return exit(1)

    # Hacer diferentes cosas segun los argumentos dados
    valoriser = Valoriser()

    #TODO Descargar CSV
    #if args["download_path"] != None:
    #    args["csv"] =  valoriser.download(args["name"], args["code"], args["start"], args["end"], args["download_path"])

    # Cargar CSV
    print("STATUS", "Cargando CSV", args["csv"])
    valoriser.load(args["csv"])
    if not valoriser.isLoaded():
        print("ERROR", "Datos no cargados", None)
        #exit(100)  TODO
    elif not valoriser.isValidData():
        print("STATUS", "Limpiando datos", None)    
        fixed = valoriser.cleanData()
        if not fixed:
            print("ERROR", "Formato del CSV invalido", args["csv"], sep="\t")
            #exit(101) TODO
    else:
        # Evaluar
        print("STATUS", "Cargado", args["csv"], sep="\t")
        filename = valoriser.generatePlot()
        print("STATUS", "Grafico generado", filename, sep="\t")

        print("STATUS", "Comenzando a simulacion", None, sep="\t")
        # TEST
        value = valoriser.dummy_eval()
        print("STATUS", "Simulacion terminada", value, sep="\t")
        print("RESULT", value, sep="\t")

        sys.stdout.flush()

if __name__ == '__main__':
    main()