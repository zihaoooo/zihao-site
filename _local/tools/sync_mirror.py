"""Build the LAAR 61400 mirror for landscape-courses.github.io/laar61400/.

Puts teaching/laar61400/ at the mirror root, the site's shared assets/ under site-assets/
(the course has its own assets/), rewrites root-absolute paths to match, points other site
links to zihaozhang.cc, and adds noindex to every page. Mirror lives until the course moves
to landscape-courses for good (tasks/04-laar61400-mirror.md).

    py _local/tools/sync_mirror.py OUT_DIR
"""
import re
import shutil
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[2]
PREFIX = "/laar61400"
LIVE = "https://zihaozhang.cc"
COURSE = "teaching/laar61400/"
# root-absolute site path -> mirror path
MAP = {COURSE: "", "assets/": "site-assets/", "favicon.ico": "favicon.ico"}
COPY = {COURSE: "", "assets": "site-assets", "favicon.ico": "favicon.ico"}

# a quote or url( followed by a root-absolute path (not protocol-relative)
ROOT_PATH = re.compile(r"""(?P<lead>["'(])/(?P<path>(?!/)[^"')\s]*)""")


def rewrite(text: str) -> str:
    def sub(m):
        path = m["path"]
        if path in ("", "teaching/laar61400"):
            return f"{m['lead']}{PREFIX}/"
        for src, dst in MAP.items():
            if path.startswith(src):
                return f"{m['lead']}{PREFIX}/{dst}{path[len(src):]}"
        return f"{m['lead']}{LIVE}/{path}"
    return ROOT_PATH.sub(sub, text)


def build(out: Path) -> None:
    for item in out.iterdir() if out.exists() else []:
        if item.name != ".git":
            shutil.rmtree(item) if item.is_dir() else item.unlink()
    out.mkdir(parents=True, exist_ok=True)
    for src_rel, dst_rel in COPY.items():
        src, dst = SITE / src_rel, out / dst_rel
        if src.is_dir():
            shutil.copytree(src, dst, dirs_exist_ok=True,
                            ignore=shutil.ignore_patterns("CLAUDE.md", "*.py"))
        else:
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

    # the first mirror served the course one level down; keep that link working
    old = out / COURSE / "index.html"
    old.parent.mkdir(parents=True, exist_ok=True)
    old.write_text(
        '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">'
        f'<meta http-equiv="refresh" content="0; url={PREFIX}/">'
        f'<title>LAAR 61400</title><a href="{PREFIX}/">LAAR 61400</a>\n', encoding="utf-8")


if __name__ == "__main__":
    build(Path(sys.argv[1]).resolve())
