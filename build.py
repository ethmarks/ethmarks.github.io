import os
import markdown
import yaml
import re
from jinja2 import Environment, FileSystemLoader
from datetime import datetime

SRC_DIR = "blog_src"
TEMPLATE_DIR = "templates"
OUT_DIR = "blog_out"
WEBSITE_URL = "https://colourlessspearmint.github.io"

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

def process_poem_tag(match):
    # Known bug: Removes all newlines so the output is one big block
    # Workaround: Remember that it's slightly more bandwidth efficient and call it a feature
    poem_text = match.group(1).strip()
    stanzas = re.split(r'\n\s*\n', poem_text)
    processed_stanzas = []
    for stanza in stanzas:
        lines = stanza.strip().split('\n')
        p_lines = [f'<p>{line.strip()}</p>' for line in lines if line.strip()]
        processed_stanzas.append(''.join(p_lines))
    final_poem_html = '<br>'.join(processed_stanzas)
    return f'<poem>{final_poem_html}</poem>'

def render_post(meta, body):
    md = markdown.Markdown(extensions=["extra", "codehilite", "tables", "sane_lists"])
    md.block_level_elements.append('poem')
    html = md.convert(body)
    html = re.sub(r'<poem>(.*?)</poem>', process_poem_tag, html, flags=re.DOTALL)
    html = re.sub(r'<p>(\s*<img[^>]+>\s*)</p>', r'\1', html)
    template = env.get_template("post.html")
    date_val = meta["date"]
    if isinstance(date_val, datetime):
        date_obj = date_val
    elif hasattr(date_val, 'strftime'):
        date_obj = date_val
    else:
        date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
    try:
        date_human = date_obj.strftime("%B %-d, %Y")
    except ValueError:
        date_human = date_obj.strftime("%B %d, %Y").replace(' 0', ' ')
    
    # Provide a generic description if not present
    description = meta.get("description")
    if not description or not description.strip():
        description = "A post from Ethan's personal website blog."
    # Build canonical URL (assumes posts are at /blog/<slug>/)
    canonical_url = f"{WEBSITE_URL}/blog/{meta.get('slug', os.path.splitext(os.path.basename(meta.get('out_path', meta.get('slug', ''))))[0])}/"
    return template.render(
        title=meta["title"],
        date=date_obj.strftime("%Y-%m-%d"),
        date_human=date_human,
        content=html,
        tags=meta.get("tags", []),
        slug=meta.get("slug", ""),
        description=description,
        canonical_url=canonical_url
    )

def human_readable_date(date_obj):
    try:
        # Use platform-specific day format
        if os.name == 'nt':
            return date_obj.strftime("%B %#d, %Y")
        else:
            return date_obj.strftime("%B %-d, %Y")
    except Exception:
        return date_obj.strftime("%B %d, %Y").replace(' 0', ' ')

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
    with open("tags.yaml", encoding="utf-8") as f:
        tag_data = yaml.safe_load(f)

    # Group posts by tag
    tag_posts = {tag: [] for tag in tag_data}
    tag_posts['all'] = posts[:]  # Special 'all' tag lists all posts
    for post in posts:
        for tag in post.get("tags", []):
            if tag in tag_posts:
                tag_posts[tag].append(post)

    # Render tag index pages
    tag_template = env.get_template("tag.html")
    for tag, posts_list in tag_posts.items():
        tag_info = tag_data.get(tag, {
            "definition": "All posts in all categories.",
            "text": "This is a special tag that lists every blog post, regardless of category. Use it to browse everything in one place."
        })
        # Sort posts by date descending
        posts_list_sorted = sorted(posts_list, key=lambda p: p["date"], reverse=True)
        tag_dir = os.path.join(OUT_DIR, tag)
        os.makedirs(tag_dir, exist_ok=True)
        out_path = os.path.join(tag_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(tag_template.render(
                tag_title=tag.capitalize(),
                tag_definition=tag_info["definition"],
                tag_text=tag_info["text"],
                posts=posts_list_sorted,
                get_post_description=lambda post: (
                    human_readable_date(post["date"]) if hasattr(post["date"], 'strftime') else 
                    human_readable_date(datetime.strptime(str(post["date"]), "%Y-%m-%d"))
                )
            ))

    # Render main blog index page
    blog_index_template = env.get_template("blog.html")
    tags_for_index = []
    for tag, info in tag_data.items():
        tags_for_index.append({
            "slug": tag,
            "title": tag.capitalize(),
            "description": info["description"]
        })
    blog_index_path = os.path.join(OUT_DIR, "index.html")
    with open(blog_index_path, "w", encoding="utf-8") as f:
        f.write(blog_index_template.render(tags=tags_for_index))

if __name__ == "__main__":
    main()
