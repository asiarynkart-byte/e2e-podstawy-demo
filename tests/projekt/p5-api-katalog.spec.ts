import { test, expect } from '@playwright/test';

// Projekt P5: katalog produktów w API (docs/projekt.md).
// Endpointy produktów są publiczne, więc test nie loguje się.

test.describe('P5: katalog produktów w API', () => {
  test('kategoria Dziecko zwraca 3 produkty, każdy z tej kategorii', async ({ request }) => {
    const odpowiedz = await request.get('/api/products?category=Dziecko');

    // Oczekiwany wynik: status 200
    expect(odpowiedz.status()).toBe(200);

    // Oczekiwany wynik: lista 3 produktów, każdy z category równym "Dziecko"
    const produkty = await odpowiedz.json();
    expect(produkty).toHaveLength(3);
    for (const produkt of produkty) {
      expect(produkt.category).toBe('Dziecko');
    }
  });

  test('nieistniejący produkt 999 zwraca 404 z komunikatem', async ({ request }) => {
    const odpowiedz = await request.get('/api/products/999');

    // Oczekiwany wynik: status 404 i treść { "error": "Nie ma takiego produktu" }
    expect(odpowiedz.status()).toBe(404);
    expect(await odpowiedz.json()).toEqual({ error: 'Nie ma takiego produktu' });
  });
});
