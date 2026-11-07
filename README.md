# Postroom CSV

Open `index.html` in a current browser. The draft editor works locally. The server runtime adds SMTP delivery.

1. Load or paste a CSV of up to 512 KiB and 500 contacts, or try the example. The header needs an `email` column and can include `name`.
2. Review invalid addresses and case-insensitive duplicates. The import supports quoted fields, escaped quotes and embedded line breaks.
3. Write a subject and message with optional `{{name}}` and `{{email}}` placeholders.
4. Download the personalized drafts as JSON for review.

Postroom CSV prepares drafts in the browser and can send reviewed batches through your SMTP account when the local runtime is configured. Its code, interface and example data were created independently for this project. [Project that inspired the topic](https://github.com/YildizDikme/multi-email-sender).

## Local server and agent connection

Install Node 22 or newer and Git. From this repository run:

```sh
npm ci
npm start
```

Open the loopback URL printed by the command. The runtime is pinned to a specific revision of [Project Agent Bridge](https://github.com/Mert-Oezdemir/project-agent-bridge).

To connect an MCP-compatible agent, run `npm run mcp:config --silent` and add its `mcpServers` entry to your host. Run `npm run doctor` to see local project and account configuration.

Chrome or Edge is needed for agent browser controls. You can set `CHROME` in `.env`, or run `npx playwright install chromium` to install a browser.

Copy `.env.example` to `.env` before adding account settings. Keep `.env` local. Restart the runtime after changing it.

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` and your SMTP account credentials. Validate the CSV, review the batch, check the sending authorization and send. Per-recipient outcomes are stored in `.bridge/mail/`. Repeated calls to the same batch do not resend completed deliveries. An unknown outcome needs review with the provider.
