import { test, expect } from '@playwright/test';

// Polowanie: produktu niedostępnego nie da się dodać do koszyka (na karcie po hotfiksie: „Chwilowo brak”).
// „Maska do włosów z olejem arganowym” ma stan 0.

test('na karcie niedostępnej maski przycisk „Dodaj do koszyka” jest wyłączony', async ({ page }) => {
  await page.goto('/produkt/3');

  await expect(page.getByRole('heading', { name: 'Maska do włosów z olejem arganowym' })).toBeVisible();
  await expect(page.getByText('Chwilowo brak', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();
});
