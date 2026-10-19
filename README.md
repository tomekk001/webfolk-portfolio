# WebFolk – strona portfolio

## Co jest w folderze

| Plik | Do czego służy |
|---|---|
| `index.html` | treść strony: teksty, sekcje, linki |
| `style.css` | wygląd: kolory, czcionki, układ |
| `script.js` | wycinanka w nagłówku i przyciski „Kopiuj” |

## Uruchomienie w VS Code

1. W VS Code: **File → Open Folder…** i wybierz folder `Documents\claude\portfolio`.
2. Zainstaluj rozszerzenie **Live Server** (autor: Ritwick Dey): ikona kostek po lewej, wpisz „Live Server”, kliknij Install.
3. Kliknij prawym przyciskiem na `index.html` → **Open with Live Server**.
   Strona otworzy się w przeglądarce i odświeży się sama po każdym zapisie pliku (Cmd+S / Ctrl+S).

## Co podmienić przed publikacją

Użyj **Edit → Replace in Files** (Cmd+Shift+H / Ctrl+Shift+H):

- `[Twoje imię]` → Twoje imię
- `+48 000 000 000` i `+48000000000` → Twój numer (oba zapisy)
- `kontakt@webfolk.pl` → zostaw, jeśli założysz taką skrzynkę przy domenie
- Zdjęcie: wrzuć plik, np. `ja.jpg`, do folderu i w `style.css` w regule `.about__photo` zamień tło na
  `background: url("ja.jpg") center / cover;`, a w `index.html` usuń napis „Twoje zdjęcie”.
- Ceny w sekcji „Oferta” w `index.html`. Cena opieki nad stroną celowo nie jest podana; przy wycenach orientacyjnie 179–249 zł miesięcznie.

## Publikacja pod webfolk.pl

1. Zarejestruj domenę webfolk.pl u dowolnego rejestratora.
2. Najprościej: darmowe konto na Netlify → przeciągnij folder `webfolk` na stronę „Deploy manually”.
3. W ustawieniach Netlify dodaj własną domenę i ustaw rekordy DNS u rejestratora według instrukcji Netlify.

Projekty w sekcji „Realizacje” są oznaczone jako pokazowe. Gdy zrobisz stronę dla prawdziwego klienta, zamień je na swoje realizacje.
