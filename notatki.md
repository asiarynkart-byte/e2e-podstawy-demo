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
