---
name: teach
description: Work on course teaching pages — LAAR 61400 lectures, workflows, announcements on the site, and new course content in the ../course-prep factory. Use for /teach, or any request about a course, lecture, workflow page, syllabus, or announcement.
argument-hint: "[what to change]"
---

# /teach — teaching workspace

Course: `laar61400` unless the task names another course folder under `../course-prep/`.

1. Read `teaching/<course>/CLAUDE.md` — it says which work happens on the site and which in the factory.
2. For new lecture or course content, work in `../course-prep/<course>/` and read the factory docs in the resume order given in `../course-prep/CLAUDE.md`.
3. Task: $ARGUMENTS — ask what to change if this is empty.
4. Preview with `py _local/dev-server.py` before reporting done.
