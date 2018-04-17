import json
import requests
from requests.adapters import HTTPAdapter
from urllib3 import Retry
from bs4 import BeautifulSoup

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

    print("STATUS", "Trying to connect Yahoo! Finance", sep="\t")
    try:
        r = session.get(most_active_url)
    except Exception:
        return
    else:
        print("STATUS", "Stablished connection", sep="\t")
    
    soup = BeautifulSoup(r.content, "html5lib")
    table = soup.find("div", {"id": "scr-res-table"})
    rows = table.findChildren(['tr'])
    
    symbols = dict()
    for row in rows[1:]:
        col = row.findChildren("td")
        symbols[col[0].text] = col[1].text
    return symbols

symbols = get_symbols()
if symbols is not None:
    print("RESULT", json.dumps(symbols, ensure_ascii=False), sep="\t")
else:
    print("ERROR", "Couldn't connect to Yahoo! Finance", sep="\t")