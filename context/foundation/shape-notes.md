---
project: "EqShift"
context_type: greenfield
created: 2026-08-07
updated: 2026-08-07
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 3
  hard_deadline: null
  after_hours_only: true
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: "pain category"
      decision: "missing capability — no good interactive web version of this puzzle"
    - topic: "insight"
      decision: "instant move validation — static image/paper versions don't offer this"
    - topic: "primary persona scope"
      decision: "casual online player, no specific niche"
    - topic: "access control"
      decision: "no auth, single device, score in browser localStorage"
    - topic: "mvp flow"
      decision: "single test board; correct move on the one wrong beam advances to next equation; wrong move gives no feedback"
    - topic: "timeline"
      decision: "3 weeks after-hours, confirmed"
    - topic: "guardrail"
      decision: "90s retro visual style; 'miodność' (replay appeal) is the key success factor"
  frs_drafted: 10
  quality_check_status: accepted
---

## Seed idea

> To gra ktora polega na przesunieciu belki tak aby rownanie matematyczne miało sens. Cyfry w rownaniu są utworzone z belek np cyfra 8 ma 7 belek, cyfra 1 dwie belki, cyfra 2 ma 5 belek. Przykład rownania 5+1=8 nalezy pobrac belke ze znaku + aby zmienil sie na minus, a dostawić ja do cyfry 5 aby zmienic ja w 9. Zawsze mozna przesunac tylko jedną belkę.

Mechanika (jak zrozumiana z seeda, do potwierdzenia z użytkownikiem):
- Równanie matematyczne zbudowane z cyfr siedmiosegmentowych (jak na wyświetlaczu LCD) oraz operatorów (+, -, =).
- Gracz przesuwa dokładnie jedną "belkę" (segment) na inne miejsce w równaniu, aby uczynić je matematycznie poprawnym.
- Przykład: 5+1=8 → przesunięcie jednej belki ze znaku "+" (zmieniając go w "-") i dostawienie jej do cyfry "5" (zmieniając w "9") daje 9-1=8.

## Vision & Problem Statement

Fani łamigłówek matematycznych dziś napotykają klasyczną łamigłówkę "przesuń zapałkę/belkę, aby naprawić równanie" głównie w formie statycznych obrazków lub zadań papierowych — bez natychmiastowej walidacji ruchu, informacji zwrotnej czy poczucia postępu. Brakuje interaktywnej, webowej wersji tej łamigłówki.

Insight: natychmiastowa walidacja ruchu — gra od razu informuje, czy przesunięcie segmentu dało poprawne równanie — to wartość, której statyczne wersje obrazkowe/papierowe nie oferują.

## User & Persona

**Primary persona:** Casualowy gracz online — osoba szukająca krótkich, angażujących łamigłówek w przeglądarce, bez przynależności do wąskiej niszy. Gra w dowolnej wolnej chwili, bez konkretnego wyzwalającego momentu.

## Access Control

Single user; no auth; dane (wynik/postęp) pozostają wyłącznie na urządzeniu gracza — nie są wysyłane ani przechowywane na żadnym serwerze. Brak kont, brak backendu, brak ról.

## Success Criteria

### Primary
- Gracz może rozegrać pełny cykl: zobaczyć równanie z błędnym stanem, przesunąć jedną belkę, i po poprawnym ruchu przejść do kolejnego równania. Jedna plansza testowa wystarczy, aby uznać MVP za działające.

### Secondary
- Duża liczba plansz/łamigłówek (rozbudowana biblioteka równań), nie tylko jedna testowa.

### Guardrails
- Grafika utrzymana w konwencji gier retro z lat 90. — "miodność" (chętność gracza do ponownej gry) jest kluczowym czynnikiem sukcesu i nie może zostać poświęcona na rzecz uproszczeń.

## Functional Requirements

### Rozgrywka
- FR-001: Gracz widzi wyświetlone równanie zbudowane z cyfr i operatorów zbudowanych z segmentów (belek). Priority: must-have
  > Socratic: Kontrargument rozważony: brak — reprezentacja segmentowa to rdzeń mechaniki. Rozwiązanie: FR zostaje bez zmian.
- FR-002: Gracz może wybrać jedną belkę i przenieść ją w inne miejsce w równaniu. Priority: must-have
  > Socratic: Kontrargument rozważony: brak — dowolne umieszczenie + walidacja końcowa po ruchu wystarczy. Rozwiązanie: FR zostaje bez zmian.
- FR-003: W jednym ruchu gracz może przesunąć wyłącznie jedną belkę — system egzekwuje tę regułę. Priority: must-have
  > Socratic: Kontrargument rozważony: "reguła jednej belki może być zbyt restrykcyjna dla trudniejszych łamigłówek". Rozwiązanie: to fundament tej łamigłówki (matchstick puzzle) — zostaje bez zmian dla MVP; tryby z większą liczbą ruchów to potencjalna przyszła rozbudowa, poza zakresem MVP.

### Walidacja i postęp
- FR-004: System sprawdza, czy po wykonanym ruchu równanie jest matematycznie poprawne (podstawowa walidacja arytmetyczna). Priority: must-have
  > Socratic: Kontrargument rozważony: "trzeba obsłużyć edge case'y (np. wiodące zera, nielegalne układy belek)". Rozwiązanie: podstawowa walidacja arytmetyczna wystarczy dla MVP; obsługa edge case'ów poza zakresem na razie.
- FR-005: Po poprawnym ruchu gra pokazuje krótką nagrodę wizualną (animację/potwierdzenie), a następnie automatycznie ładuje kolejne równanie. Priority: must-have
  > Socratic: Kontrargument rozważony: "natychmiastowe przejście bez potwierdzenia odbiera graczowi moment satysfakcji". Rozwiązanie: FR rozszerzony o krótką nagrodę wizualną przed przejściem do kolejnego równania.
- FR-006: Po niepoprawnym ruchu gra nie wyświetla żadnego komunikatu ani ostrzeżenia. Priority: must-have
  > Socratic: Kontrargument rozważony: "całkowity brak feedbacku może dezorientować nowego gracza". Rozwiązanie: to celowy element trudności/charakteru gry — FR zostaje bez zmian.

### Wynik i sesja
- FR-007: Gracz widzi licznik wyniku (score): +1 za każde rozwiązane równanie. Priority: must-have
  > Socratic: Kontrargument rozważony: "wynik powinien uwzględniać czas/ruchy (bardziej złożona formuła)". Rozwiązanie: prosty licznik (+1 za równanie) wystarczy dla MVP; złożona formuła to potencjalna przyszła rozbudowa.
- FR-008: Gracz może zresetować bieżącą planszę/równanie do stanu początkowego; reset zeruje również licznik ruchów i czasu dla tego równania. Priority: must-have
  > Socratic: Kontrargument rozważony: "czy reset powinien też zerować liczniki, czy tylko układ belek?". Rozwiązanie: pełny reset — układ belek ORAZ liczniki wracają do zera.
- FR-009: Gracz widzi licznik wykonanych ruchów na bieżącym równaniu. Priority: must-have
  > Socratic: Kontrargument rozważony: "bez feedbacku na błędny ruch licznik ruchów traci sens". Rozwiązanie: licznik zostaje — to element rywalizacji z samym sobą, niezależny od braku feedbacku na błąd.
- FR-010: Gracz widzi upływający czas spędzony na bieżącym równaniu. Priority: must-have
  > Socratic: Kontrargument rozważony: "presja czasu kłóci się z casualowym charakterem gry". Rozwiązanie: czas jest wyłącznie informacyjny (stoper), nie tworzy limitu ani presji — FR zostaje bez zmian.

## User Stories

### US-01: Gracz naprawia równanie przesuwając jedną belkę

- **Given** gracz widzi na ekranie matematycznie niepoprawne równanie zbudowane z cyfr i operatorów segmentowych
- **When** przenosi dokładnie jedną belkę z jednego miejsca w równaniu w inne
- **Then** system sprawdza poprawność równania — jeśli poprawne, gra ładuje kolejne równanie i aktualizuje licznik wyniku; jeśli niepoprawne, nic się nie dzieje (brak komunikatu), a licznik ruchów rośnie

#### Acceptance Criteria
- Ruch dozwolony jest tylko dla dokładnie jednej belki na próbę
- Poprawność równania sprawdzana jest automatycznie po każdym ruchu, bez akcji potwierdzającej ze strony gracza
- Niepoprawny ruch nie blokuje kolejnych prób — gracz może próbować dalej na tym samym równaniu
- Licznik ruchów i czasu aktualizują się przez cały czas trwania próby na danym równaniu

## Business Logic

Aplikacja ocenia, czy układ segmentów (belek) tworzących równanie — po przesunięciu dokładnie jednej belki — reprezentuje matematycznie prawdziwe równanie.

Reguła konsumuje jako wejście: aktualny stan wizualny równania (rozmieszczenie belek tworzących cyfry i operatory) oraz ruch gracza (przeniesienie jednej belki z jednego miejsca w inne). Jej wynikiem jest ocena binarna — prawda/fałsz — czy powstały po ruchu układ reprezentuje matematycznie poprawne równanie.

Gracz napotyka tę regułę bezpośrednio po każdym wykonanym ruchu: ocena wykonywana jest automatycznie, bez akcji potwierdzającej. Wynik pozytywny odblokowuje kolejne równanie wraz z krótką nagrodą wizualną; wynik negatywny nie daje żadnej informacji zwrotnej, pozostawiając grę w oczekiwaniu na kolejną próbę gracza.

## Non-Functional Requirements

- Żadne dane gracza (ruchy, wynik, tożsamość) nie opuszczają urządzenia — brak zbierania lub przesyłania danych do jakiegokolwiek serwera.
- Gra pozostaje w pełni grywalna bez połączenia z internetem po pierwszym załadowaniu (działa offline).
- Gracz widzi efekt swojego ruchu (przesunięcia belki) w czasie poniżej 100ms od wykonania akcji.

## Non-Goals

- Brak kont użytkowników, logowania i globalnego rankingu online — wynik żyje wyłącznie lokalnie w przeglądarce gracza, zgodnie z decyzją o braku backendu.
- Brak trybu wieloosobowego — bez współdzielonej rozgrywki, rywalizacji na żywo czy porównywania wyników między graczami.
- Brak natywnej aplikacji mobilnej — tylko web w MVP.
- Brak alternatywnych motywów wizualnych — jeden ustalony styl retro lat 90. bez wyboru skórek/motywów graficznych.

## Forward: tech-stack

- UI ma powstać w osobnym etapie, po zbudowaniu mechaniki gry, przy użyciu pluginu **pen.dev**.
