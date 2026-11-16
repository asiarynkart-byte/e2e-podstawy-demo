import { test, expect } from '@playwright/test';

// Ćwiczenie 04, scenariusz B: dodanie produktu do koszyka i usunięcie go.
// Karta: docs/cwiczenia/04-locatory-codegen.md
// Kod nagraj Codegenem, wklej tutaj i popraw. Potem zamień `test.fixme` na `test`.

test('usunięty produkt znika z koszyka', async ({ page }) => {
  // TODO 1: zaloguj się jako user / user123.
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('user');
  await page.getByLabel('Hasło').fill('user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByRole('heading', { name: 'Produkty' })).toBeVisible();

  // TODO 2: dodaj do koszyka „Żel pod prysznic”.
  // Przycisk szukamy w wierszu tabeli, bo nazwa produktu jest też na kafelku.
  const wierszProduktu = page.getByRole('row').filter({ hasText: 'Żel pod prysznic' });
  await wierszProduktu.getByRole('button', { name: 'Dodaj do koszyka' }).click();

  // TODO 3: otwórz koszyk i sprawdź, że „Żel pod prysznic” w nim jest.
  await page.getByRole('link', { name: 'Koszyk' }).click();
  const wierszKoszyka = page.getByRole('row').filter({ hasText: 'Żel pod prysznic' });
  await expect(wierszKoszyka).toBeVisible();

  // TODO 4: kliknij „Usuń” w wierszu „Żel pod prysznic”.
  await wierszKoszyka.getByRole('button', { name: 'Usuń' }).click();

  // TODO 5: sprawdź, że wiersza „Żel pod prysznic” już nie ma.
  // Po usunięciu adres to /koszyk?usunieto=1, dlatego bez $ na końcu.
  await expect(page).toHaveURL(/\/koszyk/);
  await expect(wierszKoszyka).toHaveCount(0);
});
