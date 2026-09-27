# egg-voyage
Landing page for forthcoming book Voyage Happening in an Egg

Built with [Astro](https://astro.build) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Development

```
npm install
npm run dev
```

The mailing-list signup form posts to `/api/subscribe`, which calls the [Kit](https://kit.com) API. For local dev, copy `.dev.vars.example` to `.dev.vars` and fill in:

- `KIT_API_KEY` — from your Kit account's API keys settings
- `KIT_FORM_ID` — the ID of the Kit form to add subscribers to

## Deploy

```
npx wrangler secret put KIT_API_KEY
npx wrangler secret put KIT_FORM_ID
npm run deploy
```
