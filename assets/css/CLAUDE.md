# CSS notes

- site.css holds all shared styles; classes prefixed `site-` / `project-`
- footer.css holds the copyright footer, imported by site.css and the course main.css; the
  footer line itself sits before `</main>` on every page (update the year with sed)
- Never put `*/` inside a CSS comment — closes comment early, silently drops all rules after
