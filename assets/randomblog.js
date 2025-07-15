function redirectToRandomBlog() {
    const links = document.querySelectorAll("a.post-link[href]");
    if (!links.length) {
        document.body.innerText = "No blog posts found.";
        return;
    }
    const random = links[Math.floor(Math.random() * links.length)];
    window.location.href = random.getAttribute("href");
}
