"""Local dev server for editing teaching decks. LOCAL ONLY (lives in _local/, gitignored).

Serves the site root with Cache-Control: no-store so edits to deck.js / deck.css /
deck-editor.js are always picked up — the `?edit` auto-loader in deck.js then fires reliably.

Run from the repo root:  py _local/dev-server.py [port]
Then open:  http://localhost:8137/teaching/laar61400/lectures/week04-graphic-design-101.html?edit
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):
        pass  # quiet


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8137
    handler = partial(NoCacheHandler, directory=".")
    httpd = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Deck dev server (no-cache) on http://localhost:{port}  —  Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.shutdown()


if __name__ == "__main__":
    main()
