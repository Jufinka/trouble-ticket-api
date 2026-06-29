# Trouble Ticket API - E2E Tests

Repozytorium zawiera:

- strategie testow w pliku `TEST_STRATEGY.md`
- automatyczne testy E2E API i UI w katalogu `tests/`
- instrukcje uruchomienia testow przeciw lokalnie uruchomionemu srodowisku aplikacji

## 1. Zakres

Zakres obejmuje:

- dokument strategii testow (5 wymaganych obszarow)
- implementacje scenariuszy API i UI
- co najmniej jedna negatywna sciezke 4xx
- README z instrukcja uruchomienia testow

## 2. Zaimplementowane scenariusze E2E

### API

- `SC-API-01` tenant isolation:
  - `alpha` tworzy ticket
  - `beta` probuje odczytac ten sam ticket
  - oczekiwane: `404 TROUBLE_TICKET_NOT_FOUND`
- `SC-API-02` note not allowed for closed ticket:
  - ticket zostaje zamkniety
  - proba dodania notatki po zamknieciu
  - oczekiwane: `400 NOTE_ADDITION_NOT_ALLOWED`

### UI

- `SC-UI-01` tworzenie ticketu przez formularz i przejscie do szczegolow
- `SC-UI-02` wyslanie pustego formularza i walidacja bez nawigacji
- dodatkowe pokrycie kluczowych flow UI:
  - lista ticketow i status chip
  - widok szczegolow z notatkami
  - zamykanie ticketu i ukrycie akcji po zamknieciu

## 3. Wymagania wstepne

- Docker Engine 24+
- Docker Compose v2 (`docker compose`)
- Node.js 20+
- npm 10+

## 4. Uruchomienie srodowiska aplikacji

Zgodnie z zalozeniem testy uruchamiane sa przeciw pelnemu srodowisku Docker Compose.

Uwaga: katalog z kodem aplikacji (backend/frontend/docker) moze byc niecommitowany do tego repozytorium. W takim przypadku uruchom srodowisko z lokalnej kopii aplikacji.

1. Zbuduj obrazy:

```bash
cd ttapi/docker
docker compose -f docker-compose.yaml build
```

2. Uruchom srodowisko:

```bash
docker compose up -d
```

3. Sprawdz status uslug:

```bash
docker compose ps
```

Oczekiwane adresy:

- Frontend: http://localhost:3000
- API: http://localhost:8080/api/v1
- Keycloak: http://localhost:8180

## 5. Konfiguracja testow

Przejdz do katalogu z testami:

```bash
cd tests
```

Skonfiguruj lokalne zmienne srodowiskowe:

```bash
cp .env-template .env
```

Uzupelnij wymagane pola w `.env`:

- `KEYCLOAK_PASSWORD`
- `KEYCLOAK_USERNAME_ALPHA`
- `KEYCLOAK_USERNAME_BETA`
- `KEYCLOAK_USERNAME_GAMMA`

Pozostale adresy maja domyslne wartosci dla lokalnego docker-compose.

## 6. Instalacja zaleznosci i przegladarki

```bash
npm ci
npx playwright install chromium
```

## 7. Uruchamianie testow

W katalogu `tests`:

```bash
# wszystkie testy
npm test

# tylko API
npm run test:api

# tylko UI
npm run test:ui

# UI z widoczna przegladarka
npm run test:headed
```

Raport HTML Playwright:

```bash
npm run show-report
```

## 8. Struktura testow

```text
tests/
	.auth/
		alpha.json (generated)
	api/
		tenant-isolation.spec.ts
		note-not-allowed.spec.ts
	ui/
		ticket-list.spec.ts
		ticket-detail.spec.ts
		create-ticket.spec.ts
		create-ticket-validation.spec.ts
		close-ticket.spec.ts
		pages/
			LoginPage.ts
			TicketListPage.ts
			CreateTicketPage.ts
			TicketDetailPage.ts
	fixtures/
		auth.ts
		globalSetup.ts
	shared/
		env.ts
		testData.ts
```

## 9. Uwagi wykonawcze

- Testy sa samowystarczalne i tworza unikalne `externalId` per test.
- Logika auth i stale testowe sa centralizowane, aby ograniczyc duplikacje.
- Scenariusze API i UI pokrywaja wymagania minimalne zadania oraz negatywne sciezki.
