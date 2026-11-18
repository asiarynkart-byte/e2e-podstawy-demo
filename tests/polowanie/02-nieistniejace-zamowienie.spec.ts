import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// Polowanie: zapytanie o zamówienie, którego nie ma.
// Wymaganie z /api/docs: GET /api/orders/{number} zwraca 404, gdy zamówienia nie ma.

test('GET /api/orders/ZAM-9999 zwraca 404 „Nie ma takiego zamówienia”', async ({ request }) => {
  await zalogujPrzezApi(request);

  const odpowiedz = await request.get('/api/orders/ZAM-9999');

  expect(odpowiedz.status()).toBe(404);
  expect(await odpowiedz.json()).toEqual({ error: 'Nie ma takiego zamówienia' });
});
