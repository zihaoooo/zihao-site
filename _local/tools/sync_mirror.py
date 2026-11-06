"""Build the LAAR 61400 mirror for landscape-courses.github.io/laar61400/.

Copies teaching/laar61400/, assets/ and favicon.ico into OUT, keeping the site layout,
rewrites root-absolute paths for the /laar61400/ subfolder, points other site links
to zihaozhang.cc, and adds noindex to every page. Mirror lives until the course
moves to landscape-courses for good (tasks/04-laar61400-mirror.md).

    py _local/tools/sync_mirror.py OUT_DIR
"""
import re
import shutil
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[2]
PREFIX = "/laar61400"
LIVE = "https://zihaozhang.cc"
COURSE = "teaching/laar61400"
COPY = [COURSE, "assets", "favicon.ico", ".nojekyll"]
LOCAL = ("teaching/laar61400/", "assets/", "favicon.ico")

# a quote or url( followed by a root-absolute path (not protocol-relative)
ROOT_PATH = re.compile(r"""(?P<lead>["'(])/(?P<path>(?!/)[^"')\s]*)""")


def rewrite(text: str) -> str:
    def sub(m):
        path = m["path"]
        if path.startswith(LOCAL):
            return f"{m['lead']}{PREFIX}/{path}"
        if path == "":
            return f"{m['lead']}{PREFIX}/{COURSE}/"
        return f"{m['lead']}{LIVE}/{path}"
    return ROOT_PATH.sub(sub, text)


def build(out: Path) -> None:
    for item in out.iterdir() if out.exists() else []:
        if item.name != ".git":
            shutil.rmtree(item) if item.is_dir() else item.unlink()
    out.mkdir(parents=True, exist_ok=True)
    for rel in COPY:
        src = SITE / rel
        dst = out / rel
        if src.is_dir():
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns("CLAUDE.md", "*.py"))
        elif src.exists():
            shutil.copy2(src, dst)
    (out / ".nojekyll").touch()

    for f in out.rglob("*"):
        if f.suffix not in (".html", ".css", ".js") or ".git" in f.parts:
            continue
        text = f.read_text(encoding="utf-8")
        new = rewrite(text)
        if f.suffix == ".html" and 'name="robots"' not in new:
            new = new.replace("<head>", '<head>\n<meta name="robots" content="noindex">', 1)
        if new != text:
            f.write_text(new, encoding="utf-8", newline="")

    (out / "index.html").write_text(
        '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">'
        f'<meta http-equiv="refresh" content="0; url={PREFIX}/{COURSE}/">'
        f'<title>LAAR 61400</title><a href="{PREFIX}/{COURSE}/">LAAR 61400</a>\n',
        encoding="utf-8")


if __name__ == "__main__":
    build(Path(sys.argv[1]).resolve())
