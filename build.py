import os
import markdown
import yaml
from jinja2 import Environment, FileSystemLoader
from datetime import datetime

SRC_DIR = "blog_src"
TEMPLATE_DIR = "templates"
OUT_DIR = "blog_out"

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def parse_markdown_with_frontmatter(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if text.startswith("---"):
        _, fm, body = text.split("---", 2)
        meta = yaml.safe_load(fm)
    else:
        meta = {}
        body = text
    return meta, body

def render_post(meta, body):
    md = markdown.Markdown(extensions=["extra", "codehilite", "tables", "sane_lists"])
    html = md.convert(body)
    template = env.get_template("post.html")
    date_val = meta["date"]
    if isinstance(date_val, datetime):
        date_obj = date_val
    elif hasattr(date_val, 'strftime'):
        date_obj = date_val
    else:
        date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
    # Format date_human without leading zero in day
    try:
        date_human = date_obj.strftime("%B %-d, %Y")  # Unix
    except ValueError:
        date_human = date_obj.strftime("%B %d, %Y").replace(' 0', ' ')  # Windows fallback
    return template.render(
        title=meta["title"],
        date=date_obj.strftime("%Y-%m-%d"),
        date_human=date_human,
        content=html,
        tags=meta.get("tags", []),
        slug=meta.get("slug", "")
    )

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    posts = []
    for fname in os.listdir(SRC_DIR):
        if not fname.endswith(".md"):
            continue
        meta, body = parse_markdown_with_frontmatter(os.path.join(SRC_DIR, fname))
        html = render_post(meta, body)
        slug = meta.get("slug", os.path.splitext(fname)[0])
        out_dir = os.path.join(OUT_DIR, slug)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        posts.append({**meta, "out_path": out_path})
    # TODO: Generate index pages for each tag using a template

if __name__ == "__main__":
    main()
