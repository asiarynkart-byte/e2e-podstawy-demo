import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// Polowanie: wygasły kod rabatowy (docs/cwiczenia/extra-d1-przegladarki-i-dane.md, krok 7).
// JESIEN10 wygasł 31.10.2026, więc nie może dać rabatu.

test.beforeEach(async ({ request }) => {
  // Koszyk konta pary: tylko „Mydło w kostce”, bez kodu
  await zalogujPrzezApi(request);
  expect((await request.delete('/api/cart')).status()).toBe(200);
  expect((await request.post('/api/cart/items', { data: { product_id: 11, qty: 1 } })).status()).toBe(201);
});

test.afterEach(async ({ request }) => {
  // Sprzątanie: pusty koszyk usuwa też kod rabatowy
  expect((await request.delete('/api/cart')).status()).toBe(200);
});

test('wygasły kod JESIEN10 jest odrzucony komunikatem „Kod JESIEN10 wygasł 31.10.2026.”', async ({ request }) => {
  const odpowiedz = await request.post('/api/cart/discount', { data: { code: 'JESIEN10' } });

  expect(odpowiedz.status()).toBe(400);
  expect(await odpowiedz.json()).toEqual({
    error: 'Błędne dane',
    errors: [{ field: 'code', message: 'Kod JESIEN10 wygasł 31.10.2026.' }],
  });

  // Koszyk bez rabatu: do zapłaty pełna cena mydła 4,99 zł
  const koszyk = await (await request.get('/api/cart')).json();
  expect(koszyk.total_cents).toBe(499);
});
