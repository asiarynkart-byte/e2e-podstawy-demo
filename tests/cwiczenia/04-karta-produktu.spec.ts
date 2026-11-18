import { test, expect } from '@playwright/test';

// Ćwiczenie 04b: ta sama cena promocyjna na kafelku, na karcie produktu i w koszyku.
// Karta: docs/cwiczenia/04-locatory-codegen.md (część 04b)
// Gdy test będzie gotowy, zamień `test.fixme` na `test`. Dopóki jest fixme, Playwright go pomija.
// Konto tester11 ma osobny koszyk: testy z ćwiczeń 02 i 04 dodają produkty do koszyka konta user.

test.fixme('cena promocyjna kremu jest taka sama na kafelku, karcie produktu i w koszyku', async ({ page }) => {
  // TODO 1: zaloguj się jako tester11 / czarny-piatek-2026.
  // TODO 2: na stronie „Produkty” znajdź kafelek „Krem do twarzy na dzień” (sekcja „Oferta na Czarny Piątek” pod tabelą).
  //         Sprawdź w kafelku: cena 26,39 zł, stara cena 32,99 zł, plakietka -20%.
  // TODO 3: kliknij nazwę produktu w kafelku. Sprawdź nagłówek karty produktu i te same trzy rzeczy.
  // TODO 4: kliknij „Dodaj do koszyka” i sprawdź komunikat „Produkt w koszyku: Krem do twarzy na dzień”.
  // TODO 5: przejdź do koszyka (link „Koszyk” w menu). Sprawdź, że wiersz kremu ma cenę 26,39 zł.
  // TODO 6: usuń krem z koszyka, żeby następne uruchomienie zaczynało od pustego koszyka.
});
