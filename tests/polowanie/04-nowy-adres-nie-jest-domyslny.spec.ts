import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// Polowanie: dodanie adresu w profilu nie zmienia adresu domyślnego.
// Wymaganie P12 z docs/projekt.md: nowy adres staje się domyślny dopiero po „Ustaw jako domyślny”.

// Unikalna nazwa, żeby nie pomylić adresu z adresami innych testów
const nazwa = `Polowanie ${Date.now()}`;

test.afterEach(async ({ request }) => {
  // Sprzątanie: usuń adres dodany przez test
  const lista = await (await request.get('/api/account/addresses')).json();
  for (const adres of lista.filter((a: { name: string }) => a.name === nazwa)) {
    expect((await request.delete(`/api/account/addresses/${adres.id}`)).status()).toBe(200);
  }
});

test('nowy adres w profilu nie jest domyślny, domyślny zostaje „Adres główny”', async ({ request }) => {
  await zalogujPrzezApi(request);

  const odpowiedz = await request.post('/api/account/addresses', {
    data: { name: nazwa, street: 'ul. Biurowa 7', postal_code: '00-950', city: 'Warszawa', phone: '600 700 800' },
  });
  expect(odpowiedz.status()).toBe(201);
  expect((await odpowiedz.json()).default).toBe(false);

  // Na liście domyślny jest dalej adres główny (id 0)
  const lista = await (await request.get('/api/account/addresses')).json();
  expect(lista).toContainEqual(expect.objectContaining({ id: 0, name: 'Adres główny', default: true }));
  expect(lista).toContainEqual(expect.objectContaining({ name: nazwa, default: false }));
});
