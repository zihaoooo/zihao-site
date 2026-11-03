# CSS notes

- site.css holds all shared styles; classes prefixed `site-` / `project-`
- footer.css holds the copyright footer, imported by site.css and the course main.css; the
  footer line itself sits before `</main>` on every page (update the year with sed)
- Write CSS comments without `*/` inside them — it closes the comment early and silently drops every rule after it
