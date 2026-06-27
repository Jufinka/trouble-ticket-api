# Strategia testów — Trouble Ticket API

**Wersja dokumentu:** 1.1  
**Zakres:** aplikacja Trouble Ticket (backend REST, frontend SPA, Keycloak, PostgreSQL)  
**Data:** czerwiec 2026

---

## Spis treści

1. [Kontekst aplikacji i piramida testów](#1-kontekst-aplikacji-i-piramida-testów)
2. [Obszary do testowania i priorytetyzacja](#2-obszary-do-testowania-i-priorytetyzacja)
3. [Podejście do testowania](#3-podejście-do-testowania)
4. [Ryzyka, wyzwania i mitygacje](#4-ryzyka-wyzwania-i-mitygacje)
5. [Katalog scenariuszy testowych i DoD](#5-katalog-scenariuszy-testowych-i-dod)

---

## 1. Kontekst aplikacji i piramida testów

Aplikacja obsługuje tworzenie i obsługę zgłoszeń serwisowych w modelu multi-tenant, z autoryzacją Keycloak i API REST.

Kluczowe warstwy:

- Backend: Spring Boot 4, Java 21, OpenAPI 3.1
- Frontend: React 18, TypeScript, MUI v7
- Auth: OAuth2/OIDC (Keycloak), claim `tenant_id`
- Data: PostgreSQL 18
- Runtime: Docker Compose (frontend 3000, API 8080, Keycloak 8180)

W repozytorium istnieją już testy integracyjne Spring (`src/test/`) i pozostają bez zmian. W tej strategii skupiamy się na nowej warstwie E2E uruchamianej przeciw pełnemu środowisku Docker.

### Piramida testów

```
                    ┌─────────────────┐
                    │   E2E (nowe)    │  Playwright + TypeScript
                    │   API + UI      │  pełny stack docker-compose
                    ├─────────────────┤
                    │  Integracyjne   │  MockMvc + Testcontainers
                    │  (istniejące)   │  szybka regresja backendu
                    ├─────────────────┤
                    │   Jednostkowe   │  rozwijane iteracyjnie (P2)
                    └─────────────────┘
```

---

## 2. Obszary do testowania i priorytetyzacja

### Obszary

| Obszar        | Co testujemy                                                           |
| ------------- | ---------------------------------------------------------------------- |
| Auth / JWT    | 401 dla braku/niepoprawnego tokenu, poprawne użycie claimu `tenant_id` |
| CRUD zgłoszeń | POST, GET lista, GET szczegóły                                         |
| Statusy       | dozwolone i niedozwolone przejścia (w tym zamknięcie)                  |
| Notatki       | dozwolone statusy oraz blokada dla `resolved/closed/rejected`          |
| Idempotencja  | `(tenantId, externalId)` duplikat zwraca 200 z istniejącym zasobem     |
| Multi-tenancy | brak dostępu do cudzego zasobu: 404 (nie 403)                          |
| Walidacja     | błędy 400 + poprawne kody błędów biznesowych                           |
| UI            | lista, formularz tworzenia, szczegóły, komunikaty walidacji            |

### Priorytety

| Priorytet | Zakres                                                  |
| --------- | ------------------------------------------------------- |
| P0        | Multi-tenancy, reguły statusów, auth JWT                |
| P1        | CRUD, idempotencja, walidacja API 4xx, kluczowe flow UI |
| P2        | Rozszerzenia UI, testy jednostkowe i komponentowe       |

Reguła: każdy obszar P0 ma mieć automatyczne pokrycie w E2E lub integracyjnych.

---

## 3. Podejście do testowania

### Wybrany stack

Jeden projekt E2E oparty na Playwright + TypeScript:

- API tests: `APIRequestContext`
- UI tests: `page`
- wspólne helpery auth i danych testowych

Powody:

- jeden runner i spójna konfiguracja,
- mniejszy koszt utrzymania,
- łatwe współdzielenie logiki autoryzacji i fixture.

### Zakres implementacji

- E2E API: kontrakt publiczny, błędy 4xx, multi-tenancy, reguły statusów
- E2E UI: główne przepływy użytkownika i walidacja formularza
- Integracyjne (`src/test/`) traktowane jako istniejąca warstwa szybkiej regresji

### Założenia wykonawcze

- Testy działają wyłącznie na uruchomionym `docker compose up`
- Dane testowe tworzone per test (unikalne `externalId`)
- Brak czyszczenia bazy między testami
- Minimalizacja zależności od seed data

---

## 4. Ryzyka, wyzwania i mitygacje

| Ryzyko                             | Wpływ  | Prawdopodobieństwo | Mitygacja                                                      |
| ---------------------------------- | ------ | ------------------ | -------------------------------------------------------------- |
| Flaki Keycloak (czas startu/token) | Wysoki | Średnie            | Retry, health check przed suite, setup auth per projekt        |
| Długi start docker-compose         | Średni | Wysokie            | Instrukcja uruchomienia, smoke check przed pełnym runem        |
| Kolizje `externalId`               | Średni | Średnie            | Generator unikalnych ID (`timestamp + random`)                 |
| Nondeterminizm przez seed data     | Średni | Niskie             | Asercje na własnych danych, nie na liczności listy             |
| Niestabilne selektory UI           | Średni | Średnie            | Selektory semantyczne (`getByRole`, `getByLabel`), Page Object |
| Różnice lokalnie vs CI             | Średni | Niskie             | Zmienne środowiskowe URL i jednolita konfiguracja runa         |
| Brak izolacji DB między runami     | Niski  | Niskie             | Samowystarczalne testy i unikalne identyfikatory               |

---

## 5. Katalog scenariuszy testowych i DoD

### Scenariusze planowane do implementacji

Minimum z zadania: 1 scenariusz API + 1 scenariusz UI + co najmniej jedna ścieżka negatywna 4xx.

| ID        | Warstwa | Scenariusz                                                                            | Typ             | Priorytet |
| --------- | ------- | ------------------------------------------------------------------------------------- | --------------- | --------- |
| SC-API-01 | API     | Izolacja tenantów: `alpha` tworzy, `beta` odczytuje -> 404 `TROUBLE_TICKET_NOT_FOUND` | Negatywny (4xx) | P0        |
| SC-API-02 | API     | Próba dodania notatki do `closed` -> 400 `NOTE_ADDITION_NOT_ALLOWED`                  | Negatywny (4xx) | P0        |
| SC-UI-01  | UI      | Login + utworzenie zgłoszenia + przejście do szczegółów                               | Pozytywny       | P1        |
| SC-UI-02  | UI      | Submit pustego formularza -> walidacja i brak nawigacji                               | Negatywny       | P1        |

Scenariusze SC-API-01 i SC-UI-01 spełniają minimalne wymaganie zadania. SC-API-02 i SC-UI-02 wzmacniają ocenę przez pokrycie edge cases.

### Kryteria ukończenia (Definition of Done)

| Element        | Kryterium                                                              |
| -------------- | ---------------------------------------------------------------------- |
| Strategia      | dokument zawiera 5 wymaganych obszarów i listę scenariuszy             |
| E2E API        | przynajmniej 1 scenariusz negatywny 4xx, testy green na docker-compose |
| E2E UI         | przynajmniej 1 scenariusz UI green + 1 walidacyjny/negatywny           |
| Reużywalność   | wspólny helper auth i generowanie danych testowych                     |
| Uruchamialność | komplet instrukcji `npm ci` i uruchamiania testów                      |

### Backlog po dostarczeniu minimum

- SC-API-03: niedozwolone zamknięcie -> `STATUS_TRANSITION_ERROR`
- SC-API-04: idempotencja create -> 200 z istniejącym zasobem
- SC-API-05: brak tokenu -> 401
- SC-UI-03: dodanie notatki w szczegółach zgłoszenia
- SC-UI-04: zamknięcie zgłoszenia z UI
