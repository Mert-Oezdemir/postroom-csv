# Postroom CSV

Open `index.html` in a current browser. Everything runs locally and there are no dependencies.

1. Load or paste a CSV of up to 512 KiB and 500 contacts, or try the example. The header needs an `email` column and can include `name`.
2. Review invalid addresses and case-insensitive duplicates. The import supports quoted fields, escaped quotes and embedded line breaks.
3. Write a subject and message with optional `{{name}}` and `{{email}}` placeholders.
4. Download the personalized drafts as JSON for review.

Postroom CSV prepares drafts. It does not send messages, save contact lists to browser storage, or connect to a mail provider. Its code, interface and example data were created independently for this project. [Project that inspired the topic](https://github.com/YildizDikme/multi-email-sender).
