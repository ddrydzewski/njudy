const question = (id, prompt, options, answer, explanation, code = '') => ({ id, prompt, options, answer, explanation, code });

export const topics = [
  { id: 'programming', name: 'Programowanie', subtitle: 'Frontend, backend i dobre decyzje', icon: 'code-xml', color: 'blue', tag: 'FE + BE', count: '12 zadań' },
  { id: 'music', name: 'Czytanie nut', subtitle: 'Mały trening muzycznego oka', icon: 'music-2', color: 'pink', tag: 'MUZYKA', count: '30 nut' },
  { id: 'english', name: 'Angielski', subtitle: 'Słowa, które zostają w głowie', icon: 'languages', color: 'lime', tag: 'JĘZYK', count: '8 zadań' },
  { id: 'math', name: 'Gimnastyka głowy', subtitle: 'Liczby zamiast scrollowania', icon: 'calculator', color: 'yellow', tag: 'MATEMATYKA', count: 'Bez końca' },
  { id: 'art', name: 'Sztuka', subtitle: 'Patrz uważniej. Zobacz więcej.', icon: 'palette', color: 'peach', tag: 'KULTURA', count: '6 zadań' },
  { id: 'philosophy', name: 'Filozofia', subtitle: 'Dobre pytania nie mają końca', icon: 'lightbulb', color: 'lilac', tag: 'IDEE', count: '6 zadań' },
  { id: 'economics', name: 'Ekonomia', subtitle: 'Jak działa świat wokół pieniędzy', icon: 'chart-no-axes-combined', color: 'mint', tag: 'ŚWIAT', count: '6 zadań' },
  { id: 'curiosity', name: 'Ciekawość', subtitle: 'Coś, czego jeszcze nie wiesz', icon: 'orbit', color: 'sky', tag: 'ODKRYCIA', count: '6 zadań' },
];

export const questions = {
  programming: [
    question('p1', 'Co wypisze ten kod?', ['0', '1', '2', 'undefined'], '1', 'Każda funkcja pamięta własne otoczenie leksykalne. Oba wywołania korzystają z tego samego licznika; drugie zwraca 1.', 'function counter() {\n  let value = 0;\n  return () => value++;\n}\nconst next = counter();\nnext();\nconsole.log(next());'),
    question('p2', 'Która metoda HTTP powinna być idempotentna?', ['POST', 'PUT', 'CONNECT', 'Żadna'], 'PUT', 'Wielokrotne identyczne PUT powinno mieć taki sam zamierzony skutek jak pojedyncze. POST nie daje tej gwarancji.'),
    question('p3', 'Po co Reactowi stabilny key na liście?', ['Żeby nadać klasę CSS', 'Żeby rozpoznać element między renderami', 'Żeby sortować tablicę', 'Żeby wyłączyć renderowanie'], 'Żeby rozpoznać element między renderami', 'Stabilny identyfikator wiąże stan z elementem. Indeks bywa problemem przy usuwaniu, sortowaniu i wstawianiu.'),
    question('p4', 'Co wypisze kod po opróżnieniu kolejek?', ['A, B, C', 'A, C, B', 'B, A, C', 'C, B, A'], 'A, C, B', 'Kod synchroniczny wykona A. Reakcja Promise jest mikrozadaniem, więc C wykona się przed zadaniem timera B.', "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));"),
    question('p5', 'Jak bezpiecznie przekazać dane użytkownika do SQL?', ['Skleić tekst przez +', 'Usunąć spacje', 'Użyć parametrów zapytania', 'Zakodować jako HTML'], 'Użyć parametrów zapytania', 'Zapytania parametryzowane oddzielają instrukcję SQL od danych. Samo filtrowanie znaków nie jest wystarczającą ochroną.'),
    question('p6', 'Czym różni się unknown od any w TypeScript?', ['Nie ma różnicy', 'unknown wymaga sprawdzenia przed użyciem', 'any jest bezpieczniejsze', 'unknown działa tylko z obiektami'], 'unknown wymaga sprawdzenia przed użyciem', 'unknown przyjmuje dowolną wartość, ale wymaga zawężenia typu. any wyłącza sprawdzanie typów dla tej wartości.'),
    question('p7', 'Dlaczego ten kod może zgubić aktualizację?', ['setCount jest synchroniczne', 'Obie operacje używają tego samego count', 'React nie obsługuje liczb', 'Nie ma klucza key'], 'Obie operacje używają tego samego count', 'Oba wywołania czytają tę samą migawkę stanu. Dwa setCount(previous => previous + 1) poprawnie kolejkują dwa przyrosty.', 'setCount(count + 1);\nsetCount(count + 1);'),
    question('p8', 'Co oznacza N+1 w komunikacji z bazą?', ['Jeden dodatkowy indeks', 'Jedno zapytanie i osobne dla każdego wyniku', 'N replik serwera', 'Poziom izolacji'], 'Jedno zapytanie i osobne dla każdego wyniku', 'Pobierasz N rekordów, a potem N razy ich relacje. JOIN, eager loading lub grupowe pobranie mogą ograniczyć liczbę zapytań.'),
    question('p9', 'Co daje indeks w bazie danych?', ['Zawsze szybszy zapis', 'Szybsze wybrane odczyty kosztem zapisu i miejsca', 'Automatyczne szyfrowanie', 'Brak potrzeby backupu'], 'Szybsze wybrane odczyty kosztem zapisu i miejsca', 'Indeks pomaga znaleźć dane, ale trzeba go utrzymywać przy zapisach. Dobieraj go do rzeczywistych zapytań i planów wykonania.'),
    question('p10', 'Co oznacza composition over inheritance?', ['Nigdy nie używaj klas', 'Łącz obiekty o małych odpowiedzialnościach', 'Wszystko umieść w jednej klasie', 'Kopiuj implementacje'], 'Łącz obiekty o małych odpowiedzialnościach', 'Składanie zachowań daje elastyczność bez sztywnej hierarchii dziedziczenia. To preferencja projektowa, nie absolutny zakaz.'),
    question('p11', 'Co gwarantuje transakcja z właściwością atomicity?', ['Zawsze niski czas wykonania', 'Wszystkie operacje albo żadna', 'Brak blokad', 'Dane wyłącznie w RAM'], 'Wszystkie operacje albo żadna', 'Atomowość oznacza, że częściowo wykonana transakcja nie pozostawi części swoich zmian jako zatwierdzonych.'),
    question('p12', 'Co jest prawdą o Java virtual threads?', ['Przyspieszają każde obliczenie CPU', 'Ułatwiają obsługę wielu zadań czekających na I/O', 'Zastępują bazę danych', 'Zawsze wymagają ręcznej puli'], 'Ułatwiają obsługę wielu zadań czekających na I/O', 'Wirtualne wątki są lekkie i pomagają w dużej współbieżności blokującego I/O. Nie zwiększają samej mocy obliczeniowej CPU.'),
  ],
  english: [
    question('e1', 'Co znaczy „a trade-off”?', ['Bezpłatny dodatek', 'Kompromis między korzyściami a kosztami', 'Ostateczna decyzja', 'Przekazanie pieniędzy'], 'Kompromis między korzyściami a kosztami', 'A trade-off: zyskujesz coś kosztem czegoś innego. „There is a trade-off between speed and accuracy.”'),
    question('e2', 'Uzupełnij: „I have been working here ___ 2022.”', ['for', 'since', 'during', 'from'], 'since', 'Since wskazuje punkt początkowy. For wskazuje okres: „for four years”.'),
    question('e3', '„Eventually” znaczy…', ['Ewentualnie', 'Natychmiast', 'Ostatecznie, w końcu', 'Sporadycznie'], 'Ostatecznie, w końcu', 'To fałszywy przyjaciel. „Eventually, the tests passed” = „W końcu testy przeszły”. Ewentualnie to np. possibly.'),
    question('e4', 'Które zdanie jest poprawne?', ['I am agree.', 'I agree.', 'I do agreeing.', 'I have agree.'], 'I agree.', 'Agree jest czasownikiem. Nie wymaga am: „I agree with you”.'),
    question('e5', '„To figure out” to…', ['Narysować kształt', 'Rozgryźć, zrozumieć', 'Zrezygnować', 'Zapamiętać liczbę'], 'Rozgryźć, zrozumieć', '„I figured out why it failed.” = „Rozgryzłem, dlaczego to nie zadziałało”.'),
    question('e6', '„Reliable” oznacza…', ['Niezawodny, godny zaufania', 'Relatywny', 'Skomplikowany', 'Niedostępny'], 'Niezawodny, godny zaufania', '„A reliable service” to usługa, na której można polegać.'),
    question('e7', 'Uzupełnij: „If I had more time, I ___ learn piano.”', ['will', 'would', 'can', 'had'], 'would', 'Drugi okres warunkowy: if + past simple, would + bezokolicznik. Opisuje hipotetyczną sytuację teraz lub w przyszłości.'),
    question('e8', '„Actually” najczęściej znaczy…', ['Aktualnie', 'Rzeczywiście, w rzeczywistości', 'Szybko', 'Później'], 'Rzeczywiście, w rzeczywistości', '„Actually, I prefer tea.” Aktualnie to currently lub at the moment.'),
  ],
  art: [
    question('a1', 'Który kierunek badał ulotne światło i wrażenie chwili?', ['Impresjonizm', 'Kubizm', 'Surrealizm', 'Gotyk'], 'Impresjonizm', 'Impresjoniści malowali zmienne światło, często w plenerze. Nazwa wiąże się z obrazem Moneta „Impresja, wschód słońca”.'),
    question('a2', 'Z czym najczęściej kojarzymy kubizm?', ['Jednym punktem widzenia', 'Wieloma punktami widzenia i geometryzacją', 'Wyłącznie pejzażem', 'Fotorealizmem'], 'Wieloma punktami widzenia i geometryzacją', 'Picasso i Braque rozbijali obiekty na formy, pokazując jednocześnie różne perspektywy.'),
    question('a3', 'Czym jest światłocień (chiaroscuro)?', ['Perspektywą zbieżną', 'Modelowaniem formy przez światło i cień', 'Rodzajem farby', 'Obrazem bez koloru'], 'Modelowaniem formy przez światło i cień', 'Kontrasty światła i cienia budują objętość i dramaturgię. Silne efekty kojarzymy m.in. z Caravaggiem.'),
    question('a4', 'Kto namalował „Dziewczynę z perłą”?', ['Claude Monet', 'Johannes Vermeer', 'Vincent van Gogh', 'Frida Kahlo'], 'Johannes Vermeer', 'Vermeer, XVII wiek. To tronie: studium postaci lub ekspresji, nie typowy zamówiony portret.'),
    question('a5', 'Co oznacza negatywna przestrzeń w kompozycji?', ['Uszkodzony fragment płótna', 'Przestrzeń wokół i pomiędzy obiektami', 'Tylko ciemne obszary', 'Brak perspektywy'], 'Przestrzeń wokół i pomiędzy obiektami', 'Puste obszary są aktywną częścią kompozycji. Wpływają na rytm, balans i czytelność kształtów.'),
    question('a6', 'Surrealizm często czerpie inspirację z…', ['Wyłącznie statystyki', 'Snów i nieświadomości', 'Dokumentacji budowlanej', 'Zasad rachunkowości'], 'Snów i nieświadomości', 'Surrealiści, np. Dalí i Magritte, zestawiali codzienne rzeczy w nieoczekiwany sposób, podważając zwykłą logikę.'),
  ],
  philosophy: [
    question('f1', 'Na czym koncentruje się stoicka „dychotomia kontroli”?', ['Na kontrolowaniu innych', 'Na odróżnieniu tego, co zależy od nas', 'Na unikaniu wszystkich emocji', 'Na przewidywaniu przyszłości'], 'Na odróżnieniu tego, co zależy od nas', 'Epiktet odróżniał własne sądy i wybory od rzeczy zewnętrznych. Nie chodzi o obojętność, ale o rozsądne kierowanie wysiłkiem.'),
    question('f2', 'Metoda sokratejska polega przede wszystkim na…', ['Uczeniu się odpowiedzi na pamięć', 'Pytaniach badających założenia', 'Wygrywaniu za wszelką cenę', 'Odwoływaniu się do autorytetu'], 'Pytaniach badających założenia', 'Sokrates przez pytania ujawniał niejasności i sprzeczności w przekonaniach rozmówcy.'),
    question('f3', 'Utylitaryzm ocenia działanie głównie przez…', ['Jego skutki dla dobrostanu', 'Nazwisko autora', 'Wiek reguły', 'Trudność wykonania'], 'Jego skutki dla dobrostanu', 'W klasycznej formie: największe szczęście największej liczby. Trudne pytanie: czy suma korzyści usprawiedliwia krzywdę jednostki?'),
    question('f4', 'Imperatyw kategoryczny Kanta pyta m.in., czy…', ['Regułę działania można chcieć jako prawo powszechne', 'Działanie jest popularne', 'Działanie jest przyjemne', 'Działanie jest legalne w jednym kraju'], 'Regułę działania można chcieć jako prawo powszechne', 'Pomyśl: co stałoby się, gdyby wszyscy działali według tej samej zasady? Etyka Kanta akcentuje obowiązek i szacunek dla osoby.'),
    question('f5', 'Epistemologia bada…', ['Piękno', 'Wiedzę i jej uzasadnienie', 'Systemy podatkowe', 'Budowę materii'], 'Wiedzę i jej uzasadnienie', 'Skąd wiemy, że coś wiemy? Epistemologia bada źródła, zakres i granice poznania.'),
    question('f6', 'Brzytwa Ockhama zaleca…', ['Wybierać zawsze najkrótsze zdanie', 'Nie mnożyć założeń bez potrzeby', 'Odrzucać wszystkie nowe teorie', 'Uznawać popularne opinie'], 'Nie mnożyć założeń bez potrzeby', 'Gdy wyjaśnienia równie dobrze pasują do danych, preferuj to z mniejszą liczbą zbędnych założeń. To wskazówka, nie dowód prawdziwości.'),
  ],
  economics: [
    question('k1', 'Koszt alternatywny to…', ['Cena najtańszego produktu', 'Wartość najlepszej utraconej możliwości', 'Podatek VAT', 'Suma wszystkich możliwości'], 'Wartość najlepszej utraconej możliwości', 'Godzina scrollowania kosztuje też to, co najlepszego mógłbyś zrobić w tym czasie. Liczy się najlepsza odrzucona alternatywa.'),
    question('k2', 'Inflacja oznacza…', ['Wzrost ceny dowolnego jednego produktu', 'Wzrost ogólnego poziomu cen', 'Zawsze wzrost płac realnych', 'Spadek podaży pieniądza'], 'Wzrost ogólnego poziomu cen', 'Inflacja to zmiana ogólnego poziomu cen w czasie. Pojedyncze podrożenie kawy jeszcze nie opisuje całej gospodarki.'),
    question('k3', 'Co robi procent składany?', ['Naliczane odsetki też zaczynają zarabiać', 'Pomija poprzednie odsetki', 'Gwarantuje brak ryzyka', 'Zawsze podwaja kapitał rocznie'], 'Naliczane odsetki też zaczynają zarabiać', 'Przy kapitalizacji odsetki dołączają do podstawy kolejnego naliczenia. Podobnie kumuluje się wiedza, choć bez gwarantowanej stopy zwrotu.'),
    question('k4', 'Czym jest efekt utopionych kosztów?', ['Ocena wyłącznie przyszłych korzyści', 'Trwanie przy decyzji przez nieodzyskiwalne wydatki', 'Podatek od strat', 'Zysk z oszczędzania'], 'Trwanie przy decyzji przez nieodzyskiwalne wydatki', '„Już tyle wydałem, więc muszę kontynuować”. Racjonalna decyzja porównuje przyszłe koszty i korzyści, nie to, czego nie da się odzyskać.'),
    question('k5', 'Jeśli popyt rośnie, a podaż się nie zmienia, zwykle…', ['Cena ma tendencję do wzrostu', 'Cena musi spaść do zera', 'Nie ma żadnego wpływu', 'Podaż automatycznie maleje'], 'Cena ma tendencję do wzrostu', 'W prostym modelu konkurencyjnego rynku wzrost popytu podnosi cenę równowagi. Rzeczywiste rynki mogą mieć regulacje i inne ograniczenia.'),
    question('k6', 'Dywersyfikacja inwestycji pomaga…', ['Usunąć każde ryzyko', 'Ograniczyć ryzyko koncentracji', 'Zagwarantować zysk', 'Uniknąć wszystkich opłat'], 'Ograniczyć ryzyko koncentracji', 'Rozłożenie ekspozycji może zmniejszyć ryzyko pojedynczej firmy lub sektora. Nie usuwa ryzyka całego rynku. To edukacja, nie porada inwestycyjna.'),
  ],
  curiosity: [
    question('c1', 'Dlaczego niebo w dzień jest niebieskie?', ['Odbija oceany', 'Krótsze fale światła silniej się rozpraszają', 'Powietrze jest niebieskim pigmentem', 'Słońce świeci na niebiesko'], 'Krótsze fale światła silniej się rozpraszają', 'Rozpraszanie Rayleigha w atmosferze silniej rozprasza krótsze fale. Odbiór barw przez oko pomaga wyjaśnić, dlaczego nie widzimy nieba jako fioletowego.'),
    question('c2', 'Co jest szczególnego w ośmiornicach?', ['Mają trzy serca', 'Nie mają układu nerwowego', 'Żyją tylko w słodkiej wodzie', 'Są ssakami'], 'Mają trzy serca', 'Dwa serca pompują krew do skrzeli, jedno do reszty ciała. Ich krew zawiera hemocyjaninę z miedzią.'),
    question('c3', 'Czym jest CRDT?', ['Format obrazu', 'Struktura danych do zbieżnych zmian rozproszonych', 'Algorytm szyfrowania', 'Protokół wyświetlania'], 'Struktura danych do zbieżnych zmian rozproszonych', 'Conflict-free Replicated Data Type pozwala replikom zbiegać do tego samego stanu przy spełnieniu określonych warunków, bez ręcznego rozwiązywania konfliktów.'),
    question('c4', 'Efekt odstępów w nauce oznacza, że…', ['Jedna długa sesja zawsze wygrywa', 'Powtórki rozłożone w czasie sprzyjają pamięci', 'Nie warto powtarzać', 'Należy uczyć się tylko wieczorem'], 'Powtórki rozłożone w czasie sprzyjają pamięci', 'Spaced repetition wykorzystuje odstępy między powtórkami. Wydobywanie informacji z pamięci dodatkowo wspiera zapamiętywanie.'),
    question('c5', 'Ile mniej więcej światło ze Słońca leci do Ziemi?', ['Jedną sekundę', '8 minut i 20 sekund', 'Jeden dzień', 'Jeden rok'], '8 minut i 20 sekund', 'Średnia odległość to ok. 150 milionów kilometrów. Przy ok. 300 000 km/s podróż trwa ok. 500 sekund.'),
    question('c6', 'Paradoks urodzin: ile osób daje ponad 50% szans na wspólne urodziny?', ['23', '183', '365', '2'], '23', 'Przy uproszczonym modelu 365 równoprawdopodobnych dni już 23 osoby dają ok. 50,7%. Porównujemy wszystkie pary, a nie jedną osobę z resztą.'),
  ],
};

const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
export function musicQuestions(clef = 'treble') {
  const first = clef === 'bass' ? 2 * 7 + 2 : 4 * 7;
  return Array.from({ length: 15 }, (_, position) => {
    const absolute = first + position;
    const name = noteNames[absolute % 7];
    const octave = Math.floor(absolute / 7);
    return { id: `note-${clef}-${position}`, prompt: 'Jak nazywa się ta nuta?', options: [...noteNames], answer: name, explanation: `To ${name}${octave}. ${name === 'H' ? 'W polskiej notacji H odpowiada angielskiemu B (bez bemola). ' : ''}Na pięciolinii każdy kolejny stopień to następna nazwa: C, D, E, F, G, A, H.`, kind: 'note', position, clef, octave };
  });
}

export const articles = [
  { id: 'deep', topic: 'programming', title: 'Mniej przycisków. Więcej możliwości.', subtitle: 'O głębokich modułach i dobrych interfejsach', minutes: 3, icon: 'layers', source: 'https://web.stanford.edu/~ouster/cgi-bin/book.php', sourceLabel: 'John Ousterhout · A Philosophy of Software Design', paragraphs: [
    ['Mały interfejs, duża praca', 'Dobry moduł daje dużo wartości przez mały, czytelny interfejs. Pomyśl o readFile(path): pod spodem są uprawnienia, buforowanie i komunikacja z systemem plików. Ty widzisz jedną operację. To właśnie głęboki moduł.'],
    ['Frontend: schowaj cały problem', 'Zamiast komponentu z piętnastoma flagami ładowania, błędów i stronicowania, wydziel komponent, który sam prowadzi jeden konkretny proces. Interfejs powinien opisywać intencję użytkownika, nie szczegóły implementacji. Nie znaczy to, że każdy komponent ma pobierać dane.'],
    ['Backend: odpowiedzialność, nie przekazywanie', 'Klasa, która tylko przekazuje pięć argumentów do kolejnej klasy, często zwiększa koszt zrozumienia bez realnej korzyści. Z kolei serwis rezerwacji, który w jednej operacji pilnuje dostępności, transakcji i błędów, może ukrywać prawdziwą złożoność.'],
    ['Zatrzymaj się na chwilę', 'Wybierz komponent z pracy. Czy jego użytkownik musi wiedzieć, jak działa wnętrze? Jakie dwa szczegóły można schować bez odbierania mu potrzebnej kontroli?'],
  ] },
  { id: 'retrieval', topic: 'curiosity', title: 'Nie czytaj drugi raz. Spróbuj sobie przypomnieć.', subtitle: 'Dlaczego mały quiz potrafi więcej niż zakreślacz', minutes: 2, icon: 'brain', source: 'https://www.learningscientists.org/retrieval-practice', sourceLabel: 'The Learning Scientists · Retrieval practice', paragraphs: [
    ['Znajome nie znaczy zapamiętane', 'Ponowne czytanie daje przyjemne poczucie znajomości. Ale rozpoznanie zdania i samodzielne odtworzenie pomysłu to dwie różne umiejętności.'],
    ['Mały wysiłek, ważna informacja', 'Zamknij tekst i opowiedz własnymi słowami, o co chodziło. Próba wydobycia informacji ćwiczy pamięć i ujawnia luki. Sprawdź potem odpowiedź: korekta błędu jest ważną częścią nauki.'],
    ['Jutro, nie tylko dzisiaj', 'Wróć do pytania jutro i za kilka dni. Odstępy pomagają w długotrwałym pamiętaniu. Njudy umieszcza błędne odpowiedzi wcześniej w kolejnych treningach, ale nie jest pełnym systemem planowania powtórek.'],
  ] },
  { id: 'stoic', topic: 'philosophy', title: 'Na co masz dzisiaj wpływ?', subtitle: 'Stoicyzm bez zaciskania zębów', minutes: 2, icon: 'sun', source: 'https://pl.wikisource.org/wiki/Encheiridion', sourceLabel: 'Epiktet · Encheiridion', paragraphs: [
    ['Dwie różne rzeczy', 'Epiktet rozróżniał to, co zależy od nas, i to, co nie zależy. Nie wybierasz pogody, opinii innych ani wszystkich wyników swojej pracy. Możesz kierować własnymi sądami, intencjami i decyzjami.'],
    ['To nie jest zakaz emocji', 'Stoicyzm nie musi oznaczać udawania, że nic nie boli. Możesz zauważyć emocję, a dopiero potem ocenić, czy jej pierwsza interpretacja rzeczywistości jest trafna.'],
    ['Jedno pytanie na dziś', 'Pomyśl o czymś, co cię irytuje. Co w tej sytuacji jest twoim konkretnym kolejnym działaniem, a co jedynie oczekiwaniem wobec świata?'],
  ] },
  { id: 'opportunity', topic: 'economics', title: 'Prawdziwa cena „jeszcze pięciu minut”.', subtitle: 'Koszt alternatywny bez wykresów', minutes: 2, icon: 'timer', source: 'https://www.core-econ.org/the-economy/', sourceLabel: 'CORE Econ · The Economy', paragraphs: [
    ['Cena nie musi mieć waluty', 'Koszt alternatywny to wartość najlepszej możliwości, z której rezygnujesz. Gdy wybierasz godzinę dodatkowej pracy, kosztem może być odpoczynek. Gdy odpoczywasz, kosztem może być dochód.'],
    ['Nie sumuj całego świata', 'Kosztem nie jest suma wszystkich rzeczy, które mógłbyś zrobić. To jedna najlepsza niewybrana alternatywa. Dzięki temu pojęcie nadaje się do prawdziwych decyzji, a nie do produkowania poczucia winy.'],
    ['Odpoczynek też ma wartość', 'Nie każda chwila musi być produktywna. Dobra decyzja uwzględnia energię, przyjemność i regenerację, nie tylko pieniądze. Zastanów się: czego potrzebujesz teraz najbardziej?'],
  ] },
  { id: 'light', topic: 'art', title: 'Ten sam pejzaż. Zupełnie inne światło.', subtitle: 'Jak patrzeć na impresjonizm', minutes: 2, icon: 'palette', source: 'https://www.metmuseum.org/art/collection/search/436535', sourceLabel: 'The Metropolitan Museum of Art', paragraphs: [
    ['Zamiast konturu: chwila', 'Impresjoniści skupiali się na tym, jak światło zmienia odbiór sceny. Luźne pociągnięcia pędzla z bliska mogą przypominać plamy. Z daleka oko łączy je w migotliwy obraz.'],
    ['Van Gogh poszedł dalej', 'W „Cyprysach z polem pszenicy” ruch pędzla nie tylko opisuje światło, ale nadaje pejzażowi energię. Van Gogha zalicza się do postimpresjonizmu, nie po prostu impresjonizmu.'],
    ['Spójrz trzy razy', 'Najpierw zauważ najjaśniejsze miejsce. Potem kierunek ruchu pędzla. Na końcu zastanów się, dokąd obraz prowadzi twój wzrok. Nie musisz znać daty ani nazwiska, żeby zacząć uważnie patrzeć.'],
  ] },
  { id: 'english-context', topic: 'english', title: 'Jedno słowo. Twoje własne zdanie.', subtitle: 'Słownictwo, które ma kontekst', minutes: 2, icon: 'languages', source: 'https://dictionaryapi.dev/', sourceLabel: 'Free Dictionary API', paragraphs: [
    ['Trade-off', 'Kompromis między dwiema pożądanymi rzeczami. „There is a trade-off between simplicity and flexibility.” Prostota i elastyczność mogą ciągnąć projekt w różne strony.'],
    ['Reliable', 'Niezawodny, godny zaufania. „We need a reliable backup.” Użyj tego słowa do opisania osoby, usługi albo narzędzia, na którym polegasz.'],
    ['Zbuduj własne zdanie', 'Zamiast zapamiętywać samotne tłumaczenie, napisz albo wypowiedz zdanie związane z twoim dniem. Kontekst daje kolejną drogę do przypomnienia słowa.'],
  ] },
  { id: 'notes', topic: 'music', title: 'Pięć linii, siedem nazw.', subtitle: 'Pierwszy krok do czytania nut', minutes: 2, icon: 'music-2', source: 'https://www.musictheory.net/lessons/10', sourceLabel: 'musictheory.net · The staff', paragraphs: [
    ['Każdy stopień ma znaczenie', 'Nuty leżą na liniach albo w polach między nimi. Idąc w górę o jeden stopień, przechodzisz do następnej nazwy: C, D, E, F, G, A, H, a potem znów C. W polskim nazewnictwie H jest naturalne, a B oznacza obniżone H.'],
    ['Klucz ustawia mapę', 'W kluczu wiolinowym najniższa linia to E4, kolejne to G4, H4, D5, F5. W kluczu basowym: G2, H2, D3, F3, A3. Klucz nie jest dekoracją: mówi, gdzie jesteśmy.'],
    ['Nie zgaduj kształtu', 'Na początku znajdź znaną nutę na linii, a potem policz stopnie do szukanej. Krótkie treningi z czasem zamienią liczenie w rozpoznawanie. Ćwiczenia tutaj dotyczą nut naturalnych, bez krzyżyków i bemoli.'],
  ] },
  { id: 'mental-math', topic: 'math', title: 'Podziel problem, nie uwagę.', subtitle: 'Małe skróty w liczeniu w pamięci', minutes: 2, icon: 'calculator', source: 'https://pl.khanacademy.org/math/arithmetic', sourceLabel: 'Khan Academy · Arytmetyka', paragraphs: [
    ['Rozbij mnożenie', '17 × 6 można policzyć jako 10 × 6 + 7 × 6, czyli 60 + 42 = 102. Korzystasz z rozdzielności mnożenia względem dodawania.'],
    ['Zaokrąglij i popraw', '19 × 8 to 20 × 8 minus 8: 160 − 8 = 152. Wygodny punkt odniesienia zmniejsza obciążenie pamięci roboczej.'],
    ['Dokładność przed tempem', 'Najpierw nazwij swój sposób liczenia. Szybkość przyjdzie z praktyką. Nie ma tu licznika czasu: trening ma pobudzać, nie stresować.'],
  ] },
];

export const words = ['serendipity', 'resilient', 'curiosity', 'thoughtful', 'reliable', 'subtle', 'endeavour', 'insight', 'mindful', 'eloquent', 'perspective', 'tenacious'];
export const wordFallback = {
  serendipity: ['szczęśliwy zbieg okoliczności', 'The occurrence of events by chance in a happy or beneficial way.'],
  resilient: ['odporny, umiejący się podnieść', 'Able to recover after difficulty.'],
  curiosity: ['ciekawość', 'A strong desire to know or learn something.'],
  thoughtful: ['uważny, troskliwy', 'Showing careful consideration or attention.'],
  reliable: ['niezawodny', 'Consistently good in quality; able to be trusted.'],
  subtle: ['subtelny', 'Not obvious; delicate or precise.'],
  endeavour: ['staranie, wysiłek', 'An attempt to achieve a goal.'],
  insight: ['wnikliwe zrozumienie', 'A deep understanding of a person or thing.'],
  mindful: ['uważny, świadomy', 'Conscious or aware of something.'],
  eloquent: ['elokwentny', 'Fluent or persuasive in speaking or writing.'],
  perspective: ['perspektywa', 'A particular way of considering something.'],
  tenacious: ['wytrwały', 'Holding firmly to a purpose; persistent.'],
};