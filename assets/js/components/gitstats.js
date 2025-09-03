async function getGitStats(username) {
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);

        if (!reposResponse.ok) {
            throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
        }

        const repos = await reposResponse.json();

        // Use Promise.all to make requests in parallel
        const commitCounts = await Promise.all(
            repos.map(async (repo) => {
                try {
                    const response = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`);

                    if (response.ok) {
                        const linkHeader = response.headers.get('link');
                        if (linkHeader) {
                            const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                            return match ? parseInt(match[1]) : 1;
                        } else {
                            const commits = await response.json();
                            return commits.length;
                        }
                    }
                    return 0;
                } catch (error) {
                    console.warn(`Failed to fetch commits for ${repo.name}:`, error);
                    return 0;
                }
            })
        );

        const totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);

        return {
            commitCount: totalCommits,
            repoCount: repos.length
        };
    } catch (error) {
        throw new Error(`Error fetching git stats: ${error.message}`);
    }
}

getGitStats('ethmarks').then(stats => {
    const commitElem = document.getElementById('commitcount');
    if (commitElem) {
        commitElem.textContent = stats.commitCount;
    }

    const repoElem = document.getElementById('repocount');
    if (repoElem) {
        repoElem.textContent = stats.repoCount;
    }
}).catch(error => {
    console.error('Failed to fetch git stats:', error);
});
