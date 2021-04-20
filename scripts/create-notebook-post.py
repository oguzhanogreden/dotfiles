from pathlib import Path
import sys
import shutil

filename = sys.argv[1]

import re

from datetime import datetime

now = datetime.now()
datestamp = now.strftime("%Y-%m-%d")

filename = f'{datestamp}-{filename}.md'
folder = Path(".", "_posts")
file = Path(folder, filename)

target_folder = Path(folder, 'notebook')
target_file =  Path(target_folder, filename)

def create_file():
    folder.mkdir(exist_ok=True)
    file.touch()

def move_file():
    target_folder.mkdir(exist_ok=True)
    file.rename(target_file)

if __name__ == "__main__":
    create_file()
    move_file()