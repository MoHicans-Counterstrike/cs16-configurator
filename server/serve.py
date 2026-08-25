#!/usr/bin/env python3
"""MOHICAN static server + download counter.
Serves /home/ninja/cs16-config on :4166 and tracks config downloads in count.json.
Endpoints:
  GET  /api/count  -> {"count": N}
  POST /api/count  -> increments, returns {"count": N}
Everything else: static files (index.html, images/, status.json).
Replaces `python3 -m http.server`.
"""
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = "/home/ninja/cs16-config"
COUNT_FILE = os.path.join(ROOT, "count.json")


def read_count():
    try:
        with open(COUNT_FILE) as f:
            return json.load(f).get("count", 0)
    except Exception:
        return 0


def write_count(n):
    tmp = COUNT_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump({"count": n}, f)
    os.replace(tmp, COUNT_FILE)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        pass  # quiet

    def _send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/count":
            self._send_json({"count": read_count()})
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] == "/api/count":
            n = read_count() + 1
            write_count(n)
            self._send_json({"count": n})
            return
        self._send_json({"error": "not found"}, 404)


if __name__ == "__main__":
    # seed counter so it doesn't start at 0
    if not os.path.exists(COUNT_FILE):
        write_count(1337)
    server = ThreadingHTTPServer(("0.0.0.0", 4166), Handler)
    print("MOHICAN server on :4166")
    server.serve_forever()
