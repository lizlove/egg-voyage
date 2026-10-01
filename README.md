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

## Changing the sending email address

The site never sees the "from" address. `/api/subscribe` only hands the subscriber's email to Kit, and Kit sends the confirmation email. Switching sender is a Kit + DNS change, not a code change (unless you move to a different Kit account — then update `KIT_API_KEY` / `KIT_FORM_ID` per the sections above).

Skipping the DNS steps is the likely reason the first test confirmation emails landed in spam: Gmail showed "This message isn't authenticated" and `you@yourdomain.com via n.convertkit.com`, and a `p=quarantine` DMARC policy on the domain makes it worse. Do both parts below.

### 1. Add the address in Kit

1. Use an address on a domain you own, not Gmail/Yahoo/etc.
2. Kit → **Settings → Email → Add From Address**. A name is required.
3. Click **Verify Your Email** in the message Kit sends to that address.
4. Set it as the default, and remove the old address so it isn't used by accident.
5. Check the form's confirmation email too: form → **Settings → Confirmation Email → Edit Email Contents** shows the sending address it uses.

### 2. Verify the domain (the DNS part)

1. Kit → **Settings → Email → Verified Sending Domains → Set up your Verified Sending Domain** (or **Add a Verified Sending Domain**). Enter the bare domain, e.g. `example.com`.
2. Choose **Set this up for me** (automatic, via Entri), or copy the DNS records Kit lists and add them at your DNS provider (whoever the domain's nameservers point to; `dig +short NS example.com` shows who), then click **Validate**. Copy the records exactly as Kit shows them.
3. Add Kit's DMARC record, shown on the same page (defaults to `p=none`). A domain should have only **one** DMARC TXT record at `_dmarc.example.com`. If one already exists, edit it instead of adding a second. DMARC can take 24–48 hours to validate.

If the domain also handles regular mail (Google Workspace, etc.), leave its existing MX and SPF records alone unless Kit asks you to change them. Kit's docs don't describe conflicts with other providers, so confirm normal mail still works after the change, and ask Kit support if unsure.

### 3. Check it worked

Look up what's published (use the host names Kit gave you for the DKIM/return-path records):

```
dig +short TXT _dmarc.example.com   # exactly one v=DMARC1 record
dig +short TXT example.com          # existing SPF record, should still be there
dig +short CNAME <host-from-kit>    # repeat for each record Kit asked you to add
```

Then confirm in a real inbox:

1. Run `npm run dev`, then sign up with an address you control (a `you+test@gmail.com` alias works).
2. The email should land in the inbox with a plain `you@example.com` sender, no "via" line and no yellow warning banner.
3. In Gmail, **⋮ → Show original** should show `SPF`, `DKIM` and `DMARC` all `PASS`.
4. Delete the test subscriber in Kit afterward. Signups from `npm run dev` hit the real list.

Kit notes that changing sending setup can temporarily move open rates while mailbox providers recalculate your reputation. Avoid changing other sending settings at the same time and ramp up gradually. Docs: [verify your domain](https://help.kit.com/en/articles/2502558-verify-your-domain-to-optimize-your-deliverability), [add a sending address](https://help.kit.com/en/articles/8711248-how-to-add-a-new-sending-email-address), [add a DMARC record](https://help.kit.com/en/articles/8540237-how-to-add-a-dmarc-record-to-your-verified-sending-domain), [before you verify a domain](https://help.kit.com/en/articles/9176509-what-you-should-know-before-setting-up-a-verified-sending-domain).

## TODO
latebloomer flowershop domain name