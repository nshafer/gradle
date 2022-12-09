#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

from util import die

wordle_epoch = datetime(2021, 6, 19)
future_days = 14
date_format = "%Y-%m-%d"


def usage():
    return "Usage: python {} <source_directory> <target_file>".format(sys.argv[0])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        die(usage())

    source_dir = Path(sys.argv[1]).resolve()
    if not source_dir.is_dir():
        die("ERROR: source directory does not exist")
    print("Source:  {}".format(source_dir))

    target_file = Path(sys.argv[2]).resolve()
    print("Target:  {}".format(target_file))

    now = datetime.now()
    iter_days = (now - wordle_epoch).days + future_days
    all_days = [wordle_epoch + timedelta(days=n) for n in range(iter_days + 1)]

    # Parse all the files in the source directory
    words = {}
    files = os.listdir(source_dir)
    for filename in files:
        filepath = source_dir / filename
        if not filepath.is_file():
            continue

        with filepath.open() as f:
            data = json.load(f)

            words[data['print_date']] = data['solution']

    # Create a master word list
    word_list = []
    for day in all_days:
        day_str = day.strftime(date_format)
        if day_str not in words:
            words[day.strftime(date_format)] = "absen"
            print("WARNING: No answer found for {}".format(day_str))
        word_list.append(words[day_str])

    # Write the word list to the target file
    with target_file.open(mode='w') as f:
        json.dump(word_list, f)

    # Print summary
    print("Answers: {}".format(len(word_list)))
