import { test, expect } from '@playwright/test';
import { zalogujPrzezApi } from '../pomocnicze/logowanie';

// Polowanie: dane nabywcy na fakturze (wymaganie P10 i P14 z docs/projekt.md).
// Faktura ma NIP nabywcy z zamówienia, a nie NIP sprzedawcy (Namssor: 1234563218).
// Zamówienia klient nie anuluje (to robi admin), więc test bierze tani „Płyn do mycia naczyń”, 1 sztukę.

test('faktura zamówienia firmowego ma NIP nabywcy 1012023036', async ({ request }) => {
  await zalogujPrzezApi(request);

  const zamowienie = await request.post('/api/business-orders', {
    data: { product_id: 20, qty: 1, nip: '101-202-30-36', company: 'Biuro Mikołaja' },
  });
  expect(zamowienie.status()).toBe(201);
  const { number } = await zamowienie.json();

  const faktura = await request.get(`/api/orders/${number}/invoice`);
  expect(faktura.status()).toBe(200);
  const dane = await faktura.json();

  // Nabywca: firma i NIP z zamówienia (NIP bez myślników)
  expect(dane.buyer).toEqual({ name: 'Biuro Mikołaja', nip: '1012023036' });
});
