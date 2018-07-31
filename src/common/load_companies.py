from protocol import Protocol

try:
    from pandas import read_csv
    import json
    import os
except ImportError as err:
    Protocol.sendError("Module no installed", err.name)
    exit(0)

TICKET_FILE = "src/common/data/tickers.csv"
SIZE = 800

def main():
    companies = read_csv(os.path.join(os.path.abspath("."), TICKET_FILE), sep=";")[["symbol", "name"]].head(SIZE)
    Protocol.sendResult(json.dumps(list(companies.T.to_dict().values())))

if __name__ == '__main__':
    main()