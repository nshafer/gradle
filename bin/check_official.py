#!/usr/bin/env python3

import re
import sys

import requests


def get(url):
    r = requests.get(url)
    r.raise_for_status()
    return r.text


# Parses a given JS script to find an array with the given words in it
def parse_array(script, words):
    not_brackets = r'[^\[\]]*'  # Match anything that isn't an open '[' or close ']' bracket

    # Match everything in between square brackets that includes the words given (in order). Works across lines.
    array_match = re.search(r'\[(' + not_brackets + not_brackets.join(words) + not_brackets + r')\]', script)
    if array_match:
        # Split the raw string of words separated by commas into an array and strip all whitespace and quotes
        words = array_match.group(1).split(",")
        return list(map(lambda w: w.strip(' \n\t"\''), words))


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
    if len(sys.argv) != 2:
        usage()
        sys.exit(1)

    # Parse the words from the deployed words.ts file
    reference = sys.argv[1]
    with open(reference) as f:
        valid = parse_array(f.read(), ["arval", "kaugh", "tolar"])
    if not valid:
        print("Failed to parse words from reference file")
        sys.exit(1)

    # Parse the words from the live wordle source
    page = get("https://www.nytimes.com/games/wordle/index.html")
    script_match = re.search(r'src="([^"]*wordle\.?[^"]*\.js[^"]*)', page)
    if script_match:
        script = get(script_match.group(1))
        js_valid = parse_array(script, ["arval", "kaugh", "tolar"])
        if not js_valid:
            print("Could not find valid words in script")
            sys.exit(1)

        compare_arrays("valid", valid, js_valid)
    else:
        print("ERROR: could not find JS script")
        sys.exit(1)

def usage():
    print("Usage: {} <path/to/words.ts>".format(sys.argv[0]))


if __name__ == "__main__":
    main()


