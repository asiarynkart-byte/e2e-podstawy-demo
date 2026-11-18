Środowisko działa, npm test bez błędów.

# Ćwiczenie 03: czytanie testów

Wersja w Word (te same notatki w 7 tabelach): [notatki-cwiczenie-03.docx](notatki-cwiczenie-03.docx)

## Runda 1: testy po poprzedniku (`tests/czytanie/01`–`03`)

| Test | Co robi użytkownik | Co test sprawdza | Czego test nie sprawdza | Kiedy zrobi się czerwony |
|---|---|---|---|---|
| 01 › wyszukiwanie „zębów” znajduje dwa produkty | otwiera stronę główną, wpisuje „zębów” w pole „Szukaj produktu”, klika „Filtruj” | licznik produktów pokazuje dokładnie `2`; w tabeli są komórki o dokładnej nazwie „Pasta do zębów” i „Szczoteczka do zębów” | że kafelki pokazują te same produkty; że pole wyszukiwania zachowało wpisany tekst; że wyszukiwanie działa bez względu na wielkość liter | ktoś zmieni nazwę produktu, doda trzeci produkt ze słowem „zębów”, zepsuje filtr albo zmieni etykietę pola / przycisku |
| 01 › wyszukiwanie bez wyników pokazuje komunikat | otwiera stronę główną, wpisuje „rower”, klika „Filtruj” | widoczny jest tekst „Brak produktów spełniających kryteria.” | że licznik pokazuje `0`; że tabela i kafelki są puste | zmieni się treść komunikatu; w sklepie pojawi się produkt ze słowem „rower”; komunikat zniknie |
| 02 › Moje zamówienia › lista pokazuje zamówienia klienta z ich statusem | wchodzi na `/zamowienia`, zostaje przekierowany na logowanie, loguje się jako `user`, wraca na listę | adres kończy się na `/zamowienia`; jest nagłówek „Moje zamówienia”; wiersz ZAM-1001 zawiera „Szampon nawilżający”; wiersz ZAM-1002 zawiera „Pasta do zębów” i „Anulowane”; „Ładowanie…” znika | statusu ZAM-1001 (nazwa obiecuje statusy, sprawdzony jest tylko jeden); pozostałych zamówień klienta (1003, 1004, 1006) i ich liczby; daty, ilości, wartości | logowanie nie wróci na `/zamowienia`; zmieni się produkt albo status w danych startowych; lista się nie załaduje (API zwróci błąd) |
| 02 › Moje zamówienia › klient nie widzi zamówienia innej osoby | jak wyżej: wchodzi na `/zamowienia` i loguje się jako `user` | wiersz ZAM-1001 jest widoczny (czyli lista się załadowała), a wiersza ZAM-1005 (zamówienie admina) nie ma | że `user` nie otworzy `/zamowienia/ZAM-1005` z adresu; że API `/api/orders` nie zwraca cudzego zamówienia | lista pokaże zamówienia wszystkich klientów; ZAM-1001 zniknie z danych (np. po teście, który je anuluje / usuwa) |
| 03 › produktu niedostępnego nie da się dodać do koszyka | otwiera stronę główną i patrzy na wiersz „Serum z witaminą C” | wiersz z „Serum z witaminą C” jest widoczny i ma tekst „Niedostępny” | **tego, co obiecuje nazwa**: że przycisku „Dodaj do koszyka” nie da się użyć ani że produkt nie trafi do koszyka | serum zniknie z listy albo dostanie stan > 0; zmieni się napis „Niedostępny”. Nie zrobi się czerwony, gdy przycisk przestanie być wyłączony |

### Odpowiedzi do kroków 2–4

| Plik | Pytanie | Odpowiedź |
|---|---|---|
| 01-wyszukiwarka | Co robi `test.beforeEach` i ile razy się wykona? | Otwiera stronę główną (`/`) przed każdym testem w pliku. W pliku są 2 testy, więc wykona się 2 razy. |
| 01-wyszukiwarka | Co jest w stałej `wyszukiwarka`? | **Pole na stronie** (typ `Locator`), a nie wpisany tekst. Tekst „zębów” wpisuje dopiero `fill`. |
| 01-wyszukiwarka | Dlaczego `exact: true`? | W tym samym wierszu jest przycisk z etykietą „Dodaj do koszyka: Pasta do zębów”. Bez `exact` nazwa „Pasta do zębów” pasuje też do komórki z przyciskiem (dopasowanie fragmentu), lokator znajduje 2 elementy i Playwright zgłasza błąd „strict mode violation”. |
| 02-moje-zamowienia | Pod jaką nazwą testy są w raporcie? Co zmienia `test.describe`? | `Moje zamówienia › lista pokazuje zamówienia klienta z ich statusem` oraz `Moje zamówienia › klient nie widzi zamówienia innej osoby`. `test.describe` grupuje testy i dokleja nazwę grupy z przodu. |
| 02-moje-zamowienia | Skąd pole „Login” na `/zamowienia`? | Bez logowania `/zamowienia` przekierowuje na `/logowanie?next=/zamowienia`. Po zalogowaniu aplikacja wraca na `/zamowienia`. |
| 02-moje-zamowienia | Co się stanie po usunięciu linii z `ZAM-1001`? | Asercja `toHaveCount(0)` dla ZAM-1005 spełni się od razu, bo lista jeszcze się ładuje (0,5–2 s) i nie ma żadnych wierszy. Test byłby zielony, nawet gdyby ZAM-1005 pojawiło się chwilę później. Linia z ZAM-1001 każe najpierw poczekać na załadowanie listy. |
| 02-moje-zamowienia | Uwaga dodatkowa | Ostatnia linia z „Ładowanie…” w pierwszym teście niewiele daje: skoro wiersze są widoczne, ładowanie już się skończyło. |
| 03-produkt-niedostepny | Jakiej asercji brakuje? | `await expect(wiersz.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();` |

### Linie z `await` (krok 5): razem 28

| Plik | Liczba | Czeka na przeglądarkę (`goto`, `fill`, `click`): linie | Czeka na spełnienie oczekiwania (`expect`): linie |
|---|---|---|---|
| 01-wyszukiwarka | 9 | 6, 12, 13, 21, 22 | 15, 16, 17, 24 |
| 02-moje-zamowienia | 16 | 7, 8, 9, 10, 26, 27, 28, 29 | 12, 13, 16, 19, 20, 22, 31, 32 |
| 03-produkt-niedostepny | 3 | 6 | 10, 11 |
| Jak czeka | | `goto` czeka na załadowanie strony; `fill` na gotowe pole; `click` na widoczny i aktywny przycisk | `await expect(...)` ponawia sprawdzenie aż do skutku albo do limitu czasu (domyślnie 5 s) |

### Wynik uruchomienia (krok 6): `5 passed`

| Test | Potwierdza nazwę? | Komentarz |
|---|---|---|
| 01 › wyszukiwanie „zębów” znajduje dwa produkty | Tak | Liczba i oba produkty sprawdzone. |
| 01 › wyszukiwanie bez wyników pokazuje komunikat | Tak | Komunikat jest widoczny. |
| 02 › lista pokazuje zamówienia klienta z ich statusem | Częściowo | Sprawdzony status tylko jednego zamówienia. |
| 02 › klient nie widzi zamówienia innej osoby | Częściowo | Tylko na liście; bezpośredniego adresu nikt nie sprawdza. |
| 03 › produktu niedostępnego nie da się dodać do koszyka | **Nie** | Zielony, choć nigdzie nie próbuje dodać produktu do koszyka ani nie sprawdza przycisku. |

## Runda 2: testy od Klaudiusza (`tests/czytanie/04`–`06`)

| Test | Co sprawdza | Czego nie sprawdza |
|---|---|---|
| 04-ceny-promocyjne (jeden wiersz na cały plik) | dla 3 produktów (Odżywka, Krem na dzień, Serum): kafelek ma starą cenę, nową cenę (wpisane ręcznie w tablicy) i widoczną plakietkę | że plakietka mówi „-20%” (sprawdzona jest tylko jej widoczność); że rabat to 20%: żadna linia tego nie liczy, ceny są przepisane na sztywno; ceny w tabeli, na karcie produktu i w koszyku; że produkty bez promocji nie mają plakietki |
| 05 › karta produktu pokazuje opis i dostępność | (w funkcji) karta „Szampon nawilżający” otwiera się z nagłówkiem h1; opis zawiera „400 ml”; dostępność zawiera „Dostępny” | treści całego opisu; ceny; że przycisk „Dodaj do koszyka” jest aktywny |
| 05 › cena na karcie produktu jest taka sama jak na kafelku | (w funkcji) karta „Krem do twarzy na dzień” ma nagłówek h1; cena na karcie to `26,39 zł` | **porównania z kafelkiem**: test w ogóle nie czyta ceny z kafelka, tylko porównuje z liczbą wpisaną na sztywno; starej ceny i plakietki na karcie |
| 05 › produktu niedostępnego nie da się dodać do koszyka z karty produktu | (w funkcji) karta „Maska do włosów z olejem arganowym” ma h1; dostępność to dokładnie „Niedostępny”; przycisk „Dodaj do koszyka” jest wyłączony | że pole „Ilość” jest wyłączone; że wysłanie formularza / API odrzuci dodanie; że koszyk zostaje pusty |
| 06-filtr-kategorii (jeden wiersz na cały plik) | dla kategorii Włosy, Dziecko, Dom: po wybraniu kategorii i „Filtruj” licznik pokazuje 4 / 3 / 1, a w tabeli jest jeden przykładowy produkt tej kategorii | że **wszystkie** wiersze należą do wybranej kategorii (liczba + jeden produkt nie wykluczają innych produktów); że liczba wierszy w tabeli zgadza się z licznikiem; kafelków; pozostałych kategorii i opcji „Wszystkie” |

### Odpowiedzi do kroków 7–8

| Plik | Pytanie | Odpowiedź |
|---|---|---|
| 04-ceny-promocyjne | Ile testów i jakie nazwy? | 3 testy (pętla po 3 produktach): `Ceny promocyjne na kafelkach › Odżywka do włosów ma cenę obniżoną o 20%`, `… › Krem do twarzy na dzień ma cenę obniżoną o 20%`, `… › Serum z witaminą C ma cenę obniżoną o 20%` |
| 04-ceny-promocyjne | Która linia sprawdza „obniżoną o 20%”? | Żadna. Linia 22 porównuje cenę z liczbą policzoną ręcznie, linia 23 sprawdza tylko widoczność plakietki, nie jej tekst. Poprawka: `await expect(kafelek.getByTestId('tile-badge')).toHaveText('-20%');` |
| 05-karta-produktu | Co robi `otworzKarteProduktu`? | Otwiera stronę główną, w kafelku produktu klika link z nazwą i **sprawdza** (`expect`), że jest nagłówek h1 z nazwą produktu. To asercja ukryta w funkcji. |
| 05-karta-produktu | Ile asercji ma drugi test? | 2: nagłówek h1 (w funkcji, linia 10) i cena `26,39 zł` (linia 23). |
| 05-karta-produktu | Co mówi `CLAUDE.md` o funkcjach pomocniczych? | Bez Page Object, własnych fixtures i **funkcji pomocniczych, chyba że użytkownik o nie poprosi**. Dodatkowo import `type Page` łamie zasadę „importuj wyłącznie `{ test, expect }`”. |
| 06-filtr-kategorii | Ile testów i pełna nazwa jednego z nich? | 6 testów (3 kategorie × 2 testy), np. `Filtr kategorii › kategoria Dom › licznik pokazuje liczbę produktów w kategorii`. |
| 06-filtr-kategorii | Kolejność `beforeEach` przed „licznik…” dla Dom? | 1) zewnętrzny `beforeEach` otwiera `/`; 2) wewnętrzny wybiera „Dom” w „Kategoria” i klika „Filtruj”; 3) sam test. |
| Krok 8 | Wynik `--list` i uruchomienia | `Total: 12 tests in 3 files` (3 + 3 + 6), nazwy zgodne z odpowiedziami. Uruchomienie: `12 passed`. |

### Komentarz do Klaudiusza (krok 9)

| Test | Czego nie sprawdza | Asercja, która to naprawi |
|---|---|---|
| 05 › cena na karcie produktu jest taka sama jak na kafelku | W ogóle nie czyta ceny z kafelka, tylko porównuje kartę z wpisanym na sztywno `26,39 zł`. | Przed otwarciem karty: `await expect(page.getByRole('article', { name: 'Krem do twarzy na dzień' }).getByTestId('tile-price')).toHaveText('26,39 zł');` |

## Podsumowanie: czego testy nie sprawdzają

### Runda 1 (`tests/czytanie/01`–`03`)

| Test | Czego test nie sprawdza |
|---|---|
| 01 › wyszukiwanie „zębów” znajduje dwa produkty | że kafelki pokazują te same produkty; że pole wyszukiwania zachowało wpisany tekst; że wyszukiwanie działa bez względu na wielkość liter |
| 01 › wyszukiwanie bez wyników pokazuje komunikat | że licznik pokazuje `0`; że tabela i kafelki są puste |
| 02 › Moje zamówienia › lista pokazuje zamówienia klienta z ich statusem | statusu ZAM-1001 (nazwa obiecuje statusy, sprawdzony jest tylko jeden); pozostałych zamówień klienta (1003, 1004, 1006) i ich liczby; daty, ilości, wartości |
| 02 › Moje zamówienia › klient nie widzi zamówienia innej osoby | że `user` nie otworzy `/zamowienia/ZAM-1005` z adresu; że API `/api/orders` nie zwraca cudzego zamówienia |
| 03 › produktu niedostępnego nie da się dodać do koszyka | **tego, co obiecuje nazwa**: że przycisku „Dodaj do koszyka” nie da się użyć ani że produkt nie trafi do koszyka |

### Runda 2 (`tests/czytanie/04`–`06`)

| Test | Czego test nie sprawdza |
|---|---|
| 04-ceny-promocyjne (cały plik) | że plakietka mówi „-20%” (sprawdzona jest tylko jej widoczność); że rabat to 20%: żadna linia tego nie liczy, ceny są przepisane na sztywno; ceny w tabeli, na karcie produktu i w koszyku; że produkty bez promocji nie mają plakietki |
| 05 › karta produktu pokazuje opis i dostępność | treści całego opisu; ceny; że przycisk „Dodaj do koszyka” jest aktywny |
| 05 › cena na karcie produktu jest taka sama jak na kafelku | **porównania z kafelkiem**: test w ogóle nie czyta ceny z kafelka, tylko porównuje z liczbą wpisaną na sztywno; starej ceny i plakietki na karcie |
| 05 › produktu niedostępnego nie da się dodać do koszyka z karty produktu | że pole „Ilość” jest wyłączone; że wysłanie formularza albo API odrzuci dodanie; że koszyk zostaje pusty |
| 06-filtr-kategorii (cały plik) | że **wszystkie** wiersze należą do wybranej kategorii; że liczba wierszy w tabeli zgadza się z licznikiem; kafelków; pozostałych kategorii i opcji „Wszystkie” |

> **Naprawione:** do testu `03-produkt-niedostepny.spec.ts` dopisałam brakującą asercję `await expect(wiersz.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();`. Test przechodzi (`1 passed`).

# Ćwiczenie 07: czerwone testy

Krok 1: `npx playwright test --project=zepsute`

| Test | Pierwsza linia błędu | Co widać w trace w chwili błędu | Przyczyna (jedno zdanie) |
|---|---|---|---|
| 01 | `Error: expect(locator).toBeVisible() failed` | Po wyszukaniu „szampon” w tabeli są dwa szampony: „Szampon dla dzieci” i „Szampon nawilżający”; błąd: `strict mode violation … resolved to 4 elements` | Locator `getByRole('cell', { name: 'Szampon' })` pasuje do 4 komórek (dwie nazwy produktów i dwa przyciski „Dodaj do koszyka: Szampon…”), bo „Szampon” to tylko fragment nazwy. |
| 02 | `Error: locator.click: Test timeout of 30000ms exceeded.` | Formularz logowania z wypełnionym loginem i hasłem; przycisk ma napis „Zaloguj” | Test szuka przycisku „Zaloguj się”, a na stronie przycisk nazywa się „Zaloguj”, więc kliknięcie czeka 30 s na element, którego nie ma. |
| 03 | `Error: expect(received).toBeGreaterThan(expected)` | Strona „Moje zamówienia” z napisem „Ładowanie…”, tabeli zamówień jeszcze nie ma | `count()` liczy wiersze w jednej chwili i nie czeka, więc liczy je, zanim lista zamówień się załaduje (0,5–2 s), i dostaje 0. |
| 04 | `Error: expect(locator).toBeVisible() failed` (`getByText('Zapisano ustawienia')` → `element(s) not found`) | Strona ustawień ze „Stan: wyłączony”, ale komunikatu „Zapisano ustawienia” już nie ma | Komunikat znika po 3–5 s, a test sprawdza go dopiero po `waitForTimeout(6000)`, czyli zawsze za późno. |
| 05 | `Error: locator.click: Test timeout of 30000ms exceeded.` (w logu: `element is not enabled`) | Pusty koszyk `tester09`, przycisk „Złóż zamówienie…” jest wyłączony (`disabled`) | Test zakłada, że w koszyku już coś jest, a koszyk `tester09` jest pusty, więc przycisk zamówienia jest wyłączony. |
| 06 | `Error: expect(received).toContain(expected)` (`Received: …/logowanie?next=%2Fkonto%2Fadres`) | Strona logowania tuż po Enter, przekierowanie jeszcze się nie skończyło | `page.url()` odczytuje adres od razu po Enter i nie czeka na przekierowanie po zalogowaniu. |

### Dlaczego Mirkowi testy 04–06 przechodziły

| Test | Dlaczego „u mnie działa” |
|---|---|
| 04 | Pauzę dopisał później albo u niego komunikat jeszcze nie znikał. Z pauzą 6 s komunikat (3–5 s) zawsze zdąży zniknąć. |
| 05 | W jego koszyku `tester09` leżał produkt dodany ręcznie albo przez inny test. Na czystym koncie koszyk jest pusty. |
| 06 | Na szybkim laptopie przekierowanie kończyło się, zanim test odczytał adres. Na wolniejszym serwerze buildów nie zdąży. |

### Poprawki

| Test | Poprawka |
|---|---|
| 01 | `getByRole('cell', { name: 'Szampon nawilżający', exact: true })` |
| 02 | przycisk `'Zaloguj'` zamiast `'Zaloguj się'` |
| 03 | `await expect(page.getByRole('row').filter({ hasText: 'ZAM-' })).not.toHaveCount(0)` zamiast `count()` |
| 04 | usunięty `waitForTimeout(6000)`; komunikat sprawdzany od razu po kliknięciu „Zapisz” |
| 05 | test sam dodaje „Mydło w kostce” do koszyka i sprawdza „Dodano do koszyka…” przed złożeniem zamówienia |
| 06 | `await expect(page).toHaveURL(/\/konto\/adres$/)` zamiast `expect(page.url()).toContain(...)` |

Wyniki: 01–03 `3 passed`, test 03 z `--repeat-each=10` `10 passed`, 04–06 dwa razy pod rząd `3 passed`, cały projekt `zepsute` `6 passed`.

# Ćwiczenie 11: funkcja logowania i uruchamianie wybranych testów

## Krok 1: funkcja `zaloguj` (`tests/pomocnicze/logowanie.ts`)

| Pytanie | Odpowiedź |
|---|---|
| Którym kontem loguje `await zaloguj(page);` bez zmiennych? | `user` / `user123` (domyślne wartości w liniach 10–11, gdy nie ma `APP_USER` i `APP_PASSWORD`) |
| Jak zalogować inne konto bez zmiany pliku funkcji? | 1) zmienne `$env:APP_USER` i `$env:APP_PASSWORD` w oknie testów; 2) argumenty w teście: `await zaloguj(page, 'biuro', 'biuro123');` |
| Co się stanie przy złym haśle? | Test padnie od razu na logowaniu, bo linia 22 sprawdza napis „Zalogowano jako <login>”, którego po złym haśle nie ma |

## Kroki 3–5: polecenia i wyniki

| Polecenie | Wynik |
|---|---|
| `npx playwright test tests/czytanie/02-moje-zamowienia.spec.ts` | `2 passed` |
| `npx playwright test tests/czytanie` | `17 passed` |
| `npx playwright test --grep "@zamowienia"` | `2 passed` |
| `npx playwright test --grep-invert "@zamowienia"` | brak testów z `tests/czytanie/02-moje-zamowienia` (jest tylko inny plik `tests/review/02-…`) |
| `npx playwright test tests/czytanie --project=chromium` | `17 passed` |
| `npx playwright test tests/czytanie/01-wyszukiwarka.spec.ts --headed` | `2 passed`, okno przeglądarki otwiera się i zamyka |
| `$env:BASE_URL="https://namssor-376292984721.europe-central2.run.app"`, potem `npx playwright test tests/smoke.spec.ts`, potem `Remove-Item Env:BASE_URL` | `4 passed` na wspólnym serwerze |
| `$env:APP_USER="tester05"`, `$env:APP_PASSWORD="czarny-piatek-2026"`, potem `npx playwright test tests/czytanie/02-moje-zamowienia.spec.ts` | `2 failed`, oba na lokatorze z `ZAM-1001`: logowanie działa, ale tester nie ma zamówień konta `user` |

## Ćwiczenie 12: projekt (P2, P3, P5, P11)

| Scenariusz | Plik | Wynik |
|---|---|---|
| P2 koszyk wymaga logowania | `tests/projekt/p2-koszyk-logowanie.spec.ts` | passed |
| P3 admin dodaje produkt (lokalnie) | `tests/projekt/p3-admin-dodaje-produkt.spec.ts` | passed; po zmianie `12,50 zł` na `12,51 zł`: failed |
| P5 katalog w API | `tests/projekt/p5-api-katalog.spec.ts` | passed |
| P11 kod rabatowy | `tests/projekt/p11-kod-rabatowy.spec.ts` | 3 passed; po zmianie `-1,00 zł` na `-1,01 zł`: failed |

`npx playwright test tests/projekt --repeat-each=3 --workers=1` → `21 passed`.
P3 nie sprząta, bo panel nie ma usuwania produktu: każda nazwa jest unikalna (data i godzina).

## Ćwiczenie 13: polowanie na wersji rc (konto tester05)

Czarna skrzynka: tylko przeglądarka, `/api/docs` i odpowiedzi API, bez kodu z `app/`.
Każdy test: `failed` na rc, `passed` na wersji zwykłej (dwa razy pod rząd, sprząta po sobie).

| # | Błąd na rc | Test | rc | zwykła |
|---|---|---|---|---|
| 1 | Sortowanie po cenie układa ceny jak tekst („10,99” przed „4,99”), w API i na stronie | `tests/polowanie/01-sortowanie-po-cenie.spec.ts` (2 testy) | 2 failed | 2 passed |
| 2 | `GET /api/orders/ZAM-9999` zwraca 200 i `{}` zamiast 404 | `02-nieistniejace-zamowienie.spec.ts` | failed | passed |
| 3 | Promocja liczona dwa razy w koszyku: krem 21,11 zł zamiast 26,39 zł | `03-cena-promocyjna-w-koszyku.spec.ts` | failed | passed |
| 4 | Nowy adres w profilu od razu staje się domyślny | `04-nowy-adres-nie-jest-domyslny.spec.ts` | failed | passed |
| 5 | Adres w profilu przyjmuje zły kod pocztowy (`00950`, `00-95`) | `05-kod-pocztowy-adresu.spec.ts` | failed | passed |
| 6 | Na fakturze NIP nabywcy = NIP sprzedawcy (1234563218) | `06-nip-nabywcy-na-fakturze.spec.ts` | failed | passed |
| 7 | Niedostępny produkt (np. maska, id 3) ma aktywny przycisk „Dodaj do koszyka” | `07-niedostepny-produkt.spec.ts` | failed | passed |

Niespodzianki Klaudiusza (takie same na obu adresach), do pola „Flaga”:
- `GET /api/promocja` z nagłówkiem `X-Namssor-Teraz` po 27.11.2026 (np. `2026-11-28`): „Bożena: przesuwamy na poniedziałek.”, `FLAGA-ZN6MD`;
- `/api/bozena/wymagania` (adres z komentarza w stopce strony): `FLAGA-9R6VC`.

Sprawdzone bez różnic: logowanie i `next`, wylogowanie, kody rabatowe, walidacja koszyka i zamówień (qty, NIP), adres główny, płatność kartą, odliczanie promocji, 401 bez logowania.
Nie sprawdzone: funkcje admina (na serwerze hasło admina zna tylko trener). Zostały 3 błędy z 10 i 4 niespodzianki z 6.
