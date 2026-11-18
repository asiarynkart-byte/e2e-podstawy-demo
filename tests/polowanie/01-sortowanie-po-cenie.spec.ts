import { test, expect } from '@playwright/test';

// Polowanie: sortowanie katalogu po cenie (GET /api/catalog?sort=...).
// Wymaganie z /api/docs: sort=cena to „od najniższej”, sort=cena-malejaco to „od najwyższej”.
// Katalog jest publiczny, więc test się nie loguje.

test('sortowanie „cena” zwraca produkty od najniższej ceny', async ({ request }) => {
  const odpowiedz = await request.get('/api/catalog?sort=cena');
  expect(odpowiedz.status()).toBe(200);

  // Ceny w kolejności z odpowiedzi i te same ceny posortowane liczbowo rosnąco
  const ceny: number[] = (await odpowiedz.json()).map((p: { promo_price_cents: number }) => p.promo_price_cents);
  const rosnaco = [...ceny].sort((a, b) => a - b);
  expect(ceny).toEqual(rosnaco);
});

test('sortowanie „cena-malejaco” zwraca produkty od najwyższej ceny', async ({ request }) => {
  const odpowiedz = await request.get('/api/catalog?sort=cena-malejaco');
  expect(odpowiedz.status()).toBe(200);

  const ceny: number[] = (await odpowiedz.json()).map((p: { promo_price_cents: number }) => p.promo_price_cents);
  const malejaco = [...ceny].sort((a, b) => b - a);
  expect(ceny).toEqual(malejaco);
});
