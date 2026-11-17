import importlib.util
import io
import json
import pathlib
import unittest

spec = importlib.util.spec_from_file_location("day01", pathlib.Path(__file__).parents[1] / "app.py")
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)


class TaskAPITest(unittest.TestCase):
    def setUp(self):
        self.app = app_module.create_app()

    def request(self, method, path, body=b""):
        result = {}
        def start_response(status, headers):
            result.update(status=int(status.split()[0]), headers=dict(headers))
        payload = b"".join(self.app({"REQUEST_METHOD": method, "PATH_INFO": path,
            "CONTENT_LENGTH": str(len(body)), "CONTENT_TYPE": "application/json",
            "wsgi.input": io.BytesIO(body)}, start_response))
        return result["status"], json.loads(payload)

    def test_create_and_read(self):
        status, task = self.request("POST", "/tasks", b'{"title":"Learn HTTP"}')
        self.assertEqual(status, 201)
        self.assertTrue(task["id"])
        self.assertEqual(task["title"], "Learn HTTP")
        status, tasks = self.request("GET", "/tasks")
        self.assertEqual(status, 200)
        self.assertIn(task, tasks)

    def test_invalid_json_is_rejected(self):
        self.assertEqual(self.request("POST", "/tasks", b"not-json")[0], 400)

    def test_empty_title_is_rejected(self):
        self.assertEqual(self.request("POST", "/tasks", b'{"title":""}')[0], 400)

    def test_unknown_route(self):
        self.assertEqual(self.request("GET", "/missing")[0], 404)


if __name__ == "__main__":
    unittest.main()
