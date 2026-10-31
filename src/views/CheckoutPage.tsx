'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { catalogue } from '@/data/catalogue';
import { planById } from '@/data/plans';
import { formatDay } from '@/lib/dates';
import { formatPrice } from '@/lib/format';
import { formatCardNumber, formatExpiry, validateCard, type CardErrors, type CardInput } from '@/lib/payment';
import {
  Checkbox,
  DatePicker,
  Divider,
  Icon,
  OrderReview,
  PageHeader,
  SavingsLine,
  Steps,
  TextField,
  WalletButtons,
  cardClass,
  useBox,
} from '@/components';
import { CHECKOUT_STEPS, STEP_PAYMENT } from '@/data/labels';
import { boxHref } from '@/lib/routes';


/** Last step: review the first box, confirm the delivery date, pay. Demo only: nothing is charged. */
export function CheckoutPage() {
  const { state, dispatch, totals, theme, setTheme } = useBox();
  const plan = planById(state.plan ?? 'once');
  const subscription = plan.discount > 0;

  const [card, setCard] = useState<CardInput>({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState<CardErrors>({});
  const [sameBilling, setSameBilling] = useState(true);
  const [paid, setPaid] = useState(false);
  const refs = {
    number: useRef<HTMLInputElement>(null),
    expiry: useRef<HTMLInputElement>(null),
    cvc: useRef<HTMLInputElement>(null),
  };

  const update = (field: keyof CardInput, value: string) => {
    setCard((c) => ({ ...c, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateCard(card);
    setErrors(found);
    const first = (['number', 'expiry', 'cvc'] as const).find((f) => found[f]);
    if (first) refs[first].current?.focus();
    else setPaid(true);
  };

  const header = (
    <PageHeader backHref="/" theme={theme} onThemeChange={setTheme}>
      {totals.discount > 0 && <SavingsLine saving={formatPrice(totals.discount)} learnMoreHref={null} />}
      <Steps steps={CHECKOUT_STEPS} current={STEP_PAYMENT} />
    </PageHeader>
  );

  if (state.plan === null && totals.count > 0 && !paid) {
    return (
      <>
        {header}
        <main className="mx-auto flex max-w-column flex-col items-center gap-16 px-16 py-64 text-center">
          <h1 className="font-heading text-title">Choose your delivery first</h1>
          <p className="font-sans text-body text-text-muted">Pick how often you&apos;d like your box, or a one-off, then come back.</p>
          <Link href={`${boxHref}#delivery`} className="flex min-h-48 items-center rounded-pill bg-action px-24 font-sans text-label font-bold text-action-text">
            Choose delivery
          </Link>
        </main>
      </>
    );
  }

  if (totals.count === 0 && !paid) {
    return (
      <>
        {header}
        <main className="mx-auto flex max-w-column flex-col items-center gap-16 px-16 py-64 text-center">
          <h1 className="font-heading text-title">Your box is empty</h1>
          <p className="font-sans text-body text-text-muted">Add a drink or two before you check out.</p>
          <Link href={boxHref} className="flex min-h-48 items-center rounded-pill bg-action px-24 font-sans text-label font-bold text-action-text">
            Back to your box
          </Link>
        </main>
      </>
    );
  }

  if (paid) {
    return (
      <>
        {header}
        <main className="mx-auto flex max-w-column flex-col gap-16 px-16 py-48">
          <div className={`flex flex-col items-center gap-12 p-24 text-center ${cardClass}`} role="status">
            <span className="grid size-48 place-items-center rounded-pill bg-primary text-on-primary">
              <Icon name="check" />
            </span>
            <h1 className="font-heading text-heading">You&apos;re all set</h1>
            <p className="font-sans text-body">
              Your first Ondo box arrives on{' '}
              <strong>{state.deliveryDate ? formatDay(state.deliveryDate) : 'your chosen day'}</strong>.
              {subscription && ` Then every ${plan.label}; skip, swap or pause any time.`}
            </p>
            <p className="rounded-sm bg-bg-subtle px-12 py-8 font-sans text-body-sm text-text-muted">
              This is a demo: no payment was taken.
            </p>
            <Link href={boxHref} className="mt-8 flex min-h-48 items-center rounded-pill border border-brand px-24 font-sans text-label font-bold">
              Back to your box
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {header}

      <main className="mx-auto w-full max-w-content px-16 pb-48 pt-16 lg:grid lg:grid-cols-12 lg:items-start lg:gap-24 lg:px-24 lg:pt-24">
        {/* Summary first on mobile; a sticky sidebar on desktop. */}
        <div className="mx-auto flex max-w-column flex-col gap-16 lg:sticky lg:top-24 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:max-w-none">
          <OrderReview
            lines={state.lines}
            catalogue={catalogue}
            totals={totals}
            plan={plan}
            deliveryDate={state.deliveryDate}
            openOnDesktop
          />
          <div className={`relative z-40 flex items-center justify-between gap-12 p-16 ${cardClass}`}>
            <div className="flex flex-col gap-2">
              <span className="font-sans text-body-sm text-text-muted">First delivery</span>
              <span className="font-sans text-label font-bold uppercase tracking-wide">
                {state.deliveryDate ? formatDay(state.deliveryDate) : 'Choose a date'}
              </span>
            </div>
            <DatePicker
              value={state.deliveryDate}
              onChange={(date) => dispatch({ type: 'setDeliveryDate', date })}
              label="First delivery date"
              trigger="link"
            />
          </div>
        </div>

        <form
          noValidate
          onSubmit={submit}
          aria-labelledby="payment-title"
          className="mx-auto mt-24 flex max-w-column flex-col gap-16 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0 lg:max-w-none"
        >
          <div className="flex flex-col gap-4">
            <h1 id="payment-title" className="font-heading text-heading">
              Your payment details
            </h1>
            <p className="font-sans text-body-sm text-text-muted">Secure, encrypted payment</p>
          </div>

          <WalletButtons onPay={() => setPaid(true)} purpose={subscription ? 'pay' : 'buy'} theme={theme} />

          <Divider>or pay with card</Divider>

          <fieldset className={`flex flex-col gap-16 p-16 ${cardClass}`}>
            <legend className="sr-only">Card details</legend>
            <div className="flex items-baseline justify-between gap-8">
              <span aria-hidden="true" className="font-sans text-label font-bold">
                Card details
              </span>
              <span className="font-sans text-body-sm text-text-muted">Visa · Mastercard · Amex</span>
            </div>
            <TextField
              ref={refs.number}
              label="Card number"
              name="cc-number"
              autoComplete="cc-number"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={card.number}
              onChange={(e) => update('number', formatCardNumber(e.target.value))}
              error={errors.number}
            />
            <div className="grid grid-cols-2 gap-12">
              <TextField
                ref={refs.expiry}
                label="Expiry date"
                name="cc-exp"
                autoComplete="cc-exp"
                inputMode="numeric"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => update('expiry', formatExpiry(e.target.value))}
                error={errors.expiry}
              />
              <TextField
                ref={refs.cvc}
                label="Security code"
                name="cc-csc"
                autoComplete="cc-csc"
                inputMode="numeric"
                placeholder="CVC"
                maxLength={4}
                value={card.cvc}
                onChange={(e) => update('cvc', e.target.value.replace(/\D/g, ''))}
                error={errors.cvc}
                hint="3 digits on the back (4 on the front for Amex)"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-8">
            <legend className="mb-4 font-sans text-label font-bold">Billing address</legend>
            <Checkbox checked={sameBilling} onChange={(e) => setSameBilling(e.target.checked)}>
              Same as delivery address
            </Checkbox>
            {!sameBilling && (
              <div className="flex flex-col gap-12">
                <TextField label="Address line 1" name="billing-address" autoComplete="billing address-line1" />
                <TextField label="Postcode" name="billing-postcode" autoComplete="billing postal-code" className="max-w-200" />
              </div>
            )}
          </fieldset>

          <button
            type="submit"
            className="flex min-h-52 w-full items-center justify-center rounded-pill bg-action font-sans text-label font-bold uppercase tracking-wide text-action-text transition-opacity duration-120 ease-brew hover:opacity-90"
          >
            Pay {formatPrice(totals.total)}
          </button>

          <p className="font-sans text-footnote text-text-muted">
            {subscription
              ? `Ondo is a flexible subscription: your box comes every ${plan.label} and you can skip, swap, pause or cancel any time. `
              : 'This is a one-off order with no subscription. '}
            By placing your order you agree to our{' '}
            <a href="#terms" className="underline underline-offset-2">
              terms and conditions
            </a>
            .
          </p>

          <ul className={`flex flex-col gap-8 p-16 font-sans text-body-sm ${cardClass}`}>
            {[
              'Skip, swap or cancel any time, with no commitment',
              "Letterbox-friendly: you don't need to be in",
              'Plastic-free, recyclable packaging',
            ].map((text) => (
              <li key={text} className="flex items-start gap-8">
                <Icon name="check" size={20} className="mt-2 text-primary" />
                {text}
              </li>
            ))}
          </ul>
        </form>
      </main>
    </>
  );
}
