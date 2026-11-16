import { test, expect } from '@playwright/test';

// Ćwiczenie 04, scenariusz A: filtr kategorii na stronie „Produkty”.
// Karta: docs/cwiczenia/04-locatory-codegen.md
// Kod nagraj Codegenem, wklej tutaj i popraw. Potem zamień `test.fixme` na `test`.

test('filtr „Dziecko” pokazuje tylko produkty dla dzieci', async ({ page }) => {
  // TODO 1: otwórz stronę „Produkty” (adres /).
  await page.goto('/');

  // TODO 2: w polu „Kategoria” wybierz „Dziecko” i kliknij „Filtruj”.
  await page.getByLabel('Kategoria').selectOption('Dziecko');
  await page.getByRole('button', { name: 'Filtruj' }).click();

  // TODO 3: sprawdź, że „Liczba produktów” to 3.
  await expect(page.getByText('Liczba produktów:')).toHaveText('Liczba produktów: 3');

  // TODO 4: sprawdź, że widać trzy produkty dla dzieci.
  // Szukamy wierszy tabeli, bo te same nazwy są też na kafelkach pod tabelą.
  await expect(page.getByRole('row').filter({ hasText: 'Chusteczki nawilżane dla dzieci' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'Szampon dla dzieci' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'Krem ochronny dla dzieci' })).toBeVisible();

  // TODO 5: sprawdź, że NIE widać „Szampon nawilżający” (kategoria Włosy).
  // Codegen tego nie nagra: brak elementu sprawdzamy ręcznie przez toHaveCount(0).
  await expect(page.getByRole('row').filter({ hasText: 'Szampon nawilżający' })).toHaveCount(0);
});
