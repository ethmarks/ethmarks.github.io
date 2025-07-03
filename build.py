import os
import markdown
import yaml
import re
from itertools import groupby
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import xml.etree.ElementTree as ET
import json

BLOG_SRC_DIR = "md_src/blog_src"
BLOG_OUT_DIR = "blog"
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
    alt_match = re.search(r'alt=["\\]([^"\\]*)["\\]', img_tag)
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
        processed_alt_text = original_alt_text
        if original_alt_text.lower().startswith("gif"):
            processed_alt_text = re.sub(r"^[gG][iI][fF]\s*", "", original_alt_text)
        alt_attribute_str = f' alt="{processed_alt_text}"' if processed_alt_text else ""
        if original_alt_text.lower().startswith("gif"):
            return f'<figure><video class="gif" src="{src}" autoplay loop muted playsinline{alt_attribute_str}></video></figure>'
        else:
            return f'<figure><video class="video" src="{src}" controls{alt_attribute_str}></video></figure>'

    # 4. If it's not a YouTube link and not a direct video file, wrap the original <img> tag in <figure>.
    return f"<figure>{img_tag}</figure>"


def parse_double_blockquote(body):
    """
    Finds blocks of `>>` quoted text and converts them to centered blockquotes,
    while ignoring any `>>` inside of ```code blocks```.
    """

    # Define a helper function to process a matched `>>` block.
    # This is where the stanza logic lives, now in one clean place.
    def format_centered_block(match):
        # Get the full matched block (e.g., ">> line1\n>> \n>> line2")
        block_text = match.group(0)
        # 1. Clean the lines: remove '>>' and leading space.
        lines = [line[2:].lstrip() for line in block_text.strip().split("\n")]
        # 2. Group lines into stanzas separated by empty lines.
        stanzas = [
            list(g) for k, g in groupby(lines, key=lambda x: x.strip() == "") if not k
        ]
        # 3. Format each stanza into a <p> tag with <br> for newlines.
        html_stanzas = [f"<p>{'<br>\n'.join(stanza)}</p>\n" for stanza in stanzas]
        # 4. Wrap the whole thing in the blockquote.
        return f"<blockquote class='centered-blockquote'>\n{''.join(html_stanzas)}\n</blockquote>"

    # Split the body by code blocks to process non-code sections independently.
    parts = body.split("```")
    processed_parts = []

    for i, part in enumerate(parts):
        if i % 2 == 0:  # This is a non-code part
            # Use a regex to find all consecutive lines starting with '>>'
            pattern = re.compile(r"^(?:>>.*(?:\n|$))+", re.MULTILINE)
            processed_part = pattern.sub(format_centered_block, part)
            processed_parts.append(processed_part)
        else:
            # Add it back unmodified, with the fences.
            processed_parts.append(f"```{part}```")

    return "".join(processed_parts)


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
    # This function finds custom iframe syntax ![[$title]]($url) and replaces it with an iframe tag,
    # but does not match if $title is exactly "Test".
    pattern = r"!\[\[(?!Test\]\])([^\]]+)\]\]\((.*?)\)"
    replacement = r'<iframe scrolling="no" title="\1" src="\2" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>'
    return re.sub(pattern, replacement, body)


def process_media_tags(html_content):
    # Converts image tags to video/iframe tags where appropriate.
    pattern = r'(<img[^>]*src=["\"]([^"\"]+)["\"][^>]*>)'
    return re.sub(pattern, lambda m: embed_media_tag(m), html_content)


def unwrap_media_elements(html_content):
    # Removes paragraph tags from around media elements.
    html_content = re.sub(
        r"<p>\s*(<(?:img|video|iframe|figure)[^>]*?>)\s*</p>",
        r"\1",
        html_content,
        flags=re.IGNORECASE | re.DOTALL,
    )
    html_content = re.sub(
        r"<p>\s*(<(?:video|iframe|figure).*?</(?:video|iframe|figure)>)\s*</p>",
        r"\1",
        html_content,
        flags=re.IGNORECASE | re.DOTALL,
    )
    return html_content


def add_target_blank_to_external_links(html_content):
    # Adds target="_blank" to external links.
    def replacer(match):
        a_tag, href = match.groups()
        is_external = (
            href.startswith(("http://", "https://")) and WEBSITE_URL not in href
        )
        if is_external and "target=" not in a_tag:
            return a_tag.replace(">", ' target="_blank">', 1)
        return a_tag

    pattern = r'(<a\s+[^>]*?href="([^"]*)"[^>]*?>)'
    return re.sub(pattern, replacer, html_content, flags=re.IGNORECASE)


def render_content(item):
    meta = item["meta"]
    body = item["body"]

    # --- Preprocessors ---
    body = parse_double_blockquote(body)
    body = parse_ascii_block(body)
    body = parse_iframe(body)

    # --- Main Markdown conversion ---
    md = markdown.Markdown(extensions=["extra", "codehilite", "tables", "sane_lists"])
    html = md.convert(body)

    # --- Postprocessors ---
    html = process_media_tags(html)
    html = unwrap_media_elements(html)
    html = add_target_blank_to_external_links(html)

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
    description = meta.get("description") or f"A post by Ethan."
    # Canonical URL
    canonical_url = f"{WEBSITE_URL}/blog/{item.get('slug','')}/"
    # Template
    template_name = "post.html"
    template = env.get_template(template_name)
    # Render
    context = dict(
        title=meta.get("title", "Untitled Post"),
        date=date_obj.strftime("%Y-%m-%d") if date_obj else None,
        date_human=date_human,
        content=html,
        tags=meta.get("tags", []),
        tag_dir=TAG_DIR,
        slug=meta.get("slug", item.get("slug", "")),
        description=description,
        canonical_url=canonical_url,
    )
    for k in ["link", "link_name", "link_icon"]:
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
    return os.path.join(BLOG_OUT_DIR, item["slug"])


def get_url(item):
    return f"{WEBSITE_URL}/blog/{item['slug']}/"


def parse_all_content():
    """Parse all content from the source directory."""
    content_items = []
    for fname in os.listdir(BLOG_SRC_DIR):
        if not fname.endswith(".md"):
            continue
        meta, body = parse_markdown_with_frontmatter(os.path.join(BLOG_SRC_DIR, fname))
        slug = meta.get("slug", os.path.splitext(fname)[0])
        date_val = parse_date(meta.get("date"))
        content_items.append(
            {
                "type": "blog",
                "meta": meta,
                "body": body,
                "slug": slug,
                "tags": meta.get("tags", []),
                "date": date_val,
                "index": not meta.get("noindex", False),
                "title": meta.get("title", "Untitled Post"),
                "description": meta.get("description", "A post by Ethan."),
            }
        )
    return content_items


def render_individual_pages(content_items):
    """Render individual pages for each content item."""
    for item in content_items:
        html = render_content(item)
        out_dir = get_out_dir(item)
        os.makedirs(out_dir, exist_ok=True)
        out_path = os.path.join(out_dir, "index.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        item["out_path"] = out_path


def aggregate_tags(content_items):
    """Aggregate tags from all content items."""
    with open("tags.yaml", encoding="utf-8") as f:
        tag_data = yaml.safe_load(f)
    tag_posts = {tag: [] for tag in tag_data}
    for item in content_items:
        if not item["index"]:
            continue
        for tag in item["tags"]:
            if tag in tag_posts:
                tag_posts[tag].append(item)
    return tag_posts, tag_data


def render_tag_index_pages(tag_posts, tag_data):
    """Render index pages for each tag."""
    tag_template = env.get_template("tag.html")
    for tag, items in tag_posts.items():
        tag_info = tag_data.get(
            tag, {"definition": "All posts in all categories.", "text": ""}
        )
        items_sorted = sorted(
            items, key=lambda p: p["date"] or datetime.min, reverse=True
        )
        for item in items_sorted:
            item["url"] = f"blog/{item['slug']}"
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
                )
            )


def render_blog_index(content_items, tag_data):
    """Render the main blog index page."""
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
                recent_posts=recent_posts,
            )
        )
    return tags_for_index


def render_all_tags_page(tags_for_index):
    """Render the page that lists all tags."""
    all_tags_template = env.get_template("tags.html")
    with open(os.path.join(TAG_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(all_tags_template.render(tags=tags_for_index))


def generate_sitemap_and_info_json(content_items, tag_posts, tag_data):
    """Generate sitemap.xml and sitemap.json."""
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


def main():
    os.makedirs(BLOG_OUT_DIR, exist_ok=True)
    os.makedirs(TAG_DIR, exist_ok=True)

    content_items = parse_all_content()
    render_individual_pages(content_items)
    tag_posts, tag_data = aggregate_tags(content_items)
    render_tag_index_pages(tag_posts, tag_data)
    tags_for_index = render_blog_index(content_items, tag_data)
    render_all_tags_page(tags_for_index)
    generate_sitemap_and_info_json(content_items, tag_posts, tag_data)


if __name__ == "__main__":
    main()
