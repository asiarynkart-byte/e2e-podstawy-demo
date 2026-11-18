import { test, expect } from '@playwright/test';
import { zaloguj, zalogujPrzezApi } from '../pomocnicze/logowanie';

// Projekt P11: kod rabatowy w koszyku (docs/projekt.md).
// Trzy testy dzielą koszyk jednego konta, więc biegną po kolei.
test.describe.configure({ mode: 'serial' });

test.describe('P11: kod rabatowy w koszyku z „Mydło w kostce”', () => {
  test.beforeEach(async ({ request, page }) => {
    // Dane przez API: w koszyku jest tylko jedno „Mydło w kostce” (4,99 zł), bez kodu
    await zalogujPrzezApi(request);
    expect((await request.delete('/api/cart')).status()).toBe(200);
    expect((await request.post('/api/cart/items', { data: { product_id: 11, qty: 1 } })).status()).toBe(201);

    await zaloguj(page);
    await page.goto('/koszyk');
    await expect(page.getByRole('row').filter({ hasText: 'Mydło w kostce' })).toHaveCount(1);
    // Stan przed akcją: bez rabatu
    await expect(page.getByText('Przed rabatem:')).toHaveCount(0);
  });

  test.afterEach(async ({ request }) => {
    // Sprzątanie: pusty koszyk usuwa też kod rabatowy
    expect((await request.delete('/api/cart')).status()).toBe(200);
  });

  test('CZARNY20 jest przyjęty i daje rabat 20% (1,00 zł od 4,99 zł)', async ({ page }) => {
    await page.getByLabel('Kod rabatowy').fill('CZARNY20');
    await page.getByRole('button', { name: 'Użyj kodu' }).click();

    await expect(page.getByText('Kod CZARNY20 przyjęty: -20% na całe zamówienie.')).toBeVisible();
    // Linia pod sumą: 20% z 4,99 zł to 0,998 zł, czyli po zaokrągleniu 1,00 zł
    await expect(page.getByTestId('cart-subtotal')).toHaveText('4,99 zł');
    await expect(page.getByText('rabat (CZARNY20):')).toBeVisible();
    await expect(page.getByTestId('cart-discount')).toHaveText('-1,00 zł');
    await expect(page.getByTestId('cart-total')).toHaveText('3,99 zł');
  });

  test('NIEMA jest odrzucony komunikatem i nie daje rabatu', async ({ page }) => {
    await page.getByLabel('Kod rabatowy').fill('NIEMA');
    await page.getByRole('button', { name: 'Użyj kodu' }).click();

    await expect(page.getByText('Nie ma takiego kodu rabatowego: NIEMA')).toBeVisible();
    await expect(page.getByText('Przed rabatem:')).toHaveCount(0);
    await expect(page.getByTestId('cart-total')).toHaveText('4,99 zł');
  });

  test('WLOSY15 bez produktów z kategorii Włosy jest odrzucony komunikatem', async ({ page }) => {
    await page.getByLabel('Kod rabatowy').fill('WLOSY15');
    await page.getByRole('button', { name: 'Użyj kodu' }).click();

    await expect(
      page.getByText('Kod WLOSY15 działa tylko na produkty z kategorii Włosy. W koszyku nie ma takich produktów.'),
    ).toBeVisible();
    await expect(page.getByText('Przed rabatem:')).toHaveCount(0);
    await expect(page.getByTestId('cart-total')).toHaveText('4,99 zł');
  });
});
