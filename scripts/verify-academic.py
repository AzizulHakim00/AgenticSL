"""Validate 120-day academic course invariants without paid services."""
import json
from pathlib import Path

resources=Path(__file__).resolve().parents[1]/"spring-app/src/main/resources"
base=json.loads((resources/"curriculum.json").read_text(encoding="utf-8"))
extra=json.loads((resources/"advanced-curriculum.json").read_text(encoding="utf-8"))
days=base["curriculum"]+extra["curriculum"]
mods=base["modules"]+extra["modules"]
assert len(days)==120 and len(mods)==16
assert len(base["curriculum"])==60 and len(extra["curriculum"])==60
assert [m["id"] for m in mods]==list(range(1,17))
assert [d["day"] for d in days]==list(range(1,121))
for m in mods:
    assert 1<=m["start"]<=m["end"]<=120
    assert all(days[day-1]["module"]==m["id"] for day in range(m["start"],m["end"]+1))
for d in days:
    assert len(d["objectives"])==3 and len(d["questions"])==2, d["day"]
    assert sum(x["points"] for x in d["rubric"])==100, d["day"]
    assert len(d["lesson"])>=120
    assert len(d["assignment"])>=40
    assert all(q["id"] and len(q["options"])==4 and
               len(set(q["options"]))==4 and 0<=q["answer"]<4
               for q in d["questions"])
    assert all(r["url"].startswith("https://") for r in d["resources"])
    if d["day"]>60:
        a=d["academic"]
        assert len(a["diagram"]) in (4,5)
        assert len(a["idea"])>100
        assert d["minutes"]>=300
print("Academic curriculum validated: 120 sessions, 16 modules, 360 objectives, 240 questions.")
