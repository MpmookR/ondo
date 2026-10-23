# Payment buttons (demo)

Ondo is a portfolio demo, so the Apple Pay and Google Pay buttons on /checkout are **static**:

- **Apple Pay** uses button artwork as an image (Apple's script-drawn button only appears where
  Apple Pay can really run, so it can't be a static demo button). Exported from the
  [Apple Pay / Google Pay Buttons](https://www.figma.com/design/8cH3lix4Bf6ZJ0lpk1f4sw/) Figma
  community file, pill shape, 343×50. Shown 44px tall, centred in a full-width button of the same
  black (or white) so it reads as one wide button:

  | File | Button |
  | --- | --- |
  | `apple-pay-pay-black.png` | "Pay with Apple Pay", black (subscription, light theme) |
  | `apple-pay-pay-white.png` | "Pay with Apple Pay", white (subscription, dark theme) |
  | `apple-pay-buy-black.png` | "Buy with Apple Pay", black (one-off box, light theme) |
  | `apple-pay-buy-white.png` | "Buy with Apple Pay", white (one-off box, dark theme) |

  These are 1× renders. Exporting the same components from Figma as SVG and changing `.png` to
  `.svg` in `WalletButtons.tsx` makes them sharper on Retina screens.

- **Google Pay** is drawn by Google's own script (`createButton()`), which works in every browser.
  We only set the allowed options: "Pay with…" or "Buy with…" (matching Apple Pay), black on
  light / white on dark, full width, 44px tall, pill corners.
- **No payment API is called.** There are no availability checks, no Apple Pay session or QR code,
  and no Google Pay sheet. Both buttons always show, and tapping one goes straight to the order
  confirmation, the same as the Pay button.

The acceptance marks in `design-assets/payment-kits` (kept locally, not in git) are for showing which payment methods are accepted
(for example in a footer), not for building buttons.

Guidelines: [Apple HIG: Apple Pay](https://developer.apple.com/design/human-interface-guidelines/apple-pay) ·
[Google Pay brand guidelines](https://developers.google.com/pay/api/web/guides/brand-guidelines)
