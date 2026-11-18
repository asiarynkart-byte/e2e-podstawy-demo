import { test, expect } from '@playwright/test';

// Wymaganie: zalogowany klient klika „Dodaj do koszyka” przy produkcie
// „Balsam do ciała” i ten produkt trafia do jego koszyka.

test('dodanie balsamu do ciała do koszyka', async ({ page }) => {
  // Logowanie jako klient
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('user');
  await page.getByLabel('Hasło').fill('user123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako user')).toBeVisible();

  // Wiersz produktu na liście
  await page.goto('/');
  const wiersz = page.getByRole('row').filter({ hasText: 'Balsam do ciała' });

  await wiersz.getByRole('button', { name: 'Dodaj do koszyka' }).click();

  // Komunikat pojawia się tylko po udanym dodaniu (przed kliknięciem go nie ma)
  await expect(page.getByText('Produkt w koszyku: Balsam do ciała')).toBeVisible();

  // Produkt jest w koszyku klienta
  await page.getByRole('link', { name: 'Koszyk' }).click();
  const wierszKoszyka = page.getByRole('row').filter({ hasText: 'Balsam do ciała' });
  await expect(wierszKoszyka).toBeVisible();

  // Sprzątanie: balsam wraca z koszyka, żeby następne uruchomienie zaczynało od zera
  await wierszKoszyka.getByRole('button', { name: 'Usuń' }).click();
  await expect(wierszKoszyka).toHaveCount(0);
});
