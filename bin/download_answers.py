#!/usr/bin/env python3
import json
import random
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

from util import die, download_file

wordle_epoch = datetime(2021, 6, 19)
future_days = 14
date_format = "%Y-%m-%d"
sleep_between_requests = True

# dev
# wordle_epoch = datetime(2022, 12, 1)
# future_days = 5
# sleep_between_requests = False

def usage():
    return "Usage: python {} <output_directory>".format(sys.argv[0])


if __name__ == "__main__":
    if len(sys.argv) != 2:
        die(usage())

    output_dir = Path(sys.argv[1]).resolve()
    if not output_dir.is_dir():
        die("ERROR: output directory does not exist")
    print("Output:   {}".format(output_dir))

    now = datetime.now()
    iter_days = (now - wordle_epoch).days + future_days
    all_days = [wordle_epoch + timedelta(days=n) for n in range(iter_days+1)]

    files_downloaded = 0
    for day in all_days:
        day_filename = "{}.json".format(day.strftime(date_format))
        day_filepath = output_dir / day_filename
        day_fileexists = day_filepath.is_file()
        # print("Checking {}: {} ({})".format(day.strftime(date_format), day_filepath, day_fileexists))

        # Only download the file if it's for today or later, or doesn't exist
        if day.date() >= now.date() or not day_fileexists:
            if sleep_between_requests and files_downloaded > 0:
                # Sleep for a random time between 0 and 3 seconds so NYT doesn't block us
                time.sleep(random.uniform(0, 3))

            print("Download: {}".format(day.strftime(date_format)))
            source_file = "https://www.nytimes.com/svc/wordle/v2/{}.json".format(day.strftime(date_format))

            # If we already have the file, download it to ".json.new" temporarily, so we can compare
            if day_fileexists:
                dest_file = day_filepath.with_suffix(".json.new")
            else:
                dest_file = day_filepath

            download_file(source_file, dest_file)
            files_downloaded += 1

            # Compare the new and old files
            if dest_file != day_filepath:
                if day_filepath.is_file():
                    with day_filepath.open('r') as old_file:
                        with dest_file.open('r') as new_file:
                            old_json = json.load(old_file)
                            new_json = json.load(new_file)
                            if old_json.get('solution') != new_json.get('solution'):
                                print("WARNING: solution changed for {} from '{}' to '{}'".format(
                                    day.strftime(date_format), old_json.get('solution'), new_json.get('solution')))
                                # Copy the new file over the old so we're updated
                                dest_file.rename(day_filepath)
                            else:
                                # No changes, delete the new file
                                dest_file.unlink()
                else:
                    # print("No old file, moving new file to {}".format(day_filepath))
                    dest_file.rename(day_filepath)

    # Summarize how many files are downloaded and what date range
    print("Start:    {}".format(all_days[0].strftime(date_format)))
    print("End:      {}".format(all_days[-1].strftime(date_format)))
    print("Answers:  {}".format(len(all_days)))
