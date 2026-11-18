import { test, expect } from '@playwright/test';

// Projekt P13: odliczanie do Czarnego Piątku (docs/projekt.md).
// Nagłówek X-Namssor-Teraz ustawia „dzisiejszą” datę tylko w tym żądaniu (opis w /api/docs).
// Endpoint jest publiczny, więc test się nie loguje.

test.describe('P13: odliczanie do Czarnego Piątku w API', () => {
  test('20.11.2026: do startu zostało 7 dni', async ({ request }) => {
    const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': '2026-11-20' } });

    expect(odpowiedz.status()).toBe(200);
    const promocja = await odpowiedz.json();
    expect(promocja.days_left).toBe(7);
    expect(promocja.message).toBe('Czarny Piątek w Namssorze startuje 27.11.2026. Do startu promocji zostało 7 dni.');
  });

  test('data „jutro” w nagłówku daje status 400', async ({ request }) => {
    const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': 'jutro' } });

    expect(odpowiedz.status()).toBe(400);
  });
});
