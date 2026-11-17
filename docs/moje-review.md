# Ćwiczenie 05: review testów Klaudiusza

Lista kontrolna: [lista-kontrolna-review.md](lista-kontrolna-review.md)

## Część A: nocne testy (01–05)

Krok 1: `npx playwright test tests/review` → `11 passed`.

| Test | Linia | Co jest nie tak | Pytanie z listy | Poprawka |
|---|---|---|---|---|
| 01 | 21–22 | Po kliknięciu sprawdza tylko, że wiersz balsamu jest na liście produktów i przycisk jest aktywny. Oba warunki były spełnione już **przed** kliknięciem. Nikt nie zagląda do koszyka, a wymaganie mówi „trafia do jego koszyka”. | 2, 3, 12 | sprawdzić `await expect(page.getByText('Dodano do koszyka: Balsam do ciała')).toBeVisible();`, przejść do „Koszyk” i sprawdzić wiersz balsamu w koszyku |
| 01 | 18 | Test dodaje balsam i nie sprząta, więc koszyk `user` rośnie przy każdym uruchomieniu. | 9 | na końcu kliknąć „Usuń” w wierszu balsamu w koszyku |
| 02 | 16 | Stała pauza `waitForTimeout(3000)`: test jest wolny, a przy wolniejszym serwerze niestabilny. | 8 | usunąć; czekać przez `await expect(...)` |
| 02 | 18–19 | `isVisible()` sprawdza stan w jednej chwili i nie czeka, a `expect(true).toBe(true)` to nie asercja Playwright. | 8, 14 | `await expect(page.getByRole('row').filter({ hasText: 'ZAM-1004' })).toBeVisible();` |
| 02 | 20 | `cell 'Nowe'.first()` bierze pierwsze lepsze zamówienie ze statusem „Nowe” (np. ZAM-1001), a nie ZAM-1004. Test przejdzie, nawet jeśli ZAM-1004 jest anulowane. | 2, 7 | `await expect(page.getByRole('row').filter({ hasText: 'ZAM-1004' })).toContainText('Nowe');` |
| 03 | 24 | `toContainText('Popraw błędy')` to tylko fragment. Przejdzie dla każdego błędu formularza, np. błędnego telefonu. | 5 | sprawdzić komunikat przy polu: `await expect(page.getByText('Kod pocztowy musi mieć format 00-000')).toBeVisible();` |
| 03 | 25 | `toHaveClass('error')` sprawdza wygląd (klasę CSS), a nie efekt biznesowy. | 4 | usunąć |
| 03 | — | Brak sprawdzenia, że adres **nie** został zapisany. | 2 | `await expect(page.getByText('Zapisano adres dostawy.')).toHaveCount(0);` |
| 04 | 18 | Selektor CSS `table tbody tr:nth-child(1) td:nth-child(1)` rozsypie się po zmianie kolejności kolumn. | 6, 7 | `page.getByRole('row').filter({ hasText: 'ZAM-1005' })` |
| 04 | 18 | Wymaganie mówi „**dokładnie jedno** zamówienie”, a test patrzy tylko na pierwszy wiersz. Przejdzie, gdy wyszukiwarka pokaże ZAM-1005 i dziesięć innych. | 2 | `await expect(page.getByRole('row').filter({ hasText: 'ZAM-' })).toHaveCount(1);` |
| 05 | 8–9 | Wymaganie dotyczy klienta, a test loguje się jako `admin`. | 10 | logowanie jako klient, np. `tester10` (osobne konto, żeby nie psuć adresu `user`) |
| 05 | 14–22 | Test zmienia adres i go nie przywraca, więc przy drugim uruchomieniu zaczyna od innych danych. Nie sprawdza też kodu pocztowego i telefonu. | 9, 2 | przywrócić poprzedni adres na końcu testu; dopisać `toHaveValue('31-001')` i `toHaveValue('600 200 300')` |

### Krok 5: dowód (test 01)

Zakomentowałam kliknięcie „Dodaj do koszyka” (linia 18) i uruchomiłam:
```powershell
npx playwright test tests/review/01-dodanie-do-koszyka.spec.ts
```
Wynik: **`1 passed`**. Test nie zauważył, że nic nie zostało dodane do koszyka.

### Krok 6: poprawiony test 01

Po poprawce test sprawdza komunikat „Dodano do koszyka: Balsam do ciała”, otwiera koszyk, sprawdza wiersz balsamu i na koniec go usuwa.
- uruchomiony 2 razy pod rząd (`--repeat-each=2`): **`2 passed`**
- z zakomentowanym kliknięciem: **`1 failed`** (`getByText('Dodano do koszyka: Balsam do ciała')` → nie znaleziono)

## Część B: druga partia (06–10)

| Test | Linia | Co jest nie tak | Pytanie z listy | Poprawka |
|---|---|---|---|---|
| 06 | 22 | Szuka komunikatu „Nieprawidłowy kod rabatowy”, którego aplikacja **nigdy** nie pokazuje (prawdziwy to „Nie ma takiego kodu rabatowego: …”). `not.toBeVisible()` przejdzie zawsze. | 13, 5 | sprawdzić komunikat sukcesu: `await expect(page.getByText('Kod CZARNY20 przyjęty: -20% na całe zamówienie.')).toBeVisible();` |
| 06 | 23 | Nagłówek „Koszyk” był widoczny przed wpisaniem kodu, więc ta asercja nic nie sprawdza. Brak sprawdzenia, że suma spadła o 20%. | 2, 3 | sprawdzić sumę po rabacie, np. `await expect(page.getByTestId('cart-total')).toHaveText('…')` z kwotą policzoną z wymagania |
| 06 | 26 | Sprząta żel, ale nie usuwa kodu z koszyka. | 9 | przed usunięciem żelu kliknąć „Usuń kod” |
| 07 | 24 | Sprawdza tylko adres strony po złożeniu zamówienia. Brak sprawdzenia, że zamówienie jest na liście, że na jego stronie jest NIP i „Pobierz fakturę”. | 2 | otworzyć stronę zamówienia i sprawdzić: `await expect(page.getByTestId('order-nip')).toHaveText('101-202-30-36');` oraz `await expect(page.getByRole('link', { name: 'Pobierz fakturę' })).toBeVisible();` (to link, a nie przycisk) |
| 08 | 7, 29–31 | Drugi test zakłada, że pierwszy dodał adres „Praca”. `mode: 'serial'` ukrywa tę zależność: cały plik przechodzi, a sam drugi test pada. | 11 | każdy test sam przygotowuje swoje dane: drugi test najpierw dodaje „Praca”, potem ustawia go jako domyślny i usuwa |
| 09 | 11–12 | `expect(locator).toBeTruthy()` bez `await` sprawdza, że w kodzie istnieje obiekt locatora, a nie że element jest na stronie. Nic nie sprawdza, że przycisk jest **wyłączony**. | 14, 2 | `await expect(page.getByText('Niedostępny')).toBeVisible();` oraz `await expect(page.getByRole('button', { name: 'Dodaj do koszyka' })).toBeDisabled();` |
| 10 | 14 | `toContainText('32,99 zł')` znajduje **starą** cenę, a nie promocyjną 26,39 zł z wymagania. Nie ma sprawdzenia plakietki „-20%” ani przekreślenia. | 15, 5, 2 | `await expect(kafelek.getByTestId('tile-price')).toHaveText('26,39 zł');`, `tile-old-price` → `32,99 zł`, `tile-badge` → `-20%` |

### Krok 9: dowody

**Test 06:** zmieniłam `CZARNY20` na `ZLYKOD` i uruchomiłam:
```powershell
npx playwright test tests/review/06-kod-rabatowy.spec.ts
```
Wynik: **`1 passed`**. Błędny kod też „przechodzi”, bo test szuka komunikatu, którego aplikacja nie ma.

**Test 08:** uruchomiłam sam drugi test:
```powershell
npx playwright test tests/review/08-adresy.spec.ts -g "domy"
```
Wynik: **`1 failed`** po 30 s, `waiting for getByRole('button', { name: 'Ustaw jako domyślny: Praca' })`.

Dlaczego: adres „Praca” dodaje dopiero pierwszy test. Gdy uruchamia się cały plik, pierwszy test dodaje adres, a drugi z niego korzysta, więc wszystko jest zielone. Uruchomiony sam drugi test nie ma adresu „Praca”, więc czeka na przycisk, który się nie pojawi.

## Dlaczego `11 passed` nic nie znaczyło

Zielony test mówi tylko, że jego asercje przeszły, a nie że sprawdzają wymaganie. Testy Klaudiusza sprawdzały rzeczy widoczne już przed akcją (01, 06), szukały komunikatów, których nie ma (06), nie sprawdzały nic na stronie (09), patrzyły na złą cenę (10) albo działały tylko w parze z innym testem (08). Dopiero eksperyment „pomiń akcję albo zepsuj dane” pokazuje, czy test potrafi paść.
