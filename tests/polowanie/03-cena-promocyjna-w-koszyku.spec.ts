import { test, expect } from '@playwright/test';
import { zaloguj, zalogujPrzezApi } from '../pomocnicze/logowanie';

// Polowanie: cena promocyjna w koszyku (wymaganie P9 z docs/projekt.md).
// „Krem do twarzy na dzień”: cena 32,99 zł, promocja -20%, cena po promocji 26,39 zł,
// ta sama na karcie produktu i w koszyku.

test.afterEach(async ({ request }) => {
  // Sprzątanie przez API, także gdy test padł w połowie: pusty koszyk konta pary
  await zalogujPrzezApi(request);
  expect((await request.delete('/api/cart')).status()).toBe(200);
});

test('krem z promocją -20% kosztuje w koszyku 26,39 zł, tyle co na karcie produktu', async ({ page }) => {
  await zaloguj(page);

  // Stan przed akcją: kremu nie ma w koszyku
  await page.goto('/koszyk');
  await expect(page.getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' })).toHaveCount(0);

  // Karta produktu: cena po promocji 26,39 zł
  await page.goto('/produkt/5');
  await expect(page.getByTestId('product-price')).toHaveText('26,39 zł');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();

  // Koszyk: ta sama cena w wierszu kremu (ilość 1)
  await page.goto('/koszyk');
  const wiersz = page.getByRole('row').filter({ hasText: 'Krem do twarzy na dzień' });
  await expect(wiersz).toContainText('26,39 zł');
});
