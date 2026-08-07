---
project: EqShift
version: 1
status: draft
created: 2026-08-07
updated: 2026-08-07
prd_version: 1
main_goal: low-complexity
top_blocker: none
---

# Roadmap: EqShift

> Wygenerowane z `context/foundation/prd.md` (v1) + auto-zbadanej bazy kodu.
> Edytuj w miejscu; archiwizuj gdy zastąpione.
> Poniższe historyjki są uporządkowane wg zależności. Tabela "W skrócie" to indeks.

## Vision recap

Fani łamigłówek matematycznych dziś napotykają klasyczną łamigłówkę "przesuń zapałkę/belkę, aby naprawić równanie" głównie jako statyczne obrazki lub zadania papierowe — bez natychmiastowej walidacji ruchu czy poczucia postępu. EqShift to interaktywna, webowa, czysto klientowa wersja tej łamigłówki, w retro-stylistyce lat 90., bez backendu i bez kont.

## Pierwsza historyjka (north star)

**S-01: Gracz naprawia równanie przesuwając jedną belkę** — to jedyna historyjka w PRD i treść głównego kryterium sukcesu (Primary); jeśli ta pętla nie zadziała i nie będzie satysfakcjonująca, reszta nie ma znaczenia.

> "Pierwsza historyjka, która udowadnia, że produkt działa" (ang. north star) — najmniejszy kompletny fragment, którego udane dostarczenie potwierdza główną hipotezę produktu. Umieszczona jak najwcześniej, bo wszystko inne ma sens tylko wtedy, gdy to zadziała. Ten opis pojawia się tylko raz, tutaj.

## W skrócie

| ID   | Change ID                    | Wynik (gracz może …)                                          | Wymaga     | Odniesienia PRD                          | Status   |
| ---- | ----------------------------- | --------------------------------------------------------------- | ---------- | ------------------------------------------ | -------- |
| S-01 | core-equation-solving-loop    | naprawić równanie przesuwając jedną belkę i zobaczyć wynik ruchu | —          | US-01, FR-001, FR-002, FR-003, FR-004, FR-005, FR-006 | ready    |
| S-02 | session-hud-and-reset         | widzieć wynik, liczbę ruchów i czas oraz zresetować planszę      | S-01       | FR-007, FR-008, FR-009, FR-010             | proposed |

## Baseline

Co już jest w projekcie na dzień `2026-08-07` (auto-zbadane + potwierdzone przez użytkownika).
Poniższe Fundamenty zakładają tę bazę i jej nie odtwarzają.

- **Frontend:** present — domyślny szablon Vite+React (`src/App.tsx`, `src/main.tsx`)
- **Backend / API:** absent — zgodne z PRD (brak backendu)
- **Data:** absent — zgodne z PRD (dane wyłącznie lokalnie u gracza)
- **Auth:** absent — zgodne z PRD (brak logowania/kont)
- **Deploy / infra:** absent — cel deploymentu (GitHub Pages) ustalony w `tech-stack.md`, ale nic jeszcze nie wdrożone
- **Observability:** absent — zgodne z PRD (brak zbierania danych)

## Foundations

Brak fundamentów. Zakres MVP (jedna plansza testowa, brak backendu/auth/danych, offline z natury statycznej aplikacji) nie wymaga żadnej dodatkowej infrastruktury przed pierwszą historyjką — wszystkie wymagane warstwy (frontend) są już obecne w bazie (patrz `## Baseline`), a pozostałe warstwy są celowo nieobecne zgodnie z PRD.

## Slices

### S-01: Gracz naprawia równanie przesuwając jedną belkę

- **Outcome:** gracz może zobaczyć niepoprawne równanie, przesunąć dokładnie jedną belkę, i otrzymać automatyczną walidację — poprawny ruch pokazuje krótką nagrodę i ładuje kolejne równanie, niepoprawny nie daje żadnego komunikatu.
- **Change ID:** core-equation-solving-loop
- **PRD refs:** US-01, FR-001, FR-002, FR-003, FR-004, FR-005, FR-006
- **Prerequisites:** —
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sekwencjonowana pierwsza, bo JEST pierwszą historyjką (north star) — walidacyjnym kamieniem milowym potwierdzającym, że mechanika "przesuń jedną belkę" jest w ogóle satysfakcjonująca do grania; wszystkie kolejne historyjki zakładają, że ta pętla istnieje i działa.
- **Status:** ready

### S-02: Gracz śledzi swoją sesję i może zresetować planszę

- **Outcome:** gracz widzi rosnący licznik wyniku, licznik wykonanych ruchów i upływający czas na bieżącym równaniu, i może w każdej chwili zresetować planszę i liczniki do stanu początkowego.
- **Change ID:** session-hud-and-reset
- **PRD refs:** FR-007, FR-008, FR-009, FR-010
- **Prerequisites:** S-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sekwencjonowana po S-01, bo wynik, liczniki i reset nie mają znaczenia bez działającej pętli rozwiązywania, do której się podpinają (zdarzenie "poprawny/niepoprawny ruch" z S-01 napędza te liczniki). Niskie ryzyko samo w sobie — to głównie stan UI nad już istniejącą logiką.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID                 | Sugerowany tytuł zgłoszenia                          | Gotowe do `/10x-plan` | Notatki |
| ---------- | --------------------------- | ------------------------------------------------------- | ---------------------- | ------- |
| S-01       | core-equation-solving-loop  | Core: naprawianie równania przesunięciem jednej belki    | tak                    | Uruchom `/10x-plan core-equation-solving-loop` |
| S-02       | session-hud-and-reset       | Session HUD: wynik, liczniki ruchów/czasu, reset planszy | nie                    | Odblokowane dopiero po ukończeniu S-01 |

## Open Roadmap Questions

Brak — PRD nie zostawia żadnych otwartych pytań (`## Open Questions` w PRD: puste), a wywiad przy tworzeniu roadmapy nie ujawnił nowych pytań przekrojowych.

## Parked

- **Konta użytkowników, logowanie, globalny ranking online** — Poza zakresem: PRD `## Non-Goals` — wynik żyje wyłącznie lokalnie, zgodnie z decyzją o braku backendu.
- **Tryb wieloosobowy** — Poza zakresem: PRD `## Non-Goals` — brak współdzielonej rozgrywki czy rywalizacji na żywo w MVP.
- **Natywna aplikacja mobilna** — Poza zakresem: PRD `## Non-Goals` — tylko web w MVP.
- **Alternatywne motywy wizualne** — Poza zakresem: PRD `## Non-Goals` — jeden ustalony styl retro lat 90.
- **Rozbudowana biblioteka wielu plansz/łamigłówek** — Odłożone: PRD `## Success Criteria` → Secondary, jawnie nice-to-have; jedna plansza testowa wystarcza do potwierdzenia, że MVP działa.

## Done

