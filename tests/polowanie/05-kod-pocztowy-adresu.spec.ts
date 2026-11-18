import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// Polowanie: walidacja kodu pocztowego przy dodawaniu adresu w profilu.
// Wymaganie z /api/docs: postal_code w formacie 00-000; błędne dane dają 400.

const nazwa = `Zly kod ${Date.now()}`;

test.afterEach(async ({ request }) => {
  // Sprzątanie na wypadek, gdyby aplikacja jednak zapisała adres z błędnym kodem
  const lista = await (await request.get('/api/account/addresses')).json();
  for (const adres of lista.filter((a: { name: string }) => a.name === nazwa)) {
    await request.delete(`/api/account/addresses/${adres.id}`);
  }
});

test('adres z kodem pocztowym „00950” jest odrzucony z błędem pola postal_code', async ({ request }) => {
  await zalogujPrzezApi(request);

  const odpowiedz = await request.post('/api/account/addresses', {
    data: { name: nazwa, street: 'ul. Biurowa 7', postal_code: '00950', city: 'Warszawa', phone: '600 700 800' },
  });

  expect(odpowiedz.status()).toBe(400);
  expect(await odpowiedz.json()).toEqual({
    error: 'Błędne dane',
    errors: [{ field: 'postal_code', message: 'Kod pocztowy musi mieć format 00-000' }],
  });

  // Adres nie trafił na listę
  const lista = await (await request.get('/api/account/addresses')).json();
  expect(lista).not.toContainEqual(expect.objectContaining({ name: nazwa }));
});
