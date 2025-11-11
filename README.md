# Knox Ramsey Thrillers
#Dark Recipe

## Field Guide canon check

Run `python3 tools/check_dramatis_personae.py` whenever you touch `fieldguide/dramatis-personae/index.html`. The script reads `fieldguide/_canon.json` and fails if any canonical name is missing, keeping the dramatis list in sync with the story bible.

To activate the automatic pre-commit guard, set once per clone:

```
git config core.hooksPath .githooks
```
