"""Day 1 starter: implement a small WSGI task API using the standard library.

Required routes: POST /tasks and GET /tasks. Return JSON and validate input.
Run locally: python app.py
Run checks: python -m unittest discover -s assignments/day-01/tests
The tests intentionally fail until you implement create_app().
"""


def create_app():
    """Return a WSGI callable with its own in-memory task collection."""
    raise NotImplementedError("Implement the Day 1 API, then run its tests.")


if __name__ == "__main__":
    from wsgiref.simple_server import make_server
    with make_server("127.0.0.1", 8000, create_app()) as server:
        print("Task API: http://127.0.0.1:8000")
        server.serve_forever()
