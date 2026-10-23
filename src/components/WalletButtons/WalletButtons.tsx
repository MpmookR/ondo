'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import type { Theme } from '@/lib/box';

/** Wording: "Pay with…" for a subscription, "Buy with…" for a one-off box. */
export type WalletPurpose = 'pay' | 'buy';
type Wallet = 'apple' | 'google';

export interface WalletButtonsProps {
  /** Tapping either button: the demo goes straight to the end of the journey. */
  onPay: (wallet: Wallet) => void;
  purpose: WalletPurpose;
  /** Picks each brand's button colour: black on light backgrounds, white on dark. */
  theme?: Theme;
}

/**
 * Apple Pay button artwork (pill, "Pay with" / "Buy with", black and white), exported from the
 * Apple Pay / Google Pay Buttons Figma community file. Apple's script-drawn button only appears
 * where Apple Pay can really run, so this static demo uses the artwork instead.
 */
const APPLE_BUTTON = (purpose: WalletPurpose, style: 'black' | 'white') =>
  `/brand/payments/apple-pay-${purpose}-${style}.png`;
const GOOGLE_PAY_SDK = 'https://pay.google.com/gp/p/js/pay.js';
/** Google's buttonRadius takes pixels: half the 44px button height makes a pill. */
const GOOGLE_RADIUS = 22;

/**
 * Static express-checkout buttons for the demo: Apple Pay button artwork and Google's
 * script-drawn button. No payment API is called. Both always show, full width and 44px tall; tapping
 * one calls onPay, which takes the visitor to the order confirmation.
 */
export function WalletButtons({ onPay, purpose, theme = 'light' }: WalletButtonsProps) {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  /** Apple's artwork file is missing: leave the button out rather than show an empty gap. */
  const [appleMissing, setAppleMissing] = useState(false);
  const appleImg = useRef<HTMLImageElement>(null);
  const googleSlot = useRef<HTMLDivElement>(null);
  const onPayRef = useRef(onPay);
  onPayRef.current = onPay;

  useEffect(() => {
    if (window.google?.payments) setGoogleLoaded(true);
    // The image can fail before React hydrates, so onError alone would miss it.
    const img = appleImg.current;
    if (img && img.complete && img.naturalWidth === 0) setAppleMissing(true);
  }, [purpose, theme]);

  // Google's button is a DOM node from their script; rebuild it when the theme or wording changes.
  useEffect(() => {
    if (!googleLoaded || !googleSlot.current || !window.google) return;
    const client = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
    googleSlot.current.replaceChildren(
      client.createButton({
        onClick: () => onPayRef.current('google'),
        buttonColor: theme === 'dark' ? 'white' : 'black',
        buttonType: purpose,
        buttonSizeMode: 'fill',
        buttonRadius: GOOGLE_RADIUS,
        buttonLocale: 'en',
      }),
    );
  }, [googleLoaded, theme, purpose]);

  return (
    <div className="flex w-full flex-col gap-8">
      <Script src={GOOGLE_PAY_SDK} strategy="afterInteractive" onReady={() => setGoogleLoaded(true)} />

      <button
        type="button"
        hidden={appleMissing}
        onClick={() => onPay('apple')}
        aria-label={`${purpose === 'pay' ? 'Pay' : 'Buy'} with Apple Pay`}
        // Full width: the button is Apple's black (white on dark) and the artwork sits in the middle;
        // the artwork's own pill edges blend into the same colour, like Apple's resizable button.
        className="flex h-44 w-full items-center justify-center overflow-hidden rounded-pill bg-wallet-apple"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={appleImg}
          src={APPLE_BUTTON(purpose, theme === 'dark' ? 'white' : 'black')}
          alt=""
          width={302}
          height={44}
          onLoad={() => setAppleMissing(false)}
          onError={() => setAppleMissing(true)}
          className="h-44 w-auto"
        />
      </button>
      <div ref={googleSlot} className="h-44 w-full" />

      <p className="text-center font-sans text-footnote text-text-muted">One tap: your address and card come from your wallet.</p>
    </div>
  );
}
