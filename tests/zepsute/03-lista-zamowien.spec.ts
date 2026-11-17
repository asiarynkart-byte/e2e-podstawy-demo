import { test, expect } from '@playwright/test';

// Wymaganie: po zalogowaniu klient widzi na stronie „Moje zamówienia” co najmniej jedno zamówienie.

test('klient widzi swoje zamówienia', async ({ page }) => {
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('user');
  await page.getByLabel('Hasło').fill('user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako user')).toBeVisible();

  await page.goto('/zamowienia');

  // Lista ładuje się 0,5–2 s. count() liczy od razu i nie czeka,
  // a asercja web-first ponawia sprawdzenie, aż pojawi się co najmniej jeden wiersz.
  const wierszeZamowien = page.getByRole('row').filter({ hasText: 'ZAM-' });
  await expect(wierszeZamowien).not.toHaveCount(0);
});
