#!/usr/bin/env python3
import re
from urllib.parse import urljoin

from util import die, get


def fetch_script(url, name):
    page = get(url)
    script_match = re.search(r'src="([^"]*' + name + '\.?[^"]*\.js[^"]*)', page)
    if not script_match:
        die("ERROR: could not find JS script")
    script_url = urljoin(url, script_match.group(1))
    return get(script_url)


# Parses a given JS script to find an array with the given words in it
def parse_array(script, words):
    not_brackets = r'[^\[\]]*'  # Match anything that isn't an open '[' or close ']' bracket

    # Match everything in between square brackets that includes the words given (in order). Works across lines.
    array_match = re.search(r'\[(' + not_brackets + not_brackets.join(words) + not_brackets + r')]', script)
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


if __name__ == "__main__":
    # Parse the words from the deployed site
    gradle_script = fetch_script("https://gradle.app/", "index")
    gradle_valid = parse_array(gradle_script, ["arval", "kaugh", "tolar"]) or die("ERROR: could not parse gradle words")

    # Parse the words from the live wordle source
    wordle_script = fetch_script("https://www.nytimes.com/games/wordle/index.html", "wordle")
    wordle_valid = parse_array(wordle_script, ["arval", "kaugh", "tolar"]) or die("ERROR: could not parse wordle words")

    compare_arrays("valid", gradle_valid, wordle_valid)


