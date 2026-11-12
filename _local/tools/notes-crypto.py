#!/usr/bin/env python3
"""
Speaker-notes crypto for deck pages.

Two versions of notes live on each .slide:
  data-notes       public, synthesized — shipped in the clear, anyone can read it
  data-notes-full  verbatim — shipped as AES-GCM ciphertext, decrypted in the
                   browser by /assets/deck/deck.js when you enter the passphrase

The HTML file is the single source of truth. `unlock` turns data-notes-full back
into editable plaintext; `lock` seals it again. Commit only locked files.

Usage — every command takes one or more files; one passphrase prompt covers the run.
  py _local/tools/notes-crypto.py status  talks/bedac/index.html
  py _local/tools/notes-crypto.py seed    talks/bedac/index.html   # data-notes -> data-notes-full
  py _local/tools/notes-crypto.py lock    talks/*/index.html teaching/*/lectures/*.html
  py _local/tools/notes-crypto.py unlock  talks/bedac/index.html

The passphrase is read from a hidden prompt and never written to disk or argv.
Losing it means losing the verbatim notes — keep it in your password manager.
"""
import base64
import html
import os
import re
import sys
from getpass import getpass

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes


def ask(prompt):
    """Hidden prompt at a terminal; plain stdin read when piped (test harnesses)."""
    if sys.stdin.isatty():
        return getpass(prompt)
    return sys.stdin.readline().rstrip("\n")


PREFIX = "enc:v1:"
ITERATIONS = 210_000

RE_FULL = re.compile(r'data-notes-full="([^"]*)"')
RE_NOTES = re.compile(r'data-notes="([^"]*)"')
RE_SALT = re.compile(r'data-notes-salt="([^"]*)"')
RE_DECK = re.compile(r'(<div class="deck"[^>]*?)(>)')


def derive(passphrase: str, salt: bytes) -> bytes:
    return PBKDF2HMAC(
        algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITERATIONS
    ).derive(passphrase.encode("utf-8"))


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, src):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(src)


def get_salt(src):
    m = RE_SALT.search(src)
    return base64.b64decode(m.group(1)) if m else None


def ensure_deck_attrs(src, salt):
    """Put salt + iteration count on the #deck element so the browser can derive the key."""
    src = RE_SALT.sub("", src)
    src = re.sub(r'\s*data-notes-iter="[^"]*"', "", src)
    attrs = (
        f' data-notes-salt="{base64.b64encode(salt).decode()}"'
        f' data-notes-iter="{ITERATIONS}"'
    )
    return RE_DECK.sub(lambda m: m.group(1) + attrs + m.group(2), src, count=1)


def cmd_status(path, shared=None):
    src = read(path)
    vals = RE_FULL.findall(src)
    enc = sum(1 for v in vals if v.startswith(PREFIX))
    plain = sum(1 for v in vals if v and not v.startswith(PREFIX))
    empty = sum(1 for v in vals if not v)
    print(f"{path}")
    print(f"  slides            {len(RE_NOTES.findall(src))}")
    print(f"  data-notes-full   {len(vals)}  (encrypted {enc} · plaintext {plain} · empty {empty})")
    print(f"  salt              {'present' if get_salt(src) else 'absent'}")
    if plain:
        print("  -> PLAINTEXT PRESENT. Run `lock` before committing.")
    return shared


def cmd_seed(path, shared=None):
    """Copy the current public data-notes into data-notes-full, once, as plaintext."""
    src = read(path)
    if RE_FULL.search(src):
        sys.exit("data-notes-full already present — nothing to seed.")

    def sub(m):
        return f'{m.group(0)} data-notes-full="{m.group(1)}"'

    src = RE_NOTES.sub(sub, src)
    write(path, src)
    print(f"  seeded {len(RE_NOTES.findall(src))} slides. Now edit data-notes down to the "
          f"public version, then run `lock`.")
    return shared


def cmd_lock(path, shared=None):
    src = read(path)
    todo = [v for v in RE_FULL.findall(src) if v and not v.startswith(PREFIX)]
    if not todo:
        sys.exit("nothing to lock — every data-notes-full is already encrypted or empty.")

    salt = get_salt(src) or os.urandom(16)
    p1 = shared
    if p1 is None:
        p1 = ask("Passphrase: ")
        if p1 != ask("Confirm:    "):
            sys.exit("passphrases differ.")
        if len(p1) < 12:
            print("  note: short passphrase — this is an access gate, not a secret.")
    key = derive(p1, salt)

    # An existing salt means an existing passphrase; verify against a sealed slide.
    sealed = [v for v in RE_FULL.findall(src) if v.startswith(PREFIX)]
    if sealed:
        try:
            decrypt(key, sealed[0])
        except Exception:
            sys.exit("wrong passphrase for this file — refusing to mix two keys.")

    n = 0

    def sub(m):
        nonlocal n
        v = m.group(1)
        if not v or v.startswith(PREFIX):
            return m.group(0)
        n += 1
        return f'data-notes-full="{encrypt(key, html.unescape(v))}"'

    src = ensure_deck_attrs(RE_FULL.sub(sub, src), salt)
    write(path, src)
    print(f"  locked {n} slides.")
    return p1


def cmd_unlock(path, shared=None):
    src = read(path)
    salt = get_salt(src)
    if not salt:
        sys.exit("no salt on #deck — this file was never locked.")
    p1 = shared if shared is not None else ask("Passphrase: ")
    key = derive(p1, salt)
    n = 0

    def sub(m):
        nonlocal n
        v = m.group(1)
        if not v.startswith(PREFIX):
            return m.group(0)
        n += 1
        return f'data-notes-full="{html.escape(decrypt(key, v), quote=True)}"'

    try:
        src = RE_FULL.sub(sub, src)
    except Exception:
        sys.exit("wrong passphrase.")
    # drop the salt too, so the next `lock` is a clean first-lock (confirm prompt)
    src = re.sub(r'\s*data-notes-(salt|iter)="[^"]*"', "", src)
    write(path, src)
    print(f"  unlocked {n} slides — PLAINTEXT ON DISK. Run `lock` before committing.")
    return p1


def encrypt(key, plaintext):
    iv = os.urandom(12)
    ct = AESGCM(key).encrypt(iv, plaintext.encode("utf-8"), None)
    return PREFIX + base64.b64encode(iv + ct).decode()


def decrypt(key, value):
    raw = base64.b64decode(value[len(PREFIX):])
    return AESGCM(key).decrypt(raw[:12], raw[12:], None).decode("utf-8")


if __name__ == "__main__":
    cmds = {"status": cmd_status, "seed": cmd_seed, "lock": cmd_lock, "unlock": cmd_unlock}
    if len(sys.argv) < 3 or sys.argv[1] not in cmds:
        sys.exit(__doc__)
    # One passphrase prompt covers every file in the run; each file keeps its own salt.
    shared = None
    for path in sys.argv[2:]:
        print(f"[{path}]")
        try:
            shared = cmds[sys.argv[1]](path, shared)
        except SystemExit as e:
            print(f"  {e}")
