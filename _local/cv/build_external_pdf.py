"""Render _local/cv/external_cv.md into the public CV PDF.

Parses the markdown so the PDF stays in sync with the source of truth.
Design spec is locked (see _local/.claude ../ cv-pdf skill): Letter, 0.85" margins,
Helvetica, 22pt name, 11pt caps sections, two-column date/content entries.

    py _local/cv/build_external_pdf.py
"""

import re
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    CondPageBreak, KeepTogether, Paragraph, SimpleDocTemplate, Spacer,
    Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "_local" / "cv" / "external_cv.md"
OUT = ROOT / "assets" / "cv" / "Zihao_Zhang_CV.pdf"

BLACK = colors.HexColor("#1a1a1a")
ACCENT = colors.HexColor("#2c2c2c")
LIGHT_GRAY = colors.HexColor("#666666")

name_style = ParagraphStyle("Name", fontSize=22, fontName="Helvetica-Bold",
                            textColor=BLACK, spaceAfter=2, leading=26)
tagline_style = ParagraphStyle("Tagline", fontSize=9.5, fontName="Helvetica",
                               textColor=LIGHT_GRAY, spaceAfter=2, leading=13)
contact_style = ParagraphStyle("Contact", fontSize=8.5, fontName="Helvetica",
                               textColor=LIGHT_GRAY, spaceAfter=0, leading=12)
section_style = ParagraphStyle("Section", fontSize=11, fontName="Helvetica-Bold",
                               textColor=ACCENT, spaceBefore=14, spaceAfter=3,
                               keepWithNext=True, leading=12)
subsection_style = ParagraphStyle("Subsection", fontSize=9.5, fontName="Helvetica-Bold",
                                  textColor=BLACK, spaceBefore=8, spaceAfter=2,
                                  leading=13, keepWithNext=True)
body_style = ParagraphStyle("Body", fontSize=8.8, fontName="Helvetica",
                            textColor=BLACK, spaceAfter=5, leading=13)
bullet_style = ParagraphStyle("Bullet", parent=body_style, leftIndent=10,
                              bulletIndent=0, spaceAfter=3)
date_style = ParagraphStyle("Date", fontSize=8, fontName="Helvetica",
                            textColor=LIGHT_GRAY, spaceAfter=2, leading=11)
entry_style = ParagraphStyle("Entry", fontSize=8.8, fontName="Helvetica",
                             textColor=BLACK, leading=11.5)


def inline(text):
    """Markdown inline -> reportlab mini-HTML."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<i>\1</i>", text)
    # Bare URLs -> muted, non-underlined links.
    text = re.sub(r"(https?://[^\s)]+)",
                  r'<link href="\1"><font color="#666666">\1</font></link>', text)
    return text


def section(title):
    return [CondPageBreak(2.5 * inch), Spacer(1, 4),
            Paragraph(title.upper(), section_style), Spacer(1, 3)]


def subsection(title):
    return [KeepTogether([CondPageBreak(2.0 * inch),
                          Paragraph(inline(title), subsection_style)])]


def entry(date, content):
    t = Table([[Paragraph(inline(date), date_style),
                Paragraph(inline(content), entry_style)]],
              colWidths=[0.95 * inch, 5.45 * inch], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    t.spaceAfter = 7
    return t


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


def build():
    md = SRC.read_text(encoding="utf-8")
    OUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUT), pagesize=letter,
        leftMargin=0.85 * inch, rightMargin=0.85 * inch,
        topMargin=0.85 * inch, bottomMargin=0.85 * inch,
        title="Zihao Zhang — Curriculum Vitae", author="Zihao Zhang",
        subject="Curriculum Vitae",
    )

    story = []
    # Header: name, tagline, contact lines — everything before the first ---.
    head, rest = md.split("\n---\n", 1)
    head_lines = [l.strip() for l in head.splitlines() if l.strip()]
    story.append(Paragraph(head_lines[0].lstrip("# ").strip(), name_style))
    story.append(Paragraph("Designer · Educator · Scholar in Landscape Architecture",
                           tagline_style))
    for l in head_lines[2:]:
        story.append(Paragraph(inline(l), contact_style))
    story.append(Spacer(1, 6))

    for kind, payload in parse(rest):
        if kind == "section":
            story += section(payload)
        elif kind == "subsection":
            story += subsection(payload)
        elif kind == "entry":
            story.append(entry(*payload))
        elif kind == "bullet":
            story.append(Paragraph(inline(payload), bullet_style, bulletText="·"))
        elif kind == "para":
            story.append(Paragraph(inline(payload), body_style))

    doc.build(story)
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    if not SRC.exists():
        sys.exit(f"missing source: {SRC}")
    build()
