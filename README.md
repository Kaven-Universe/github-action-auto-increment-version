# github-action-auto-increment-version

```yml
jobs:
  upload_job:
    runs-on: ubuntu-latest
    name: Auto-increment the version number
    steps:
      - uses: actions/checkout@v3
      - name: Update
        id: version
        uses: Kaven-Universe/github-action-auto-increment-version@v1
        #with:
        #  file: "package.json"
        #  debug: true
      - name: Push
        run: |
          git config user.name kaven-robot
          git config user.email robot@wuwenkai.com
          git add -A
          git commit -m "Update version from ${{ steps.version.outputs.oldVersion }} to ${{ steps.version.outputs.newVersion }}"
          git push
```          