#!/usr/bin/env python3

import re
import requests

from words import valid


def get(url):
    r = requests.get(url)
    r.raise_for_status()
    return r.text


# Parses a given JS script to find an array with the given words in it
def parse_array(script, words):
    words_re = r"[^\[\]]*".join(words)
    array_match = re.search(r'\[([^\[\]]*' + words_re + r'[^\[\]]*)\]', script)
    if array_match:
        words = array_match.group(1).split(",")
        return list(map(lambda w: w.strip(' \n\t"'), words))


def compare_arrays(name, a, b):
    a_set = set(a)
    b_set = set(b)

    removed_words = a_set.difference(b_set)
    added_words = b_set.difference(a_set)

    if removed_words:
        print("[{}] removed words: {}".format(name, removed_words))
    if added_words:
        print("[{}] added words: {}".format(name, added_words))


def main():
    page = get("https://www.nytimes.com/games/wordle/index.html")

    script_match = re.search(r'src="([^"]*wordle\.?[^"]*\.js[^"]*)', page)
    if script_match:
        script = get(script_match.group(1))
        js_valid = parse_array(script, ["arval", "kaugh", "tolar"])
        if not js_valid:
            print("Could not find valid words in script")
            return

        compare_arrays("valid", valid, js_valid)
    else:
        print("ERROR: could not find JS script")


if __name__ == "__main__":
    main()


