"""Render _local/cv/external_cv.md into the external CV PDF.

External style: Roboto body, Roboto Condensed Bold heads, black and white,
two-column date/content entries (shared with the Penn application materials,
which import the styles and header from here).

    py _local/cv/build_external_pdf.py [out.pdf]
"""

import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    CondPageBreak, KeepTogether, Paragraph, SimpleDocTemplate,
    Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "_local" / "cv" / "external_cv.md"
OUT = ROOT / "assets" / "cv" / "Zihao_Zhang_CV.pdf"


def inline(text):
    """Markdown inline -> reportlab mini-HTML."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<i>\1</i>", text)
    # Bare URLs -> muted, non-underlined links.
    text = re.sub(r"(https?://[^\s)]+)",
                  r'<link href="\1"><font color="#666666">\1</font></link>', text)
    return text


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def is_rule_row(line):
    return re.fullmatch(r"\|[\s|:-]+\|", line.strip()) is not None


def parse(md):
    """Yield ('kind', payload) blocks from the CV markdown."""
    lines = md.splitlines()
    i, n = 0, len(lines)
    para = []

    def flush():
        nonlocal para
        if para:
            yielded = ("para", " ".join(para))
            para = []
            return yielded
        return None

    while i < n:
        raw = lines[i]
        line = raw.strip()

        if line.startswith("## "):
            b = flush()
            if b:
                yield b
            yield ("section", line[3:].strip())
        elif line.startswith("### "):
            b = flush()
            if b:
                yield b
            yield ("subsection", line[4:].strip())
        elif line.startswith("|"):
            b = flush()
            if b:
                yield b
            while i < n and lines[i].strip().startswith("|"):
                row = lines[i].strip()
                if not is_rule_row(row):
                    c = cells(row)
                    date = c[0]
                    rest = [x for x in c[1:] if x]
                    content = rest[0] if rest else ""
                    if len(rest) > 1:  # credit column on course tables
                        content += "  (" + ", ".join(rest[1:]) + ")"
                    yield ("entry", (date, content))
                i += 1
            continue
        elif line.startswith("- "):
            b = flush()
            if b:
                yield b
            yield ("bullet", line[2:].strip())
        elif line.startswith("---") or not line:
            b = flush()
            if b:
                yield b
        else:
            # Markdown hard break (two trailing spaces) ends the paragraph.
            para.append(line)
            if raw.endswith("  "):
                b = flush()
                if b:
                    yield b
        i += 1

    b = flush()
    if b:
        yield b


def ink(text):
    """Site markdown -> reportlab markup; application prose carries no em dashes."""
    return inline(text.replace(" — ", ", ")).replace("#666666", "#4d4d4d")


SMALL_WORDS = {"a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to"}


def title_case(text):
    return " ".join(w if i and w in SMALL_WORDS else w[:1].upper() + w[1:]
                    for i, w in enumerate(text.lower().split()))


FONTS = Path("C:/Windows/Fonts")
for name in ["Roboto-Regular", "Roboto-Bold", "Roboto-Italic", "Roboto-BoldItalic",
             "Roboto-Medium", "RobotoCondensed-Bold"]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / f"{name}.ttf")))
pdfmetrics.registerFontFamily("Roboto", normal="Roboto-Regular", bold="Roboto-Bold",
                              italic="Roboto-Italic", boldItalic="Roboto-BoldItalic")

INK = colors.black
GRAY = colors.HexColor("#3d3d3d")
PAGE_W = letter[0]

# Type scale (pt). CV body 9/13; vertical steps 3 · 6 · 10 · 20.
S = lambda name, **kw: ParagraphStyle(name, **{"fontName": "Roboto-Regular", "textColor": INK, **kw})
name_style = S("Name", fontName="Roboto-Bold", fontSize=24, leading=28, spaceAfter=3)
tag_style = S("Tag", fontSize=10.5, leading=14, textColor=GRAY, spaceAfter=6)
contact_style = S("Contact", fontSize=8.6, leading=12, textColor=GRAY)
section_style = S("Section", fontName="RobotoCondensed-Bold", fontSize=13.5, leading=16)
sub_style = S("Sub", fontName="RobotoCondensed-Bold", fontSize=10.2, leading=13,
              spaceBefore=10, spaceAfter=4, keepWithNext=True)
minor_style = S("Minor", fontName="Roboto-Medium", fontSize=9, leading=13,
                spaceBefore=4, spaceAfter=2, keepWithNext=True)
body_style = S("Body", fontSize=9, leading=13, spaceAfter=5)
cite_style = ParagraphStyle("Cite", parent=body_style, leftIndent=14, firstLineIndent=-14)
bullet_style = ParagraphStyle("Bullet", parent=body_style, leftIndent=12, bulletFontName="Roboto-Regular", spaceAfter=2.5,
                              bulletFontSize=6.5, bulletIndent=2)
date_style = S("Date", fontSize=8.6, leading=13, textColor=GRAY)
entry_style = S("Entry", fontSize=9, leading=13)
letter_style = S("Letter", fontSize=10.5, leading=15, spaceAfter=7.5)


def footer(label, margin):
    def draw(c, doc):
        c.saveState()
        c.setFont("RobotoCondensed-Bold", 7.5)
        c.setFillColor(INK)
        c.drawString(margin, 0.5 * inch, f"Zihao Zhang  |  {label}")
        c.drawRightString(PAGE_W - margin, 0.5 * inch, str(doc.page))
        c.restoreState()
    return draw


def build_doc(path, title, label, story, margin):
    f = footer(label, margin)
    SimpleDocTemplate(str(path), pagesize=letter, leftMargin=margin, rightMargin=margin,
                      topMargin=0.8 * inch, bottomMargin=0.85 * inch, title=title,
                      author="Zihao Zhang").build(story, onFirstPage=f, onLaterPages=f)


def entry(date, content, width):
    t = Table([[Paragraph(ink(date), date_style), Paragraph(ink(content), entry_style)]],
              colWidths=[0.95 * inch, width - 0.95 * inch], hAlign="LEFT")
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")] +
                          [(k, (0, 0), (-1, -1), 0) for k in
                           ("LEFTPADDING", "RIGHTPADDING", "TOPPADDING", "BOTTOMPADDING")]))
    t.spaceAfter = 3
    return t


def header(story, lines):
    story.append(Paragraph("Zihao Zhang, Ph.D.", name_style))
    story.append(Paragraph("Designer · Educator · Scholar in Landscape Architecture", tag_style))
    for l in lines:
        story.append(Paragraph(ink(l), contact_style))


PROSE_SECTIONS = {"SUMMARY", "HIGHER EDUCATION"}
MINOR_HEAD = re.compile(r"\*\*[^*]+\*\*(\s*\*\([^)]*\)\*)?")  # "**2024**", "**2022–2018** *(selected)*"


def build_cv(out=OUT):
    margin = 0.85 * inch
    width = PAGE_W - 2 * margin
    md = SRC.read_text(encoding="utf-8")
    head, rest = md.split("\n---\n", 1)
    head_lines = [l.strip() for l in head.splitlines() if l.strip()]
    story = []
    header(story, head_lines[2:])
    current = ""
    for kind, payload in parse(rest):
        if kind == "section":
            current = payload.upper()
            story += [CondPageBreak(1.4 * inch), Spacer(1, 20),
                      Paragraph(title_case(payload), section_style), Spacer(1, 6)]
        elif kind == "subsection":
            story.append(KeepTogether([CondPageBreak(0.9 * inch),
                                       Paragraph(ink(payload), sub_style)]))
        elif kind == "entry":
            story.append(entry(*payload, width))
        elif kind == "bullet":
            story.append(Paragraph(ink(payload), bullet_style, bulletText="•"))
        elif kind == "para" and MINOR_HEAD.fullmatch(payload):
            story.append(Paragraph(re.sub(r"</?b>", "", ink(payload)), minor_style))
        elif kind == "para":
            style = body_style if current in PROSE_SECTIONS else cite_style
            story.append(Paragraph(ink(payload), style))
    build_doc(out, "Zihao Zhang, Curriculum Vitae", "Curriculum Vitae", story, margin)
    return out



if __name__ == "__main__":
    if not SRC.exists():
        sys.exit(f"missing source: {SRC}")
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT
    out.parent.mkdir(parents=True, exist_ok=True)
    build_cv(out)
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")
