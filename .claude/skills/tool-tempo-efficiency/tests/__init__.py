import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

DF = ROOT.parent / "tool-polaris-df"
if DF.is_dir() and str(DF) not in sys.path:
    sys.path.insert(0, str(DF))
