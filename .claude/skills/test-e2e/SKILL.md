---
name: test-e2e
description: Pisze test E2E Playwright według zasad z CLAUDE.md. Użyj, gdy użytkownik prosi o nowy test, automatyzację przypadku testowego albo scenariusza.
---

# Test E2E krok po kroku

Zasady pisania kodu testu są w `CLAUDE.md`. Ten skill opisuje kolejność pracy.

1. Przeczytaj przypadek testowy albo opis scenariusza od użytkownika. Wypisz każdy oczekiwany wynik jako osobny punkt.
2. Przejdź scenariusz w aplikacji (Playwright MCP albo kod w `app/`). Zapisz dokładne etykiety pól, nazwy przycisków i treść komunikatów.
3. Pokaż plan: nazwę pliku `tests/cwiczenia/<nazwa>.spec.ts`, kroki, asercję dla każdego oczekiwanego wyniku, konto i sprzątanie. Poczekaj na akceptację planu.
4. Napisz test według zaakceptowanego planu i zasad z `CLAUDE.md`.
5. Uruchom test dwa razy pod rząd: `npx playwright test <plik> --repeat-each=2 --workers=1`. Oba przebiegi muszą dać `passed`.
6. Zmień jedną oczekiwaną wartość, uruchom test i pokaż `failed`. Przywróć wartość i uruchom test jeszcze raz.
7. Przejdź test pytaniami z `docs/lista-kontrolna-review.md`. Każde „nie” popraw w teście.
8. Na końcu podaj polecenie do uruchomienia testu i wyniki z kroków 5 i 6.
