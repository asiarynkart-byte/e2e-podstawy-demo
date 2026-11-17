import { test, expect } from '@playwright/test';

// Projekt P2: koszyk wymaga logowania (docs/projekt.md).
// Logujemy się ręcznie na stronie, na którą przekierowała aplikacja.
// Funkcja zaloguj() z tests/pomocnicze otwiera /logowanie od nowa i zgubiłaby parametr next.

test('P2: niezalogowany klient trafia z koszyka na logowanie i po nim wraca do koszyka', async ({ page }) => {
  await page.goto('/koszyk');

  // Oczekiwany wynik 1: strona „Logowanie”, adres zawiera next=%2Fkoszyk
  await expect(page.getByRole('heading', { name: 'Logowanie' })).toBeVisible();
  await expect(page).toHaveURL(/next=%2Fkoszyk/);

  await page.getByLabel('Login').fill('user');
  await page.getByLabel('Hasło').fill('user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();

  // Oczekiwany wynik 2: klient wraca na stronę „Koszyk”, a nie na stronę główną
  await expect(page.getByText('Zalogowano jako user')).toBeVisible();
  await expect(page).toHaveURL(/\/koszyk$/);
  await expect(page.getByRole('heading', { name: 'Koszyk' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Produkty' })).toHaveCount(0);
});
