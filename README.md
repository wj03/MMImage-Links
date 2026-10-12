# MMImage Links

MMImage Links is a cross-platform directory for Asian photography and art-photo websites. It keeps the site list in the app, opens links in the system browser, and checks whether each HTTPS address responds.

## Features

- Categories for Asian, Japanese/Korean, Chinese, and art-photo sources.
- Search, favorites, single-link checks, and checks for the visible list.
- Android and iOS builds use Capacitor's native HTTP client. Windows uses Electron's system browser and HTTP client.
- The app only checks each site's home page. It does not scrape, download, or store photos.

An HTTP `403`, `401`, or `429` means the host responded but restricted the request; it does not necessarily mean the site is unavailable. Some networks, regions, and anti-bot systems may affect the result. Checking from a regular browser preview can also be limited by cross-origin rules.

## Build locally

```sh
npm ci
npm run compile
```

Windows desktop installer:

```sh
npm run build:desktop
```

Capacitor native projects are generated for each build runner:

```sh
npx cap add android
npx cap sync android
```

The iOS IPA produced by GitHub Actions is unsigned. Sign it with the Apple developer certificate and provisioning profile before installing it on a device. Android's release APK is signed with the generated debug key for sideloading.

## Releases

Push a `v*` tag or run **Build and publish installers** from GitHub Actions. The workflow builds a Windows `.exe`, Android `.apk`, and unsigned iOS `.ipa`, then attaches all three to the GitHub Release.

## Sources

The source directory is maintained in [src/sites.ts](src/sites.ts). Link availability and site policies can change; the in-app check reports the response at the time it runs.
