#!/usr/bin/env python3
import json
import random
import re
import sys
import time
from datetime import datetime, timedelta, date
from pathlib import Path

from util import die, download_file

wordle_epoch = date(2021, 6, 19)
future_days = 14
date_format = "%Y-%m-%d"
sleep_between_requests = True

today = date.today()
iter_days = (today - wordle_epoch).days + future_days
all_days = [wordle_epoch + timedelta(days=n) for n in range(iter_days + 1)]

# dev
# wordle_epoch = datetime(2022, 12, 1)
# future_days = 5
# sleep_between_requests = False


def usage():
    return "Usage: python {} <output_directory>".format(sys.argv[0])


def output(prefix, msg):
    if not prefix.endswith(":"):
        prefix += ":"
    print("{:<12} {}".format(prefix, msg))


def download_answers(output_dir):
    files_downloaded = 0
    for day in all_days:
        day_filename = "{}.json".format(day.strftime(date_format))
        day_filepath = output_dir / day_filename
        day_fileexists = day_filepath.is_file()
        # print("Checking {}: {} ({})".format(day.strftime(date_format), day_filepath, day_fileexists))

        # Only download the file if it's for today or later, or doesn't exist
        if day >= today or not day_fileexists:
            if sleep_between_requests and files_downloaded > 0:
                # Sleep for a random time between 0 and 3 seconds so NYT doesn't block us
                time.sleep(random.uniform(0, 3))

            output("Download", day.strftime(date_format))
            source_file = "https://www.nytimes.com/svc/wordle/v2/{}.json".format(day.strftime(date_format))

            # If we already have the file, download it to ".json.new" temporarily, so we can compare
            if day_fileexists:
                dest_file = day_filepath.with_suffix(".json.new")
            else:
                dest_file = day_filepath

            try:
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
            except Exception as e:
                print("ERROR: Could not download {} to {}: {}".format(source_file, dest_file, e))

    output("Downloaded", files_downloaded)


def read_answers(source_dir):
    if not source_dir.is_dir():
        return None

    words = {}
    word_file_re = re.compile(r"(\d{4}-\d{2}-\d{2}).json")
    for word_file in source_dir.iterdir():
        if not word_file.is_file():
            continue

        if not word_file_re.match(word_file.name):
            continue

        with word_file.open('r') as f:
            data = json.load(f)
            words[data['print_date']] = data['solution']
    return words


def write_all_file(words, output_dir):
    target_file = output_dir / "all.json"

    # Write the word list to the target file
    with target_file.open(mode='w') as f:
        json.dump(words, f)

    # Print summary
    output("all.json", len(words))


def write_list_file(words, output_dir):
    target_file = output_dir / "list.json"

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
    output("list.json", len(word_list))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        die(usage())

    output_dir = Path(sys.argv[1]).resolve()
    if not output_dir.is_dir():
        die("ERROR: output directory does not exist")
    output("Output", output_dir)

    # Summarize how many answers we're dealing with
    output("Start", all_days[0].strftime(date_format))
    output("End", all_days[-1].strftime(date_format))
    output("Answers", len(all_days))

    # Download answers for the next X days
    download_answers(output_dir)

    # Parse all the files in the source directory
    words = read_answers(output_dir)
    if words is None:
        die("ERROR: no answers found in source directory")

    # Output rollup files
    write_all_file(words, output_dir)
    write_list_file(words, output_dir)

