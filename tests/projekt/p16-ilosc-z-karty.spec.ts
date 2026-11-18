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

test('P16: 3 sztuki „Żel pod prysznic” z karty produktu dają w koszyku wartość 29,97 zł', async ({ page }) => {
  await zaloguj(page);
  await page.goto('/produkt/9');
  await expect(page.getByRole('heading', { name: 'Żel pod prysznic' })).toBeVisible();

  await page.getByLabel('Ilość').fill('3');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();

  await page.goto('/koszyk');
  const wiersz = page.getByRole('row').filter({ hasText: 'Żel pod prysznic' });

  // Oczekiwany wynik 1: ilość 3 i wartość 29,97 zł w wierszu żelu
  await expect(wiersz.getByTestId('cart-item-qty')).toHaveText('3');
  await expect(wiersz.getByRole('cell', { name: '29,97 zł', exact: true })).toBeVisible();

  // Oczekiwany wynik 2: koszyk ma jedną pozycję, więc suma kolumny „Wartość” to 29,97 zł, tyle samo co „razem”
  await expect(page.getByTestId('cart-item')).toHaveCount(1);
  await expect(page.getByTestId('cart-total')).toHaveText('29,97 zł');
});
