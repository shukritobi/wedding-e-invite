# Wedding E-Invite — Meera Concept

A mobile-first Malaysian wedding e-invitation concept for **Friday, 4 September 2026**.

The design is an original **modern botanical editorial** direction: deep burgundy, ivory, dusty rose, fine floral line art and a clean timeline. It is inspired by the feature patterns common across Malaysian e-invite services, not copied from any individual template.

## Included

- Opening envelope-style screen
- Personalised guest name using `?to=Guest%20Name`
- Countdown timer
- Wedding itinerary timeline
- Google Maps and Waze buttons
- WhatsApp RSVP form
- WhatsApp / native share function
- Add-to-calendar `.ics` download
- DuitNow QR area
- Hosted payment-link area for Billplz, ToyyibPay or senangPay
- Mobile bottom navigation
- GitHub Pages deployment workflow

## Edit the wedding details

Almost all content is controlled from [`config.js`](config.js).

Update:

```js
couple: {
  bride: "Meera",
  groom: "Actual partner name",
  monogram: "M&A",
  brideParents: "...",
  groomParents: "..."
}
```

Then replace the sample venue, actual Maps/Waze URLs, itinerary and WhatsApp number.

For a personalised URL:

```text
https://shukritobi.github.io/wedding-e-invite/?to=Nurul%20sekeluarga
```

## Salam kaut / money gift setup

### Lowest-friction option: DuitNow QR

Replace `assets/qr-placeholder.svg` with the approved DuitNow QR image and update the account display text in `config.js`.

### Hosted payment page

Create a secure hosted payment form/link in Billplz, ToyyibPay or senangPay, then add the public checkout URL:

```js
paymentLinks: [
  {
    label: "Beri melalui Billplz",
    provider: "FPX / card / e-wallet",
    url: "https://your-secure-payment-link.example"
  }
]
```

**Never put gateway secret keys, API keys or private credentials in this public repository.** GitHub Pages is a static front end. Dynamic bill creation and verified payment callbacks require a separate backend or serverless function.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the repository as a static site.

Expected URL:

```text
https://shukritobi.github.io/wedding-e-invite/
```

If the first run reports that Pages is not configured, open **Repository Settings → Pages → Source → GitHub Actions**, then rerun the workflow.

## Competitor feature scan used for the concept

- Kadlah: mobile-first layouts, itinerary, Maps/Waze, instant sharing
- KahwinNow: floral, motion and khat themes; RSVP, money gift, guestbook and calendar
- Kad Kahwin Digital: QR Pay, Maps/Waze, RSVP and multimedia
- LakarCinta: animation-led premium templates, countdown and calendars
- Kunjung / Tuan Majlis: minimalist, floral and royal directions with salam kaut and WhatsApp sharing

## Before sending this to the bride

1. Confirm the partner's name and both families' preferred wording.
2. Confirm the exact venue, address, Maps pin and Waze link.
3. Confirm the actual itinerary.
4. Obtain permission before publishing a couple photo, phone number, bank name or DuitNow QR.
5. Replace the placeholder payment link and test it in an incognito window.
6. Set `demoMode: false` in `config.js`.
