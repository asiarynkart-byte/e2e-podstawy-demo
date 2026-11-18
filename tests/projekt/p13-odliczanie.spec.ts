import { test, expect } from '@playwright/test';

// Projekt P13: odliczanie do Czarnego Piątku (docs/projekt.md).
// Nagłówek X-Namssor-Teraz ustawia „dzisiejszą” datę tylko w tym żądaniu (opis w /api/docs).
// Endpoint jest publiczny, więc test się nie loguje.
// Zmiana wymagań Bożeny z 13:00 (karta 12b): zamiast 20.11 sprawdzamy dzień przed startem i dzień startu.

const daty = [
  {
    data: '2026-11-26',
    dni: 1,
    komunikat: 'Czarny Piątek w Namssorze startuje 27.11.2026. Do startu promocji został 1 dzień.',
  },
  {
    data: '2026-11-27',
    dni: 0,
    komunikat: 'Czarny Piątek w Namssorze trwa! Tylko dziś najniższe ceny.',
  },
];

test.describe('P13: odliczanie do Czarnego Piątku w API', () => {
  // Osobny test dla każdej daty; data w nazwie, żeby nazwy się nie powtarzały
  for (const { data, dni, komunikat } of daty) {
    test(`${data}: days_left ${dni} i komunikat dla tej daty`, async ({ request }) => {
      const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': data } });

      expect(odpowiedz.status()).toBe(200);
      const promocja = await odpowiedz.json();
      expect(promocja.days_left).toBe(dni);
      expect(promocja.message).toBe(komunikat);
    });
  }

  test('data „jutro” w nagłówku daje status 400', async ({ request }) => {
    const odpowiedz = await request.get('/api/promocja', { headers: { 'X-Namssor-Teraz': 'jutro' } });

    expect(odpowiedz.status()).toBe(400);
  });
});
