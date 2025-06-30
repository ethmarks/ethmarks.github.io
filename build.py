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
    # Store the original alt text for both the condition check and potential processing.
    original_alt_text = alt_match.group(1) if alt_match else ""

    # 1. Handle YouTube links first. These are always iframes.
    youtube_match = re.match(
        r"https?://(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([\w-]+)", src
    )
    if youtube_match:
        video_id = youtube_match.group(1)
        return f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'

    # 2. Define common video file extensions.
    video_exts = (".mp4", ".webm", ".ogg", ".mov")

    # 3. Check if the src points to a direct video file.
    if src.lower().endswith(video_exts):
        # Determine the alt text that will be used in the <video> tag's alt attribute.
        processed_alt_text = original_alt_text
        if original_alt_text.lower().startswith("gif"):
            # If alt text starts with "GIF", omit "GIF" and any trailing spaces.
            # re.sub(r'^[gG][iI][fF]\s*', '', original_alt_text) will remove "GIF" (case-insensitive)
            # followed by zero or more spaces from the beginning of the string.
            processed_alt_text = re.sub(r"^[gG][iI][fF]\s*", "", original_alt_text)

        # Create the alt attribute string for the <video> tag.
        # Only add the alt="" attribute if there's content in processed_alt_text.
        alt_attribute_str = f' alt="{processed_alt_text}"' if processed_alt_text else ""

        # Now, apply the playback logic based on the ORIGINAL alt text.
        if original_alt_text.lower().startswith("gif"):
            # Apply autoplay, loop, muted, and playsinline tags, plus the processed alt attribute.
            return f'<video class="gif" src="{src}" autoplay loop muted playsinline{alt_attribute_str}></video>'
        else:
            # Otherwise (alt text does NOT start with "GIF"), apply controls only, plus the processed alt attribute.
            return (
                f'<video class="video" src="{src}" controls{alt_attribute_str}></video>'
            )

    # 4. If it's not a YouTube link and not a direct video file, return the original <img> tag.
    # This ensures that regular images (e.g., .jpg, .png) are not converted to <video> tags.
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


def parse_iframe(body):
    # This function finds custom iframe syntax ![[$title]]($url) and replaces it with an iframe tag.
    pattern = r"!\[\[(.*?)\]\]\((.*?)\)"
    replacement = r'<iframe scrolling="no" title="\1" src="\2" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>'
    return re.sub(pattern, replacement, body)


def render_content(item):
    meta = item["meta"]
    body = item["body"]
    # Preprocess body
    body = parse_double_blockquote(body)
    body = parse_ascii_block(body)
    body = parse_iframe(body)
    md = markdown.Markdown(extensions=["extra", "codehilite", "tables", "sane_lists"])
    html = md.convert(body)
    html = re.sub(
        r'(<img[^>]*src=["\"]([^"\"]+)["\"][^>]*>)', lambda m: embed_media_tag(m), html
    )
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
    # Date handling
    date_val = meta.get("date")
    date_obj = None
    if date_val:
        if isinstance(date_val, datetime):
            date_obj = date_val
        elif hasattr(date_val, "strftime"):
            date_obj = date_val
        else:
            try:
                date_obj = datetime.strptime(str(date_val), "%Y-%m-%d")
            except Exception:
                date_obj = None
    date_human = human_readable_date(date_obj) if date_obj else None
    # Description
    description = meta.get("description") or f"A {item['type']} by Ethan."
    # Canonical URL
    canonical_url = f"{WEBSITE_URL}/{'blog' if item['type']=='blog' else 'projects'}/{item.get('slug','')}/"
    # Template
    template_name = "post.html" if item["type"] == "blog" else "project.html"
    template = env.get_template(template_name)
    # Render
    context = dict(
        title=meta.get("title", f"Untitled {item['type'].title()}"),
        date=date_obj.strftime("%Y-%m-%d") if date_obj else None,
        date_human=date_human,
        content=html,
        tags=meta.get("tags", []),
        tag_dir=TAG_DIR,
        slug=meta.get("slug", item.get("slug", "")),
        description=description,
        canonical_url=canonical_url,
    )
    # Add project-specific fields if present
    for k in ["link", "link_name", "link_icon", "github", "website"]:
        if k in meta:
            context[k] = meta[k]
    return template.render(**context)


def human_readable_date(date_obj):
    try:
        # Use platform-specific day format
        if os.name == "nt":
            return date_obj.strftime("%B %#d, %Y")
        else:
            return date_obj.strftime("%B %-d, %Y")
    except Exception:
        return date_obj.strftime("%B %d, %Y").replace(" 0", " ")


def parse_date(val):
    if not val:
        return None
    if hasattr(val, "strftime"):
        return val
    try:
        return datetime.strptime(str(val), "%Y-%m-%d")
    except Exception:
        return None


def get_out_dir(item):
    if item["type"] == "blog":
        return os.path.join(BLOG_OUT_DIR, item["slug"])
    else:
        return os.path.join(PROJECTS_OUT_DIR, item["slug"])


def get_url(item):
    if item["type"] == "blog":
        return f"{WEBSITE_URL}/blog/{item['slug']}/"
    else:
        return f"{WEBSITE_URL}/projects/{item['slug']}/"


def main():
    os.makedirs(BLOG_OUT_DIR, exist_ok=True)
    os.makedirs(PROJECTS_OUT_DIR, exist_ok=True)
    os.makedirs(TAG_DIR, exist_ok=True)

    # Parse all content
    content_items = []
    for src_dir, ctype in [(BLOG_SRC_DIR, "blog"), (PROJECTS_SRC_DIR, "project")]:
        for fname in os.listdir(src_dir):
            if not fname.endswith(".md"):
                continue
            meta, body = parse_markdown_with_frontmatter(os.path.join(src_dir, fname))
            slug = meta.get("slug", os.path.splitext(fname)[0])
            date_val = parse_date(meta.get("date"))
            content_items.append(
                {
                    "type": ctype,
                    "meta": meta,
                    "body": body,
                    "slug": slug,
                    "tags": meta.get("tags", []),
                    "date": date_val,
                    "index": meta.get("index", True),
                    "title": meta.get("title", f"Untitled {ctype.title()}"),
                    "description": meta.get("description", f"A {ctype} by Ethan."),
                }
            )

    # Render individual pages
    for item in content_items:
        html = render_content(item)
        out_dir = get_out_dir(item)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        item["out_path"] = out_path

    # Tag aggregation
    with open("tags.yaml", encoding="utf-8") as f:
        tag_data = yaml.safe_load(f)
    tag_posts = {tag: [] for tag in tag_data}
    tag_posts["all"] = []
    for item in content_items:
        if not item["index"]:
            continue
        tag_posts["all"].append(item)
        for tag in item["tags"]:
            if tag in tag_posts:
                tag_posts[tag].append(item)

    # Render tag index pages
    tag_template = env.get_template("tag.html")
    for tag, items in tag_posts.items():
        tag_info = tag_data.get(
            tag, {"definition": "All posts in all categories.", "text": ""}
        )
        items_sorted = sorted(
            items, key=lambda p: p["date"] or datetime.min, reverse=True
        )
        for item in items_sorted:
            item["url"] = (
                f"projects/{item['slug']}"
                if item["type"] == "project"
                else f"blog/{item['slug']}"
            )
            if item["type"] == "project" and not item["title"].endswith(" (Project)"):
                item["title"] += " (Project)"
        tag_dir = os.path.join(TAG_DIR, tag)
        os.makedirs(tag_dir, exist_ok=True)
        with open(os.path.join(tag_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(
                tag_template.render(
                    tag_title=tag.capitalize(),
                    tag_definition=tag_info["definition"],
                    tag_text=tag_info.get("text", ""),
                    posts=items_sorted,
                    get_post_description=lambda post: (
                        human_readable_date(post["date"]) if post["date"] else "No date"
                    ),
                    projects_link="/blog/projects/",
                )
            )

    # Render blog index
    blog_index_template = env.get_template("blog.html")
    tag_usage = {tag: 0 for tag in tag_data}
    for item in content_items:
        if not item["index"]:
            continue
        for tag in item["tags"]:
            if tag in tag_usage:
                tag_usage[tag] += 1
    tags_for_index = [
        {
            "slug": tag,
            "url": f"/{TAG_DIR}/{tag}",
            "title": tag.capitalize(),
            "description": info["description"],
        }
        for tag, info in sorted(
            ((t, tag_data[t]) for t in tag_data if tag_usage.get(t, 0) > 0),
            key=lambda x: (-tag_usage[x[0]], x[0]),
        )
    ]
    recent_posts = [
        {
            "title": p["title"],
            "slug": p["slug"],
            "date_human": human_readable_date(p["date"]),
            "tags": ",".join(p.get("tags", [])),
        }
        for p in sorted(
            [i for i in content_items if i["type"] == "blog" and i["index"]],
            key=lambda p: p["date"] or datetime.min,
            reverse=True,
        )
    ]
    with open(os.path.join(BLOG_OUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(
            blog_index_template.render(
                tags=tags_for_index,
                projects_link="/blog/projects/",
                recent_posts=recent_posts,
            )
        )

    # Render projects index
    projects_template = env.get_template("projects.html")
    projects_for_template = [
        {
            "title": p["title"],
            "slug": p["slug"],
            "description": p["description"],
            "date": p["date"],
            "tags": ",".join([t for t in p.get("tags", []) if t != "projects"]),
        }
        for p in sorted(
            [i for i in content_items if i["type"] == "project" and i["index"]],
            key=lambda p: p["date"] or p["title"],
            reverse=True,
        )
    ]
    with open(os.path.join(PROJECTS_OUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(projects_template.render(projects=projects_for_template))

    # Sitemap and info.json
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

    info_entries = [
        {
            "url": f"{WEBSITE_URL}/",
            "title": "Home",
            "tags": [],
            "date": None,
            "description": "The personal website of Ethan Marks (@ColourlessSpearmint)",
            "category": "static",
            "slug": "home",
        },
        {
            "url": f"{WEBSITE_URL}/about/",
            "title": "About",
            "tags": [],
            "date": None,
            "description": "About Ethan Marks (@ColourlessSpearmint)",
            "category": "static",
            "slug": "about",
        },
        {
            "url": f"{WEBSITE_URL}/blog/",
            "title": "Blog Index",
            "tags": [],
            "date": None,
            "description": "Main blog index page.",
            "category": "static",
            "slug": "index",
        },
        {
            "url": f"{WEBSITE_URL}/projects/",
            "title": "Projects Index",
            "tags": [],
            "date": None,
            "description": "Main projects index page.",
            "category": "static",
            "slug": "projects-index",
        },
    ]
    for item in content_items:
        if not item["index"]:
            continue
        url = get_url(item)
        date_str = item["date"].strftime("%Y-%m-%d") if item["date"] else None
        add_url(url, date_str or datetime.now().strftime("%Y-%m-%d"))
        info_entries.append(
            {
                "url": url,
                "title": item["title"],
                "tags": item.get("tags", []),
                "date": date_str,
                "description": item["description"],
                "category": item["type"],
                "slug": item["slug"],
            }
        )
    for tag in tag_posts:
        tag_url = f"{WEBSITE_URL}/blog/{tag}/"
        add_url(tag_url, datetime.now().strftime("%Y-%m-%d"))
        info_entries.append(
            {
                "url": tag_url,
                "title": tag.capitalize(),
                "tags": [tag],
                "date": None,
                "description": tag_data.get(tag, {}).get("description", ""),
                "category": "tag",
                "slug": tag,
            }
        )
    tags_index_url = f"{WEBSITE_URL}/tag/"
    add_url(tags_index_url, datetime.now().strftime("%Y-%m-%d"))
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
    ET.ElementTree(urlset).write("sitemap.xml", encoding="utf-8", xml_declaration=True)
    with open("sitemap.json", "w", encoding="utf-8") as f:
        json.dump(info_entries, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
