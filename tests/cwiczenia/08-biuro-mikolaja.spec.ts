import { test, expect } from '@playwright/test';
import fs from 'node:fs';

// Ćwiczenie 08, część B: zamówienie firmowe „Biuro Mikołaja” → status → faktura.
// Przypadek testowy: docs/scenariusze/biuro-mikolaja.md (kroki 1–10),
// ten sam scenariusz w Gherkinie: docs/scenariusze/biuro-mikolaja.feature.
// Test zakłada własne zamówienie, ZAM-1007 zostaje nietknięte.

test('Biuro Mikołaja: zamówienie na firmę, status „Wysłane” i faktura z NIP nabywcy', async ({ page }) => {
  // Krok 1. Logowanie klienta firmowego. Koszyk musi być pusty (warunek wstępny):
  // po nieudanym przebiegu mogły w nim zostać kalendarze. DELETE /api/cart opróżnia koszyk
  // zalogowanego klienta; page.request korzysta z logowania z tej przeglądarki.
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('biuro');
  await page.getByLabel('Hasło').fill('biuro123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako biuro (user)')).toBeVisible();
  await page.request.delete('/api/cart');

  // Krok 2. Karta produktu, ilość 10, „Dodaj do koszyka”
  await page.goto('/produkt/21');
  await page.getByLabel('Ilość').fill('10');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByText('Produkt w koszyku: Kalendarz adwentowy 2026')).toBeVisible();

  // Krok 3. Koszyk: jedna pozycja, kalendarz w ilości 10, razem 399,90 zł
  await page.getByRole('link', { name: 'Koszyk' }).click();
  const wierszKalendarza = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
  await expect(wierszKalendarza.getByTestId('cart-item-qty')).toHaveText('10');
  await expect(page.getByText('Pozycji: 1, razem: 399,90 zł')).toBeVisible();

  // Krok 4. Faktura na firmę i złożenie zamówienia
  await page.getByLabel('Faktura na firmę').check();
  await page.getByLabel('NIP').fill('241-224-12-28');
  await page.getByLabel('Nazwa firmy').fill('Biuro Mikołaja');
  await page.getByRole('button', { name: 'Złóż zamówienie (płatność przy odbiorze)' }).click();
  // Komunikat znika po kilku sekundach, więc sprawdzamy go od razu.
  await expect(page.getByText(/Złożono zamówienie: ZAM-\d+/)).toBeVisible();
  await expect(page).toHaveURL(/zlozono=ZAM-\d+/);
  const numer = new URL(page.url()).searchParams.get('zlozono') ?? '';

  // Krok 5. Strona zamówienia z listy „Moje zamówienia”
  await page.getByRole('link', { name: numer }).click();
  await expect(page.getByRole('heading', { name: `Zamówienie ${numer}` })).toBeVisible();
  await expect(page.getByText('Status: Nowe')).toBeVisible();
  await expect(page.getByText('Faktura na firmę: Biuro Mikołaja, NIP 2412241228')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pobierz fakturę' })).toBeVisible();

  // Krok 6. Wylogowanie, logowanie jako admin, zamówienie w panelu admina
  await page.getByRole('button', { name: 'Wyloguj' }).click();
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('admin');
  await page.getByLabel('Hasło').fill('admin123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako admin')).toBeVisible();
  await page.goto(`/admin/zamowienia/${numer}`);
  await expect(page.getByText('Status: Nowe')).toBeVisible();
  await expect(page.getByLabel('Status zamówienia')).toBeVisible();

  // Krok 7. Status „Opłacone”
  await page.getByLabel('Status zamówienia').selectOption('Opłacone');
  await page.getByRole('button', { name: 'Zapisz status' }).click();
  await expect(page.getByText('Status: Opłacone')).toBeVisible();

  // Krok 8. Status „Wysłane”
  await page.getByLabel('Status zamówienia').selectOption('Wysłane');
  await page.getByRole('button', { name: 'Zapisz status' }).click();
  await expect(page.getByText('Status: Wysłane')).toBeVisible();

  // Krok 9. Wylogowanie, logowanie jako biuro, status „Wysłane” u klienta
  await page.getByRole('button', { name: 'Wyloguj' }).click();
  await page.goto('/logowanie');
  await page.getByLabel('Login').fill('biuro');
  await page.getByLabel('Hasło').fill('biuro123');
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await expect(page.getByText('Zalogowano jako biuro (user)')).toBeVisible();
  await page.goto(`/zamowienia/${numer}`);
  await expect(page.getByText('Status: Wysłane')).toBeVisible();

  // Krok 10. Pobranie faktury: najpierw czekanie na pobranie, potem kliknięcie
  const pobieranie = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Pobierz fakturę' }).click();
  const plik = await pobieranie;
  expect(plik.suggestedFilename()).toBe(`faktura-${numer}.html`);

  // Faktura to strona HTML: wczytujemy ją do przeglądarki i sprawdzamy zwykłymi lokatorami.
  const tresc = fs.readFileSync(await plik.path(), 'utf8');
  await page.setContent(tresc);
  await expect(page.getByText('NIP nabywcy: 2412241228')).toBeVisible();
  await expect(page.getByText('Biuro Mikołaja')).toBeVisible();
  const pozycja = page.getByRole('row').filter({ hasText: 'Kalendarz adwentowy 2026' });
  // Ilość, cena i wartość szukamy w wierszu kalendarza po dokładnej treści komórki.
  await expect(pozycja.getByRole('cell', { name: '10', exact: true })).toBeVisible();
  await expect(pozycja.getByRole('cell', { name: '39,99 zł', exact: true })).toBeVisible();
  await expect(pozycja.getByRole('cell', { name: '399,90 zł', exact: true })).toBeVisible();
  await expect(page.getByText('Razem do zapłaty: 399,90 zł')).toBeVisible();
});
