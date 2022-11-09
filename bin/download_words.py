#!/usr/bin/env python3
import random
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

from util import die, download_file

wordle_epoch = datetime(2021, 6, 19)
# wordle_epoch = datetime(2022, 11, 1)
date_format = "%Y-%m-%d"


def usage():
    return "Usage: python download_words.py <output_directory>"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        die(usage())

    output_dir = Path(sys.argv[1])
    if not output_dir.is_dir():
        die("ERROR: output directory does not exist")
    output_dir.resolve()

    print("Downloading words to {}".format(output_dir))

    now = datetime.now()
    iter_days = (now - wordle_epoch).days + 2  # +2 to include tomorrow and the day after
    all_days = [wordle_epoch + timedelta(days=n) for n in range(iter_days+1)]

    files_downloaded = 0
    for day in all_days:
        day_filename = "{}.json".format(day.strftime(date_format))
        day_filepath = output_dir / day_filename
        day_fileexists = day_filepath.is_file()
        print("Checking {}: {} ({})".format(day.strftime(date_format), day_filepath, day_fileexists))

        # Only download the file if it's for today or later, or doesn't exist
        if day.date() >= now.date() or not day_fileexists:
            if files_downloaded > 0:
                # Sleep for a random time between 0 and 3 seconds so NYT doesn't block us
                time.sleep(random.uniform(0, 3))

            print("Downloading {}".format(day.strftime(date_format)))
            source_file = "https://www.nytimes.com/svc/wordle/v2/{}.json".format(day.strftime(date_format))
            download_file(source_file, day_filepath)
            files_downloaded += 1

