import { test, expect } from '@playwright/test';

// Ćwiczenie 10: test napisany według skilla /test-e2e.
// Wymaganie: filtr kategorii „Dziecko” na stronie produktów pokazuje dokładnie 3 produkty.

test('filtr „Dziecko” pokazuje dokładnie 3 produkty', async ({ page }) => {
  await page.goto('/');

  // Wiersze produktów w tabeli: tylko one mają przycisk „Dodaj do koszyka” (wiersz nagłówka go nie ma).
  const wierszeProduktow = page.getByRole('row').filter({ has: page.getByRole('button', { name: /Dodaj do koszyka/ }) });

  // Stan przed akcją: bez filtra produktów jest więcej niż 3
  await expect(wierszeProduktow).not.toHaveCount(3);

  await page.getByLabel('Kategoria').selectOption('Dziecko');
  await page.getByRole('button', { name: 'Filtruj' }).click();

  // Dokładnie 3 produkty: licznik i liczba wierszy w tabeli (liczba z wymagania)
  await expect(page.getByText('Liczba produktów:')).toHaveText('Liczba produktów: 3');
  await expect(wierszeProduktow).toHaveCount(3);

  // Każdy z tych wierszy ma kategorię „Dziecko”
  await expect(wierszeProduktow.filter({ hasText: 'Dziecko' })).toHaveCount(3);
});
