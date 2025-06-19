import os
import markdown
import yaml
import re
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import xml.etree.ElementTree as ET
import json

BLOG_SRC_DIR = "md_src/blog_src"
BLOG_OUT_DIR = "blog"
PROJECTS_SRC_DIR = "md_src/projects_src"
PROJECTS_OUT_DIR = "projects"
TAG_DIR = "tag"
TEMPLATE_DIR = "templates"
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


def embed_media_tag(match):
    # Group 1 captures the entire <img> tag.
    # Group 2 captures the value of the src attribute.
    img_tag = match.group(1)
    src = match.group(2).strip()
    # Extract alt text if present
    alt_match = re.search(r'alt=["\']([^"\']*)["\']', img_tag)
    alt_text = alt_match.group(1) if alt_match else ""
    # Check for YouTube links
    youtube_match = re.match(
        r"https?://(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([\w-]+)", src
    )
    if youtube_match:
        video_id = youtube_match.group(1)
        return f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
    # Check for video file extensions
    video_exts = (".mp4", ".webm", ".ogg", ".mov")
    if src.lower().endswith(video_exts):
        return f'<video src="{src}" autoplay loop playsinline></video>'
    return img_tag


def parse_double_blockquote(body):
    # This function finds consecutive lines starting with '>>' and wraps them in a centered blockquote
    lines = body.split("\n")
    new_lines = []
    in_centered = False
    centered_lines = []
    for line in lines:
        if line.strip().startswith(">>"):
            centered_lines.append(line.lstrip()[2:].lstrip())
            in_centered = True
        else:
            if in_centered:
                if centered_lines:
                    # Group into stanzas separated by blank lines
                    stanzas = []
                    stanza = []
                    for l in centered_lines:
                        if l.strip() == "":
                            if stanza:
                                stanzas.append(stanza)
                                stanza = []
                        else:
                            stanza.append(l)
                    if stanza:
                        stanzas.append(stanza)
                    html_lines = ["<p>" + "<br>\n".join(s) + "</p>" for s in stanzas]
                    new_lines.append(
                        "<blockquote class='centered-blockquote'>\n"
                        + "\n".join(html_lines)
                        + "\n</blockquote>"
                    )
                centered_lines = []
                in_centered = False
            new_lines.append(line)
    # If file ends with a centered blockquote
    if in_centered and centered_lines:
        stanzas = []
        stanza = []
        for l in centered_lines:
            if l.strip() == "":
                if stanza:
                    stanzas.append(stanza)
                    stanza = []
            else:
                stanza.append(l)
        if stanza:
            stanzas.append(stanza)
        html_lines = ["<p>" + "<br>\n".join(s) + "</p>" for s in stanzas]
        new_lines.append(
            "<blockquote class='centered-blockquote'>\n"
            + "\n".join(html_lines)
            + "\n</blockquote>"
        )
    return "\n".join(new_lines)


def parse_ascii_block(body):
    # This function finds code blocks starting with ```ascii and ending with ```
    # and replaces them with the specified HTML structure.
    def replacer(match):
        content = match.group(1)
        # Remove trailing newline if present
        if content.endswith("\n"):
            content = content[:-1]
        # Check if any line is longer than 160 characters
        lines = content.split("\n")
        if any(len(line) > 160 for line in lines):
            div_class = "codehilite ascii-art large"
        else:
            div_class = "codehilite ascii-art"
        return f'<div class="{div_class}"><pre><span></span><code>{content}</code></pre></div>'

    # Regex: match ```ascii\n...content...```
    pattern = r"```ascii\n([\s\S]*?)```"
    return re.sub(pattern, replacer, body)


def render_post(meta, body):
    body = parse_double_blockquote(body)
    body = parse_ascii_block(body)
    md = markdown.Markdown(extensions=["extra", "codehilite", "tables", "sane_lists"])
    md.block_level_elements.append("chat")
    md.block_level_elements.append("cell")
    html = md.convert(body)
    html = re.sub(
        r'(<img[^>]*src=["\']([^"\']+)["\'][^>]*>)', lambda m: embed_media_tag(m), html
    )

    # NEW FIX: Unwrap any <img>, <video>, or <iframe> tags from surrounding <p> tags
    # This regex looks for a <p> tag containing only an <img>, <video>, or <iframe> tag
    # with optional whitespace around it.
    html = re.sub(
        r"<p>\s*(<(?:img|video|iframe)[^>]*?>)\s*</p>",
        r"\1",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    html = re.sub(
        r"<p>\s*(<(?:video|iframe).*?</(?:video|iframe)>)\s*</p>",
        r"\1",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )  # Keep the previous one as it's more specific for closing tags

    template = env.get_template("post.html")
    date_val = meta["date"]
    if isinstance(date_val, datetime):
        date_obj = date_val
    elif hasattr(date_val, "strftime"):
        date_obj = date_val
    else:
        date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
    try:
        date_human = date_obj.strftime("%B %-d, %Y")
    except ValueError:
        date_human = date_obj.strftime("%B %d, %Y").replace(" 0", " ")

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
        tag_dir=TAG_DIR,
        slug=meta.get("slug", ""),
        description=description,
        canonical_url=canonical_url,
    )


def render_project(meta, body):
    body = parse_ascii_block(body)
    md = markdown.Markdown(extensions=["extra", "codehilite", "tables", "sane_lists"])
    html = md.convert(body)
    html = re.sub(
        r'(<img[^>]*src=["\']([^"\']+)["\'][^>]*>)', lambda m: embed_media_tag(m), html
    )

    # NEW FIX: Unwrap any <img>, <video>, or <iframe> tags from surrounding <p> tags
    html = re.sub(
        r"<p>\s*(<(?:img|video|iframe)[^>]*?>)\s*</p>",
        r"\1",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    html = re.sub(
        r"<p>\s*(<(?:video|iframe).*?</(?:video|iframe)>)\s*</p>",
        r"\1",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )

    template = env.get_template("project.html")
    date_val = meta.get("date")
    if date_val is None:
        date_obj = None
        date_human = None
    elif isinstance(date_val, datetime):
        date_obj = date_val
        date_human = human_readable_date(date_obj)
    elif hasattr(date_val, "strftime"):
        date_obj = date_val
        date_human = human_readable_date(date_obj)
    else:
        date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
        date_human = human_readable_date(date_obj)
    description = meta.get("description", "A project by Ethan.")
    canonical_url = f"{WEBSITE_URL}/blog/{meta.get('slug', os.path.splitext(os.path.basename(meta.get('out_path', meta.get('slug', ''))))[0])}/"
    # Pass through all link params
    return template.render(
        title=meta.get("title", "Untitled Project"),
        date=date_obj.strftime("%Y-%m-%d") if date_obj else None,
        date_human=date_human,
        content=html,
        tags=meta.get("tags", []),
        tag_dir=TAG_DIR,
        slug=meta.get("slug", ""),
        description=description,
        canonical_url=canonical_url,
        link=meta.get("link"),
        link_name=meta.get("link_name"),
        link_icon=meta.get("link_icon"),
        github=meta.get("github"),
        website=meta.get("website"),
    )


def human_readable_date(date_obj):
    try:
        # Use platform-specific day format
        if os.name == "nt":
            return date_obj.strftime("%B %#d, %Y")
        else:
            return date_obj.strftime("%B %-d, %Y")
    except Exception:
        return date_obj.strftime("%B %d, %Y").replace(" 0", " ")


def main():
    os.makedirs(BLOG_OUT_DIR, exist_ok=True)
    posts = []
    posts_for_index = []
    for fname in os.listdir(BLOG_SRC_DIR):
        if not fname.endswith(".md"):
            continue
        meta, body = parse_markdown_with_frontmatter(os.path.join(BLOG_SRC_DIR, fname))
        html = render_post(meta, body)
        slug = meta.get("slug", os.path.splitext(fname)[0])
        out_dir = os.path.join(BLOG_OUT_DIR, slug)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        post_entry = {**meta, "out_path": out_path}
        posts.append(post_entry)
        if meta.get("index", True):
            posts_for_index.append(post_entry)
    with open("tags.yaml", encoding="utf-8") as f:
        tag_data = yaml.safe_load(f)

    # Group posts by tag
    tag_posts = {tag: [] for tag in tag_data}
    tag_posts["all"] = posts_for_index[
        :
    ]  # Special 'all' tag lists all posts (that are indexed)
    for post in posts_for_index:
        for tag in post.get("tags", []):
            if tag in tag_posts:
                tag_posts[tag].append(post)

    # --- INCLUDE PROJECTS IN TAG PAGES ---
    # Add projects with matching tags to tag_posts
    projects_for_tags = []
    for fname in os.listdir(PROJECTS_SRC_DIR):
        if not fname.endswith(".md"):
            continue
        meta, body = parse_markdown_with_frontmatter(
            os.path.join(PROJECTS_SRC_DIR, fname)
        )
        if meta.get("index", True):
            projects_for_tags.append(meta)
    for project in projects_for_tags:
        for tag in project.get("tags", []):
            if tag in tag_posts:
                tag_posts[tag].append(project)

    # Render tag index pages
    tag_template = env.get_template("tag.html")
    for tag, posts_list in tag_posts.items():
        tag_info = tag_data.get(
            tag,
            {
                "definition": "All posts in all categories.",
                "text": "This is a special tag that lists every blog post, regardless of category. Use it to browse everything in one place.",
            },
        )

        # Ensure tag_text is blank if not present in tag_info
        tag_text = tag_info.get("text", "")

        # Sort posts and projects by date descending (if available)
        def get_date(item):
            date_val = item.get("date")
            if date_val is None:
                return ""
            if hasattr(date_val, "strftime"):
                return date_val
            try:
                return datetime.strptime(str(date_val), "%Y-%m-%d")
            except Exception:
                return ""

        posts_list_sorted = sorted(posts_list, key=lambda p: get_date(p), reverse=True)
        # Add (Project) to the title of projects and set correct url
        for item in posts_list_sorted:
            if "projects" in item.get("tags", []):
                if not item["title"].endswith(" (Project)"):
                    item["title"] += " (Project)"
                item["url"] = f"projects/{item.get('slug', '')}"
            else:
                item["url"] = f"blog/{item.get('slug', '')}"
        tag_dir = os.path.join(TAG_DIR, tag)
        os.makedirs(tag_dir, exist_ok=True)
        out_path = os.path.join(tag_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(
                tag_template.render(
                    tag_title=tag.capitalize(),
                    tag_definition=tag_info["definition"],
                    tag_text=tag_text,
                    posts=posts_list_sorted,
                    get_post_description=lambda post: (
                        human_readable_date(post["date"])
                        if hasattr(post["date"], "strftime")
                        else (
                            human_readable_date(
                                datetime.strptime(str(post["date"]), "%Y-%m-%d")
                            )
                            if post.get("date")
                            else "No date"
                        )
                    ),
                    projects_link="/blog/projects/",
                )
            )

    # Render main blog index page
    blog_index_template = env.get_template("blog.html")
    tags_for_index = []
    # Count tag usage
    tag_usage = {tag: 0 for tag in tag_data}
    # Count blog posts
    for post in posts_for_index:
        for tag in post.get("tags", []):
            if tag in tag_usage:
                tag_usage[tag] += 1
    # Count projects
    for fname in os.listdir(PROJECTS_SRC_DIR):
        if not fname.endswith(".md"):
            continue
        meta, _ = parse_markdown_with_frontmatter(os.path.join(PROJECTS_SRC_DIR, fname))
        if meta.get("index", True):
            for tag in meta.get("tags", []):
                if tag in tag_usage:
                    tag_usage[tag] += 1
    # Only include tags that are used at least once
    used_tags = {
        tag: info for tag, info in tag_data.items() if tag_usage.get(tag, 0) > 0
    }
    # Sort tags: by usage desc, then alphabetically
    sorted_tags = sorted(
        used_tags.items(), key=lambda item: (-tag_usage[item[0]], item[0])
    )
    for tag, info in sorted_tags:
        tags_for_index.append(
            {
                "slug": tag,
                "url": f"/{TAG_DIR}/{tag}",
                "title": tag.capitalize(),
                "description": info["description"],
            }
        )
    # Render tags aggregator page
    tags_template = env.get_template("tags.html")
    tags_index_path = os.path.join(TAG_DIR, "index.html")
    os.makedirs(TAG_DIR, exist_ok=True)
    with open(tags_index_path, "w", encoding="utf-8") as f:
        f.write(tags_template.render(tags=tags_for_index))
    # Get all posts (by date, descending)
    all_posts_sorted = sorted(posts_for_index, key=lambda p: p["date"], reverse=True)
    # Prepare all_posts with human-readable date
    recent_posts = []
    for post in all_posts_sorted:
        date_obj = post["date"]
        if not hasattr(date_obj, "strftime"):
            date_obj = datetime.strptime(str(date_obj), "%Y-%m-%d")
        recent_posts.append(
            {
                "title": post["title"],
                "slug": post["slug"],
                "date_human": human_readable_date(date_obj),
                "tags": ",".join(post.get("tags", [])),
            }
        )
    blog_index_path = os.path.join(BLOG_OUT_DIR, "index.html")
    with open(blog_index_path, "w", encoding="utf-8") as f:
        f.write(
            blog_index_template.render(
                tags=tags_for_index,
                projects_link="/blog/projects/",
                recent_posts=recent_posts,
            )
        )

    # --- PROJECTS GENERATION ---
    projects = []
    projects_for_index = []
    for fname in os.listdir(PROJECTS_SRC_DIR):
        if not fname.endswith(".md"):
            continue
        meta, body = parse_markdown_with_frontmatter(
            os.path.join(PROJECTS_SRC_DIR, fname)
        )
        html = render_project(meta, body)
        slug = meta.get("slug", os.path.splitext(fname)[0])
        out_dir = os.path.join(PROJECTS_OUT_DIR, slug)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        project_entry = {**meta, "out_path": out_path}
        projects.append(project_entry)
        if meta.get("index", True):
            projects_for_index.append(project_entry)

    # Render projects index page using a dedicated template
    projects_index_path = os.path.join(PROJECTS_OUT_DIR, "index.html")
    projects_sorted = sorted(
        projects_for_index,
        key=lambda p: p.get("date", p.get("title", "")),
        reverse=True,
    )
    # Prepare projects with tags as comma-separated string, excluding 'projects' tag
    projects_for_template = []
    for project in projects_sorted:
        tags = [t for t in project.get("tags", []) if t != "projects"]
        projects_for_template.append(
            {
                "title": project.get("title", "Untitled Project"),
                "slug": project.get("slug", ""),
                "description": project.get("description", "A project by Ethan."),
                "date": project.get("date"),
                "tags": ",".join(tags),
            }
        )
    projects_template = env.get_template("projects.html")
    with open(projects_index_path, "w", encoding="utf-8") as f:
        f.write(
            projects_template.render(
                projects=projects_for_template,
            )
        )

    # --- SITEMAP GENERATION ---
    sitemap_ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", sitemap_ns)
    urlset = ET.Element("{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")

    def add_url(loc, lastmod):
        url = ET.SubElement(urlset, "{http://www.sitemaps.org/schemas/sitemap/0.9}url")
        ET.SubElement(url, "{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text = (
            loc
        )
        ET.SubElement(
            url, "{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod"
        ).text = lastmod

    # Blog posts
    for post in posts:
        slug = post.get(
            "slug", os.path.splitext(os.path.basename(post.get("out_path", "")))[0]
        )
        url = f"{WEBSITE_URL}/blog/{slug}/"
        date_obj = post["date"]
        if not hasattr(date_obj, "strftime"):
            date_obj = datetime.strptime(str(date_obj), "%Y-%m-%d")
        lastmod = date_obj.strftime("%Y-%m-%d")
        add_url(url, lastmod)

    # Projects
    for project in projects:
        slug = project.get(
            "slug", os.path.splitext(os.path.basename(project.get("out_path", "")))[0]
        )
        url = f"{WEBSITE_URL}/projects/{slug}/"
        date_val = project.get("date")
        if date_val is not None:
            if not hasattr(date_val, "strftime"):
                date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
            else:
                date_obj = date_val
            lastmod = date_obj.strftime("%Y-%m-%d")
        else:
            lastmod = None
        add_url(url, lastmod or datetime.now().strftime("%Y-%m-%d"))

    # Tags index page
    tags_index_url = f"{WEBSITE_URL}/tag/"
    add_url(tags_index_url, datetime.now().strftime("%Y-%m-%d"))

    sitemap_path = "sitemap.xml"
    tree = ET.ElementTree(urlset)
    tree.write(sitemap_path, encoding="utf-8", xml_declaration=True)

    # --- INFO.JSON GENERATION ---
    info_entries = []

    # Static pages: home, about, blog index, projects index (first in list)
    info_entries.append(
        {
            "url": f"{WEBSITE_URL}/",
            "title": "Home",
            "tags": [],
            "date": None,
            "description": "The personal website of Ethan Marks (@ColourlessSpearmint)",
            "category": "static",
            "slug": "home",
        }
    )
    info_entries.append(
        {
            "url": f"{WEBSITE_URL}/about/",
            "title": "About",
            "tags": [],
            "date": None,
            "description": "About Ethan Marks (@ColourlessSpearmint)",
            "category": "static",
            "slug": "about",
        }
    )
    info_entries.append(
        {
            "url": f"{WEBSITE_URL}/blog/",
            "title": "Blog Index",
            "tags": [],
            "date": None,
            "description": "Main blog index page.",
            "category": "static",
            "slug": "index",
        }
    )
    info_entries.append(
        {
            "url": f"{WEBSITE_URL}/projects/",
            "title": "Projects Index",
            "tags": [],
            "date": None,
            "description": "Main projects index page.",
            "category": "static",
            "slug": "projects-index",
        }
    )

    # Blog posts
    for post in posts:
        slug = post.get(
            "slug", os.path.splitext(os.path.basename(post.get("out_path", "")))[0]
        )
        url = f"{WEBSITE_URL}/blog/{slug}/"
        date_obj = post["date"]
        if not hasattr(date_obj, "strftime"):
            date_obj = datetime.strptime(str(date_obj), "%Y-%m-%d")
        info_entries.append(
            {
                "url": url,
                "title": post.get("title", ""),
                "tags": post.get("tags", []),
                "date": date_obj.strftime("%Y-%m-%d"),
                "description": post.get(
                    "description", "A post from Ethan's personal website blog."
                ),
                "category": "blog",
                "slug": slug,
            }
        )

    # Tag pages
    for tag, posts_list in tag_posts.items():
        url = f"{WEBSITE_URL}/blog/{tag}/"
        info_entries.append(
            {
                "url": url,
                "title": tag.capitalize(),
                "tags": [tag],
                "date": None,
                "description": tag_data.get(tag, {}).get("description", ""),
                "category": "tag",
                "slug": tag,
            }
        )

    # Add tags index page to sitemap/info.json
    tags_index_url = f"{WEBSITE_URL}/tag/"
    info_entries.append(
        {
            "url": tags_index_url,
            "title": "All Tags",
            "tags": [],
            "date": None,
            "description": "Browse all tags used on Ethan's blog and projects.",
            "category": "tag-index",
            "slug": "tags-index",
        }
    )

    # Projects
    for project in projects:
        slug = project.get(
            "slug", os.path.splitext(os.path.basename(project.get("out_path", "")))[0]
        )
        url = f"{WEBSITE_URL}/projects/{slug}/"
        date_val = project.get("date")
        if date_val is not None:
            if not hasattr(date_val, "strftime"):
                date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
            else:
                date_obj = date_val
            date_str = date_obj.strftime("%Y-%m-%d")
        else:
            date_str = None
        info_entries.append(
            {
                "url": url,
                "title": project.get("title", "Untitled Project"),
                "tags": project.get("tags", []),
                "date": date_str,
                "description": project.get("description", "A project by Ethan."),
                "category": "project",
                "slug": slug,
            }
        )

    info_path = "sitemap.json"
    with open(info_path, "w", encoding="utf-8") as f:
        json.dump(info_entries, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
