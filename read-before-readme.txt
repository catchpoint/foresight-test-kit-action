Neither github.token nor ${{secrets.GITHUB.TOKEN}} can use octokit for private repo. In order to use octokit, 
personal access token should be created in repo scope and set it to secret. Then github_token should be set 
this access token.