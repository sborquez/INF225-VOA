import json
import requests
from requests.adapters import HTTPAdapter
from urllib3 import Retry
from bs4 import BeautifulSoup

from protocol import Protocol

def requests_retry_session(retries=3, backoff_factor=0.3, status_forcelist=(500, 502, 504)):
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def get_symbols():
    most_active_url = "https://finance.yahoo.com/most-active?offset=0&count=200"
    session = requests_retry_session()

    Protocol.sendStatus("Trying to connect Yahoo! Finance")

    try:
        r = session.get(most_active_url)
    except Exception:
        return
    else:
        Protocol.sendStatus("Stablished connection")
    
    soup = BeautifulSoup(r.content, "html5lib")
    table = soup.find("div", {"id": "scr-res-table"})
    rows = table.findChildren(['tr'])
    
    symbols = dict()
    for row in rows[1:]:
        col = row.findChildren("td")
        symbols[col[0].text] = col[1].text
    return symbols

def main():
    symbols = get_symbols()
    if symbols is not None:
        Protocol.sendResult(json.dumps(symbols, ensure_ascii=False))
    else:
        Protocol.sendError("Couldn't connect to Yahoo! Finance")

if __name__ == '__main__':
    main()