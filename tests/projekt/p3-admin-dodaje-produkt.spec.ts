import { test, expect } from '@playwright/test';
import { zaloguj } from '../pomocnicze/logowanie';

// Projekt P3: administrator dodaje produkt (docs/projekt.md). Tylko lokalnie: hasło admina na serwerze zna trener.
// Panel nie ma usuwania produktów, więc test nie sprząta. Zamiast tego każda nazwa jest unikalna (data i godzina),
// dzięki czemu drugi przebieg nie trafia na produkt z pierwszego.

test('P3: admin dodaje produkt, a klient znajduje go w sklepie za 12,50 zł jako dostępny', async ({ page }) => {
  const nazwa = `Produkt testowy ${new Date().toISOString().replace(/[-:.TZ]/g, '')}`;

  await zaloguj(page, 'admin', 'admin123');
  await page.goto('/admin');
  // Link w kafelku „Panel admina” › „Produkty” (w menu jest drugi link „Produkty”: strona sklepu)
  await page.getByRole('main').getByRole('link', { name: 'Produkty' }).click();

  // Stan przed akcją: produktu o tej nazwie nie ma
  await expect(page.getByRole('row').filter({ hasText: nazwa })).toHaveCount(0);

  await page.getByLabel('Nazwa').fill(nazwa);
  await page.getByLabel('Kategoria').fill('Testowe');
  await page.getByLabel('Cena (zł)').fill('12,50');
  await page.getByLabel('Stan').fill('5');
  await page.getByRole('button', { name: 'Dodaj produkt' }).click();

  // Oczekiwany wynik 1: komunikat z nazwą produktu
  await expect(page.getByText(`Dodano produkt: ${nazwa}`)).toBeVisible();

  // Oczekiwany wynik 2: wyszukiwarka na stronie „Produkty” znajduje produkt
  await page.goto('/');
  await page.getByLabel('Szukaj produktu').fill(nazwa);
  await page.getByRole('button', { name: 'Filtruj' }).click();

  // Sprawdzamy w wierszu tabeli, bo pod tabelą są kafelki z tą samą nazwą i ceną
  const wiersz = page.getByRole('row').filter({ hasText: nazwa });
  await expect(wiersz).toHaveCount(1);
  await expect(wiersz).toContainText('12,50 zł');
  await expect(wiersz).toContainText('Dostępny');
  await expect(wiersz.getByRole('button', { name: `Dodaj do koszyka: ${nazwa}` })).toBeEnabled();
});
