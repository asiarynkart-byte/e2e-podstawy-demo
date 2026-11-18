import { test, expect } from '@playwright/test';
import { zaloguj, zalogujPrzezApi } from '../pomocnicze/logowanie';

// Projekt P16: ilość z karty produktu (docs/projekt.md).

test.beforeEach(async ({ request }) => {
  // Stan przed akcją: pusty koszyk, więc w kolumnie „Wartość” będzie tylko dodany produkt
  await zalogujPrzezApi(request);
  expect((await request.delete('/api/cart')).status()).toBe(200);
});

test.afterEach(async ({ request }) => {
  // Sprzątanie: pusty koszyk konta (usuwa dodany produkt)
  expect((await request.delete('/api/cart')).status()).toBe(200);
});

// Zmiana wymagań Bożeny z 13:00 (karta 12b): Biuro Mikołaja kupuje 24 kalendarze zamiast 3 żeli.

test('P16: 24 sztuki „Kalendarz adwentowy 2026” z karty produktu dają w koszyku wartość 959,76 zł', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/produkt/21');
  await expect(page.getByRole('heading', { name: 'Kalendarz adwentowy 2026' })).toBeVisible();

  await page.getByLabel('Ilość').fill('24');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();

  await page.goto('/koszyk');
  const wiersz = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });

  // Oczekiwany wynik 1: ilość 24 i wartość 959,76 zł w wierszu kalendarza
  await expect(wiersz.getByTestId('cart-item-qty')).toHaveText('24');
  await expect(wiersz.getByRole('cell', { name: '959,76 zł', exact: true })).toBeVisible();

  // Oczekiwany wynik 2: koszyk ma jedną pozycję, więc suma kolumny „Wartość” to 959,76 zł, tyle samo co „razem”
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-total')).toHaveText('959,76 zł');
});
