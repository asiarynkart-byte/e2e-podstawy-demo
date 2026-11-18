import { test, expect } from '@playwright/test';

// Ćwiczenie 08, część A: zmiana adresu dostawy.
// Przypadki testowe: docs/scenariusze/zmiana-adresu.md (TC-ADR-01, TC-ADR-02)
// i docs/scenariusze/zmiana-adresu.feature (scenariusz i szablon z Przykładami).

// Adres startowy konta user (warunki wstępne przypadku testowego).
const adresStartowy = {
  ulica: 'ul. Przykładowa 12/3',
  kod: '00-001',
  miasto: 'Warszawa',
  telefon: '500 100 200',
};

// Wiersze tabeli „Przykłady” z pliku .feature: błędna wartość w jednym polu.
const bledneDane = [
  { pole: 'Kod pocztowy', wartosc: '31001', komunikat: 'Kod pocztowy musi mieć format 00-000' },
  { pole: 'Telefon', wartosc: '12345', komunikat: 'Telefon musi mieć 9 cyfr (opcjonalnie z +48)' },
  { pole: 'Miasto', wartosc: '', komunikat: 'Podaj miasto' },
];

test.describe('Zmiana adresu dostawy', () => {
  // Wszystkie testy zmieniają adres jednego konta user, więc biegną po kolei.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // TC-ADR-01, krok 1: logowanie jako user
    await page.goto('/logowanie');
    await page.getByLabel('Login').fill('user');
    await page.getByLabel('Hasło').fill('user123');
    await page.getByRole('button', { name: 'Zaloguj' }).click();
    await expect(page.getByText('Zalogowano jako user (user)')).toBeVisible();

    // Krok 2: „Adres dostawy” z menu
    await page.getByRole('link', { name: 'Adres dostawy' }).click();
    await expect(page.getByRole('heading', { name: 'Zmiana adresu dostawy' })).toBeVisible();
  });

  // Po teście (także nieudanym) przywracamy adres startowy, żeby inne testy widziały ten sam stan.
  test.afterEach(async ({ page }) => {
    await page.goto('/konto/adres');
    await page.getByLabel('Ulica i numer').fill(adresStartowy.ulica);
    await page.getByLabel('Kod pocztowy').fill(adresStartowy.kod);
    await page.getByLabel('Miasto').fill(adresStartowy.miasto);
    await page.getByLabel('Telefon').fill(adresStartowy.telefon);
    await page.getByRole('button', { name: 'Zapisz', exact: true }).click();
    await expect(page.getByText('Zapisano adres dostawy.')).toBeVisible();
  });

  test('poprawny adres zapisuje się i zostaje po odświeżeniu strony', async ({ page }) => {
    // Krok 2: pola zawierają adres startowy (stan przed akcją)
    await expect(page.getByLabel('Ulica i numer')).toHaveValue(adresStartowy.ulica);
    await expect(page.getByLabel('Kod pocztowy')).toHaveValue(adresStartowy.kod);
    await expect(page.getByLabel('Miasto')).toHaveValue(adresStartowy.miasto);
    await expect(page.getByLabel('Telefon')).toHaveValue(adresStartowy.telefon);

    // Krok 3: wpisanie nowego adresu; pola pokazują wpisane wartości
    await page.getByLabel('Ulica i numer').fill('ul. Lipowa 7');
    await page.getByLabel('Kod pocztowy').fill('31-001');
    await page.getByLabel('Miasto').fill('Kraków');
    await page.getByLabel('Telefon').fill('600 200 300');
    await expect(page.getByLabel('Ulica i numer')).toHaveValue('ul. Lipowa 7');
    await expect(page.getByLabel('Kod pocztowy')).toHaveValue('31-001');
    await expect(page.getByLabel('Miasto')).toHaveValue('Kraków');
    await expect(page.getByLabel('Telefon')).toHaveValue('600 200 300');

    // Krok 4: zapis i komunikat
    await page.getByRole('button', { name: 'Zapisz', exact: true }).click();
    await expect(page.getByText('Zapisano adres dostawy.')).toBeVisible();

    // Krok 5: po odświeżeniu pola nadal zawierają nowy adres (adres zapisał się na koncie)
    await page.reload();
    await expect(page.getByLabel('Ulica i numer')).toHaveValue('ul. Lipowa 7');
    await expect(page.getByLabel('Kod pocztowy')).toHaveValue('31-001');
    await expect(page.getByLabel('Miasto')).toHaveValue('Kraków');
    await expect(page.getByLabel('Telefon')).toHaveValue('600 200 300');
  });

  // Dla każdego wiersza z Przykładów powstaje osobny test.
  for (const dane of bledneDane) {
    test(`błędne pole „${dane.pole}” blokuje zapis adresu`, async ({ page }) => {
      await page.getByLabel(dane.pole).fill(dane.wartosc);
      await page.getByRole('button', { name: 'Zapisz', exact: true }).click();

      // Komunikat na górze, komunikat pod polem, brak komunikatu o zapisie
      await expect(page.getByRole('alert')).toHaveText('Popraw błędy w formularzu (1).');
      await expect(page.getByText(dane.komunikat)).toBeVisible();
      await expect(page.getByText('Zapisano adres dostawy.')).toHaveCount(0);

      // TC-ADR-02, krok 4: po ponownym otwarciu „Adres dostawy” adres jest nadal startowy
      await page.getByRole('link', { name: 'Adres dostawy' }).click();
      await expect(page.getByLabel('Ulica i numer')).toHaveValue(adresStartowy.ulica);
      await expect(page.getByLabel('Kod pocztowy')).toHaveValue(adresStartowy.kod);
      await expect(page.getByLabel('Miasto')).toHaveValue(adresStartowy.miasto);
      await expect(page.getByLabel('Telefon')).toHaveValue(adresStartowy.telefon);
    });
  }
});
