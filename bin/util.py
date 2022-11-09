import sys

import requests


def die(msg):
    print(msg)
    sys.exit(1)


def get(url):
    r = requests.get(url)
    r.raise_for_status()
    return r.text


def download_file(url, output_path):
    r = requests.get(url, stream=True)
    r.raise_for_status()
    with output_path.open(mode='wb') as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
