# Njudy

Małe codzienne treningi zamiast bezmyślnego scrollowania. Polska aplikacja PWA w czystym HTML, CSS i JavaScript. Bez backendu, konta, reklam i kluczy API.

## Lokalnie

Wymagany Node.js 22.12+.

```sh
npm ci
npm run dev
```

Vite poda adres lokalny i adres w sieci Wi-Fi. Telefon musi być w tej samej sieci. Zwykły adres HTTP w LAN pozwala obejrzeć aplikację, ale instalację i service worker testuj na HTTPS z GitHub Pages albo na localhost.

```sh
npm test
npm run build
npm run preview
```

Tryb offline jest włączony w buildzie produkcyjnym, nie w serwerze developerskim. Otwórz podgląd online, poczekaj na instalację service workera i dopiero odłącz internet.

## GitHub Pages

1. Utwórz repozytorium GitHub, np. `njudy`, i prześlij cały projekt (wraz z `public`, ikonami PNG i `package-lock.json`) na gałąź `main` albo `master`.
2. W repozytorium wybierz **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push uruchomi workflow `Test and deploy Njudy`. Możesz też wybrać **Actions → Test and deploy Njudy → Run workflow**.
4. Po zakończeniu adres to `https://TWOJ_LOGIN.github.io/njudy/`. Dokładny link znajdziesz w wyniku deploymentu i w Settings → Pages.

Build używa względnych ścieżek, więc działa także pod dowolną nazwą repozytorium. Nie publikuj samego źródłowego `index.html`: workflow publikuje zawartość `dist`. Ostatni ukośnik w adresie projektu jest ważny dla rozwiązywania ścieżek względnych.

## Instalacja na telefonie

- **iPhone:** otwórz HTTPS w Safari → Udostępnij → Do ekranu początkowego → Dodaj.
- **Android:** otwórz w Chrome → menu → Zainstaluj aplikację. Jeśli przeglądarka udostępni monit, przycisk pojawi się także w ustawieniach Njudy.

Pierwsze otwarcie wymaga internetu. Potem quizy, teksty, fonty i lokalny obraz działają offline. Nowe dzieła z muzeum i nagrania wymowy z API wymagają sieci; systemowa synteza mowy zależy od głosów zainstalowanych na urządzeniu.

## Co jest w środku

- Codzienny mix pięciu pytań, punkty XP, seria dni i regulowany cel.
- 44 pytania: JavaScript, TypeScript, React, Java, HTTP, SQL, angielski, sztuka, filozofia, ekonomia i ciekawostki. Każda odpowiedź ma wyjaśnienie.
- 30 pozycji nut naturalnych w kluczu wiolinowym i basowym. Polskie nazwy: C D E F G A H; H odpowiada angielskiemu B natural.
- Generowane działania matematyczne, osiem krótkich tekstów ze źródłami, zapisane materiały.
- Błędne odpowiedzi mają priorytet w następnych treningach tej dziedziny. To proste powtórki, nie pełny algorytm spaced repetition.
- Eksport i import kopii JSON. Dane nie synchronizują się między urządzeniami ani między Safari i zainstalowaną PWA.

Baza pytań jest celowo mała i redagowana lokalnie. Nie ma generowania AI ani nieskończonego strumienia artykułów. Słowo dnia wybierane jest z 12 słów; API uzupełnia definicję i wymowę. Aby dodawać pytania i teksty, edytuj `src/content.js` i uruchom `npm test`.

## API i zasoby

- [Free Dictionary API](https://dictionaryapi.dev/): angielskie definicje i wymowa, bez klucza. W razie błędu zostaje lokalna definicja. Definicje mają indywidualne licencje zwracane przez API; źródła wskazują Wiktionary.
- [The Met Collection API](https://metmuseum.github.io/): inne dzieła na żądanie, tylko obiekty oznaczone `isPublicDomain`. Błędy i brak sieci nie blokują treningów.
- Lokalny obraz: Vincent van Gogh, _Wheat Field with Cypresses_, 1889, [The Met, obiekt 436535](https://www.metmuseum.org/art/collection/search/436535), public domain / Open Access CC0.
- DM Sans i Manrope: lokalne fonty Google Fonts, SIL Open Font License; licencje w `public/fonts/`.
- Lucide: ikony, licencja ISC.

Nie ma telemetrii. Zapytania do API ujawniają dostawcom standardowe informacje sieciowe, np. adres IP, ale nie wysyłają postępów ani odpowiedzi.

## Testy przeglądarkowe

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Testy obejmują desktop i mobilny Chromium: osiem ścieżek, ukończenie treningu, zapis postępów, zakładki, ustawienia, oba klucze, fallback API i ponowne otwarcie offline. Podgląd testowy działa pod `/njudyApp/`, żeby sprawdzać także deployment w podkatalogu GitHub Pages. Prawdziwa instalacja iOS wymaga ręcznej próby na telefonie.

Ikony PNG są już dołączone. Po zmianie `public/icon.svg` wygeneruj je przez `npm run icons` (wymaga Chromium). Każdy build tworzy nową wersję cache na podstawie zawartości aplikacji; aktualizacje nie usuwają lokalnego postępu.
