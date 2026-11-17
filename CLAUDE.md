# Zasady pisania testów w tym repo

Repo szkoleniowe: aplikacja Namssor (`app/`, port 4100) i testy Playwright w TypeScript (`tests/`).
Testy czytają i oceniają testerzy, którzy dopiero uczą się kodu. Pisz prosto i czytelnie.

## Kod testu
- Importuj wyłącznie `import { test, expect } from '@playwright/test';`.
- Bez Page Object, własnych fixtures i funkcji pomocniczych, chyba że użytkownik o nie poprosi.
- Lokatory w tej kolejności: `getByRole`, `getByLabel`, `getByText`, dopiero potem `getByTestId`.
  Nie używaj selektorów CSS i XPath, `id` ani klas.
- Wiersz tabeli znajdź po treści: `page.getByRole('row').filter({ hasText: 'ZAM-1003' })`.
- Asercje web-first, które same czekają: `await expect(lokator).toBeVisible()`, `toHaveText`, `toHaveURL`.
- Nigdy `page.waitForTimeout()` ani stałych pauz. Nie sprawdzaj stanu przez `isVisible()` w `if`.
- Jeden test sprawdza jedno zachowanie. Nazwa testu po polsku opisuje oczekiwany wynik.
- Komentarze po polsku, krótkie: co robi krok i dlaczego, gdy to nieoczywiste.
- Testy API przez fixture `request`; sprawdzaj status i treść odpowiedzi.

## Review i dane testowe
- Sprawdzaj każde zdanie wymagania osobną asercją, a nazwa testu niech nie obiecuje więcej, niż sprawdzają asercje.
- Sprawdzaj efekt biznesowy (zapisane dane, status zamówienia, treść komunikatu), a nie klasę CSS, kolor czy układ strony.
- Bierz oczekiwane wartości (ceny, liczby, teksty) z wymagania, a nie przepisuj ich z tego, co dziś pokazuje strona.
- Sprawdzaj stan przed akcją i pisz asercje, które padną, gdy akcja się nie uda; nie sprawdzaj elementów widocznych już przed akcją.
- Porównuj teksty dokładnie, a każdy tekst z asercji (także z `not` i `toHaveCount(0)`) najpierw znajdź w aplikacji.
- Gdy test zmienia dane, sprzątaj po sobie w `afterEach`, tak żeby test przechodził dwa razy pod rząd i niezależnie od innych testów.
- Używaj konta z wymagania: wymaganie klienta na koncie klienta, wymaganie admina na koncie `admin`.
- Zanim oddasz test, pokaż, że pada po zmianie oczekiwanej wartości, i podaj wynik uruchomienia zamiast pisać „jestem pewien”.

## Uruchamianie
- `npx playwright test` (wszystkie), `npx playwright test <plik>` (jeden plik), `npm run test:smoke`.
- Playwright sam uruchamia aplikację (`webServer` w `playwright.config.ts`).
- Po zmianach: `npm run typecheck`. Polecenia mają działać w PowerShell 5.1 (bez `&&`).
- Stan bazy psuje się po testach zmieniających dane: `npm run db:reset` przy zatrzymanej aplikacji.

## Dane
- Konta demo: `user` / `user123` (klient), `admin` / `admin123` (administrator).
- Opis API: `app/openapi.json`, w przeglądarce http://localhost:4100/api/docs.
- Nie zmieniaj kodu aplikacji w `app/`, chyba że użytkownik wyraźnie o to prosi.
