# This script can be used to generate the icons javascript file
# It depends on "convert" and "potrace" commands

import re
import os
import sys
import glob
import shutil
import pathlib
import xml.etree.ElementTree as ET
from subprocess import Popen

def shell(*args): assert Popen(args, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr).wait() == 0
def convert(*args): shell('convert', *args)
def potrace(*args): shell('potrace', *args)

tag_re = re.compile(r'(\{[^\}]+?\})?(.+?)')
translate_re = re.compile(r'translate\((-?\d+\.\d+)([ ,])(-?\d+\.\d+)\)')
scale_re = re.compile(r'scale\((-?\d+\.\d+)([ ,])(-?\d+\.\d+)\)')
pair_re = re.compile(r'(-?(\d+\.)?\d+?)([ ,])(-?(\d+\.)?\d+?)')

def one_and_only(it):
  ret = next(it)
  try:
    raise next(it)
  except StopIteration:
    return ret

def slugify(name):
  return name.replace(' ', '').lower()

def extract_path(base):
  print(f"extracting {os.path.basename(base)}")
  tree = ET.parse(f"{base}.tmp.svg")
  root = tree.getroot()
  ns = tag_re.match(root.tag).group(1)
  g = root.find(f"{ns}g")
  # join all the paths into one
  d = ' '.join(
    path.get('d')
    for path in g.iterfind(f"{ns}path")
  )
  return dict(path=d, transform=g.get('transform'), title=os.path.basename(base), size=24)

def convert_path(base, ext):
  print(f"converting {os.path.basename(base)}")
  # convert non-svgs to svg
  if ext == '.svg':
    shutil.copy2(f"{base}{ext}", f"{base}.tmp.svg")
  else:
    convert('-flatten', f"{base}{ext}", f"{base}.tmp.pbm")
    potrace('-s', f"{base}.tmp.pbm", '-o', f"{base}.tmp.in.svg")
    # shrink svg to 24x24
    convert(f"{base}.tmp.in.svg",
      '-resize', '24x24',
      '-gravity', 'center',
      '-extent', '24x24',
      f"{base}.tmp.svg"
    )
  result = extract_path(base)
  # cleanup
  for f in glob.glob(f"{base}.tmp.*"):
    os.unlink(f)
  return result

def main(src, output):
  src = pathlib.Path(src); assert src.is_dir()
  output = pathlib.Path(output); assert (not output.exists()) or output.is_file()
  with output.open('w') as fw:
    print(
      '// This file was generated by cli/convert-icons.py',
      *(
        f"export var {slugify(icon_file.stem)}_icon = {repr(convert_path(icon_file.parent/icon_file.stem, icon_file.suffix))};"
        for icon_file in sorted(src.glob('*.png'))
      ),
      sep='\n',
      file=fw,
    )

if __name__ == '__main__':
  print(sys.argv)
  main(*sys.argv[1:])
