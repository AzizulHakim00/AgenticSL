"""Run every published dependency-free worked example and compare its shown output."""
import json
from pathlib import Path
import subprocess
import sys

source = Path(__file__).resolve().parents[1] / 'spring-app/src/main/resources/static/js/tutorials.js'
payload = source.read_text(encoding='utf-8').split('window.AgenticTutorials=', 1)[1].split(';\nwindow.AgenticLessonMeta=', 1)[0]
examples = json.loads(payload)
assert len(examples) == 60
for day, example in enumerate(examples, 1):
    assert example['day'] == day and len(example['stages']) == 3
    result = subprocess.run([sys.executable, '-I', '-c', example['code']],
                            capture_output=True, text=True, timeout=5, encoding='utf-8')
    if result.returncode or result.stdout.strip() != example['output'].strip():
        raise AssertionError(f"Day {day}: expected {example['output']!r}, got {result.stdout!r}; {result.stderr}")
print('All 60 worked examples execute and match their published output.')
