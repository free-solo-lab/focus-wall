# Focus Wall

Focus Wall is a small Chrome extension for blocking distracting websites. It lets you keep a local blocklist, redirects blocked pages to a friendly extension page, and includes a content-script fallback for sites that Chrome's declarative rules do not catch reliably.

The interface is English by default, with Russian available from the settings page.

## Features

- Add domains or full URLs to a blocklist.
- Automatically normalize input to hostnames.
- Cover `www` and non-`www` variants, plus subdomains.
- Enable, disable, or delete rules from the settings page.
- Redirect blocked top-level pages to a local blocked page.
- Block subframes with Chrome's `declarativeNetRequest`.
- Use a `document_start` content-script fallback for more reliable blocking.
- Switch the UI between English and Russian.

## Requirements

- Node.js and npm.
- Desktop Chrome or another Chromium browser that supports Manifest V3 extensions.

Chrome on Android and iOS does not run this extension directly. For mobile-device-wide blocking, use a DNS-based tool such as NextDNS, AdGuard DNS, or Control D.

## Install From Source

```bash
npm install
npm run build
```

Then load the built extension in Chrome:

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `dist` folder from this project.

After changing the source code, run `npm run build` again and press `Reload` for Focus Wall on `chrome://extensions`.

## Usage

Open the Focus Wall settings page from the extension icon or Chrome's extension details page.

- Enter a domain or URL, such as `youtube.com` or `https://news.ycombinator.com`.
- Click `Add`.
- Use `Disable` or `Enable` to pause or resume a rule.
- Use `Delete` to remove a site from the list.
- Use the language selector to switch between English and Russian.

If you add `example.com`, Focus Wall also covers `www.example.com` and deeper subdomains. If you add `www.example.com`, it also covers `example.com`.

## Development

```bash
npm run dev
npm test
npm run build
```

- `npm run dev` builds the extension in watch mode.
- `npm test` runs unit tests with Vitest.
- `npm run build` creates the production extension in `dist`.

## Permissions

Focus Wall requests these Chrome extension permissions:

- `storage`: stores settings and the blocklist.
- `declarativeNetRequest`: creates Chrome-native blocking and redirect rules.
- `<all_urls>` host access: lets the extension match user-selected blocked domains and run the fallback content script.

The extension does not ship analytics, ads, or a remote service. The current blocklist is stored locally through Chrome extension storage.

## Contributing

Issues and pull requests are welcome. Please keep changes focused, run the test suite before submitting, and include tests for behavior that changes domain normalization, rule generation, storage, or blocking.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE).
