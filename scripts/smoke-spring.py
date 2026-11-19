"""Exercise a running Spring product using isolated demo sessions, no real records."""
import http.cookiejar
import json
import re
import sys
import urllib.error
import urllib.request

base = sys.argv[1].rstrip('/')
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

def get(path):
    with client.open(base + path, timeout=30) as response:
        return response.read().decode()

assert json.loads(get('/actuator/health'))['status'] == 'UP'
try:
    get('/api/state')
except urllib.error.HTTPError as error:
    assert error.code == 401, error.code
else:
    raise AssertionError('Anonymous users must not receive private learning state')
assert 'Your next skill' in get('/')
page = get('/demo')
assert '/css/learning-lab.css' in page and '/js/tutorials.js' in page
assert 'window.AgenticTutorials=' in get('/js/tutorials.js')
assert 'Your editable website preview' in get('/js/learning-lab.js')
assert 'font-size:18px' in get('/css/learning-lab.css')
assert 'data-text-size' not in get('/js/learning-lab.js')
assert 'reading-controls' not in get('/js/learning-lab.js')
token = re.search(r'<meta name="_csrf" content="([^"]+)"', page).group(1)
state = json.loads(get('/api/demo/state'))
assert len(state['curriculum']) == 60 and state['state']['completed'] == 0
data = json.dumps({'type': 'task', 'day': 1, 'index': 0, 'checked': True,
                   'requestId': 'http-smoke-objective-0001'}).encode()
request = urllib.request.Request(base + '/api/demo/action', data=data,
    headers={'Content-Type': 'application/json', 'X-CSRF-TOKEN': token}, method='POST')
with client.open(request, timeout=30) as response:
    assert json.load(response)['state']['days'][0]['tasks'][0] is True
assert json.loads(get('/api/demo/state'))['state']['days'][0]['tasks'][0] is True
other = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
with other.open(base + '/api/demo/state', timeout=30) as response:
    assert json.load(response)['state']['days'][0]['tasks'][0] is False
assert 'Admin console' not in get('/demo')
print('Running product verified: landing, rendered demo, CSRF-protected save, reload and session isolation.')
