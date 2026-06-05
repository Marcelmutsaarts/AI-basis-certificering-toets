# Kennisbasis Webinar 2: Custom chatbots en AI als docent-assistent

> Bronnen: transcript webinar 2 en webinar_2 slides. Niveau: basis. Ground truth voor de examinator (Lieke) en de beoordelaar.

## 1. Kernbegrippen en correcte definities

- **Custom chatbot (gepersonaliseerde chatbot):** een chatbot waarin je een vaste instructie (prompt) opslaat, zodat hij telkens hetzelfde gewenste gedrag vertoont en herbruikbaar en deelbaar wordt. Onder de motorkap is het in feite gewoon een opgeslagen prompt. Een gewone chat met diezelfde prompt erin geplakt gedraagt zich identiek.
- **GPT:** de naam voor een custom chatbot binnen ChatGPT. Bouwen vereist een betaald ChatGPT-account.
- **Gem:** de naam voor een custom chatbot binnen Gemini (Google). Werkt vrijwel identiek aan een GPT en kan met een gratis account. In Copilot heet hetzelfde concept een **agent**.
- **De opbouw van een goede prompt of custom chatbot:** rol, doel, context, instructies, voorbeeld, output en kennis. Dit is het geraamte. De bovenste drie (rol, doel of context, instructies) zijn minimaal nodig, voorbeeld en output maken het scherper.
  - *Rol:* wie de chatbot is, bijvoorbeeld "je bent een expert in toetsing".
  - *Doel of context:* waarover en voor wie hij werkt, bijvoorbeeld vakgebied, doelgroep, niveau.
  - *Instructies:* stap voor stap hoe het gesprek verloopt. Marcel vergelijkt dit met programmeercode in het Nederlands ("eerst dit, dan dat").
  - *Voorbeeld:* een goed voorbeelditem meegeven werkt vaak krachtiger dan een lange beschrijving.
  - *Kennis:* extra terminologie of feiten, plus de mogelijkheid bestanden te uploaden. Het instructieveld heeft een limiet van ongeveer 1500 tokens (circa 1000 woorden), uploads vergroten het context window.
- **Naam en beschrijving van een GPT of Gem:** doen inhoudelijk niets voor het gedrag van de bot. Ze helpen alleen jou en andere gebruikers terugvinden en begrijpen waar de bot voor is.
- **Delen:** een custom chatbot kan privé blijven, gedeeld worden via een link, of openbaar in de "winkel" (GPT-store) staan. Bij Gemini moet je expliciet "iedereen met de link toegang geven" aanzetten, anders werkt de gedeelde link niet voor anderen.
- **Tools van een chatbot:** per GPT kun je aanzetten of hij mag internet zoeken, afbeeldingen genereren, of de canvas en code interpreter mag gebruiken. Code interpreter is nodig om bijvoorbeeld een Word-bestand te programmeren. Tip: zet beeldgeneratie uit voor chatbots waar leerlingen mee werken, anders gaan ze plaatjes maken in plaats van leren.
- **Gespreksopening (conversation starter):** een voorgestelde eerste prompt-knop die de gebruiker kan aanklikken, zodat het gesprek gestuurd begint.
- **Project:** een werkomgeving in ChatGPT of Claude waarbinnen je chats en bronnen bundelt rond een thema. In feite een custom chatbot voor jezelf, niet primair bedoeld om te delen.
- **Skill:** een opgeslagen instructie die in elke willekeurige chat oproepbaar is. Het systeem bepaalt zelf wanneer een skill nodig is. Volgens Tom en Marcel zijn skills meer de toekomst dan losse GPT's of projecten.
- **Agent of agentmodus (agentic AI):** AI die niet alleen antwoordt maar zelfstandig volledige taken uitvoert, soms uren achter elkaar. Voorbeeld: een complete les met werkbladen, lesvoorbereiding en PowerPoint in één opdracht laten maken.
- **Computer use:** de AI letterlijk je computer laten bedienen, zodat hij zelf in applicaties werkt (genoemd: Openclaw, ChatGPT-agentmodus, Claude Cowork). Technisch mogelijk maar gevoelig bij persoonsgegevens.
- **Transcriberen:** gesproken woord omzetten in tekst. Lokale of veilige tools: aTrain (lokaal op je eigen computer, ontwikkeld door de Universiteit van Zürich), MacWhisper (Mac), of Word en Teams onder een gebruikersovereenkomst die data binnen Europa houdt.
- **OCR:** handgeschreven of gescande tekst laten herkennen, zodat ook handmatig werk nagekeken kan worden.
- **Deep research (diepgaand onderzoek):** een agent die zelfstandig veel bronnen raadpleegt en een gestructureerd rapport met bronvermeldingen oplevert. Beschikbaar in ChatGPT, Gemini en Claude. Genoemd als de meest betrouwbare AI-functie van dit moment, mede door de bronvermeldingen.
- **NotebookLM:** een educatieve tool van Google waarbij je altijd eigen bronnen uploadt. De chat baseert zich op die bronnen, waardoor hij minder hallucineert en betrouwbaarder is. De studio-kant maakt leermaterialen: audio-overzicht, video-overzicht, diapresentatie, mindmap, flashcards, quiz, infographic. Gratis, maar alle ingevoerde data gaat naar Google.

## 2. Leerdoelen

- De docent kan een custom chatbot (GPT of Gem) bouwen met een doordachte instructie volgens de opbouw rol, doel, context, instructies, voorbeeld en output. [categorie: toepassen; domeinen: Kennis, Mindset]
- De docent kan uitleggen waarom een custom chatbot meerwaarde heeft boven losse prompts, namelijk herbruikbaarheid en deelbaarheid van een goede prompt. [categorie: begrijpen; domeinen: Kennis]
- De docent kan beoordelen welke onderwijs- en docenttaken zich lenen voor AI-ondersteuning en welke niet. [categorie: analyseren; domeinen: Mindset, Agency]
- De docent kan AI inzetten bij feedback en beoordeling met behoud van de eigen regie, en weet dat AI bij summatief beoordelen hulpmiddel is en geen eindbeoordelaar. [categorie: evalueren; domeinen: Agency, Ethiek, Pedagogiek]
- De docent kan de belangrijkste privacy- en regelgevingsgrenzen benoemen, waaronder geen persoonsgegevens in publieke chatbots en de hoog-risicostatus van beoordelen onder de EU AI-act. [categorie: begrijpen; domeinen: Ethiek]
- De docent kan voorkomen dat een AI-workflow tot gemiddelde, inwisselbare output leidt door eigen voorbeelden, context en kritische controle toe te voegen. [categorie: analyseren; domeinen: Mindset, Kennis]

## 3. Verwachte praktijkvoorbeelden

- Een kennistoetsgenerator als GPT: rol als toetsexpert, doel meerkeuzevragen maken voor een specifiek vak en niveau, instructie om eerst naam, aantal vragen en thema te vragen, een voorbeelditem met casus, drie of vier antwoordalternatieven en toelichting, en op verzoek een Word-bestand.
- Een rubrieksbouwer-GPT die eerst om context vraagt (opdracht, leerdoelen, formatief of summatief, aantal niveaus) voordat hij bouwt.
- Een lesvoorbereiding-GPT, bijvoorbeeld op basis van een onderwijskundig model zoals het model van Van Gelder, of op basis van een eigen lesvoorbeeld.
- Een GPT die een les omzet naar formatief handelen.
- Een energizer-generator (als project) die werkvormen bedenkt binnen de context van een les.
- Brainstormen zonder GPT: "geef tien ideeën om deze les interactiever te maken", stellingen of een oefenopgave voor in de les. Tom noemt dit zijn meest gebruikte toepassing.
- Feedback op SMART-doelstellingen, eerst als hulp voor de docent, later als GPT die studenten zelf gebruiken vóór inleveren.
- Toetsanalyse op een geanonimiseerd databestand: itemmoeilijkheid (p-waarde), Rir-waarde, zwakke vragen aanwijzen en normering, uitgevoerd door een agentic systeem.
- Anonimiseren van een bestand in de eigen browser, met een lokaal sleutelbestand om later te de-anonimiseren.
- AI als sparringspartner om een lastig gesprek voor te bereiden of te oefenen, bijvoorbeeld een oudergesprek over een studiekeuze, met scenario's en aandachtspunten zoals "hoe weersta ik dat ik partij kies".

## 4. Veelgemaakte misvattingen en rode vlaggen

- **Misvatting: "Een custom chatbot is iets fundamenteel slims of intelligents."** Correctie: het is in essentie een opgeslagen prompt. De waarde zit in herbruikbaarheid en deelbaarheid, niet in magie. Wie alleen buzzwords gebruikt ("ik bouw een AI-agent die alles regelt") zonder de prompt-opbouw te kunnen benoemen, mist de kern.
- **Misvatting: "Hoe vager mijn instructie, hoe vrijer en creatiever de bot."** Correctie: vaagheid laat de AI zelf invullen en levert vaak verkeerde of generieke output. Hoe concreter de context, hoe scherper het gedrag. Dit is het sleutelinzicht achter vraag 2D.
- **Misvatting: "Met een gratis account kan ik alles wat in het webinar getoond wordt."** Correctie: GPT's bouwen, agentmodus, Claude Cowork en mooie PowerPoints met afbeeldingen vragen meestal een betaald account. Gems bouwen en NotebookLM kunnen gratis. Vuistregel uit het webinar: de gratis versie kan ongeveer wat de betaalde versie een jaar eerder kon.
- **Misvatting: "AI kan niet goed nakijken."** Correctie: met een goede AI en goede prompting kan AI volgens de sprekers al sterk nakijken, op sommige vakgebieden (bijvoorbeeld exacte vakken) zelfs beter dan een docent. Maar met een slechte AI of slechte prompt kan het juist volledig misgaan. Het hangt sterk af van vak en kalibratie.
- **Misvatting: "Als het technisch kan, mag het ook."** Correctie: techniek en toelaatbaarheid zijn twee aparte vragen. Beoordelen valt onder hoog risico in de EU AI-act, de human blijft altijd in de loop, en de regels zijn nog vaag (de sprekers zijn het zelf niet eens over de precieze invulling).
- **Misvatting: "Ik kan studentgegevens of verslagen gewoon in ChatGPT of NotebookLM zetten om te laten nakijken."** Correctie: persoonsgegevens horen niet in publieke chatbots die data naar de VS sturen. Anonimiseer eerst, of gebruik een lokale of Europese oplossing. Dit geldt ook voor transcripten van oudergesprekken of rapportvergaderingen.
- **Misvatting: "Een AI mag mijn cijfers zelf invoeren in Magister of Osiris via computer use."** Correctie: technisch kan het, maar bij docent- of leerlinggegevens is dit een serieus privacyprobleem. In het webinar wordt verwezen naar een incident op de HAN dat de landelijke pers haalde. "Don't do it", tenzij op een veilige testomgeving zonder echte gegevens.
- **Misvatting: "AI verlicht mijn werk, dus ik heb minder werk."** Correctie: Marcel relativeert dat verlicht werk vaak nieuw werk oproept. De winst zit eerder in verrijking en in het wegnemen van saaie klussen dan in netto minder uren.
- **Misvatting: "Eén keer een GPT bouwen kost te veel tijd, dat is het niet waard."** Correctie: een goede toetsgenerator bouwen kost misschien een tot anderhalf uur, maar bespaart elk blok daarna uren. De investering loont bij herhaald gebruik.
- **Rode vlag, oppervlakkig antwoord:** termen als "agent", "skill", "deep research" of "computer use" noemen zonder te kunnen uitleggen wat ze doen of wanneer je ze inzet. Doorvragen onthult of er substantie achter zit.
- **Rode vlag, ingestudeerd antwoord:** alleen voordelen opsommen (tijdwinst, persoonlijke feedback) zonder enige afweging, grens of risico. Een sterk antwoord erkent ook wanneer AI niet past of waar de docent het zelf wil houden.
- **Rode vlag, geen eigen regie:** de docent beschrijft AI als iets dat de taak overneemt, zonder eigen controle, kalibratie of inhoudelijke eindverantwoordelijkheid. Vraag dan naar wat de docent zelf nog doet.

## 5. Verifieerbare claims en goede doorvraagrichtingen

- **Claim:** een custom chatbot is in de kern een opgeslagen prompt. *Doorvragen:* "Waarom zou je dan de moeite nemen om een GPT te bouwen in plaats van de prompt steeds opnieuw te typen?" Goed antwoord leidt naar herbruikbaarheid, structuur bewaren en delen met collega's of leerlingen.
- **Claim:** de minimale opbouw is rol, doel of context, en instructies. *Doorvragen:* "Welke onderdelen zou jij voor jouw taak meegeven en waarom?" Goed antwoord koppelt onderdelen aan een concrete eigen taak en noemt het nut van een voorbeelditem.
- **Claim:** GPT's bouwen vraagt betaald, Gems kunnen gratis. *Doorvragen:* "In welke tool zou jij dit kunnen maken met jouw account?" Toetst realistisch besef van toegang en kosten.
- **Claim:** AI kan goed of juist slecht nakijken, afhankelijk van model en prompt. *Doorvragen:* "Voor jouw vak, zou je AI laten beoordelen, en wat zou er mis kunnen gaan?" Goed antwoord weegt vakgebied (exact versus open) en noemt kalibratie of controle.
- **Claim:** beoordelen valt onder hoog risico in de EU AI-act, lesvoorbereiding niet of laag. *Doorvragen:* "Wat betekent hoog risico concreet voor hoe jij AI bij beoordelen zou inzetten?" Goed antwoord noemt human in de loop, hulpmiddel niet eindbeoordelaar, en eventueel anonimiteit.
- **Claim:** persoonsgegevens horen niet in publieke chatbots. *Doorvragen:* "Hoe zou je een verslag van een student dan toch met AI kunnen laten nakijken?" Goed antwoord noemt anonimiseren, lokale tools, of een Europese of afgeschermde omgeving.
- **Claim:** vage prompts geven generieke output. *Doorvragen:* "Hoe voorkom jij dat de output gemiddeld of inwisselbaar wordt?" Goed antwoord noemt eigen context, eigen voorbeelden, eigen lesopbouw, en kritische nabewerking. Dit is de kern van vraag 2D.

## 6. Domeinkoppeling

Dit webinar raakt vooral **Kennis** en **Mindset**, met stevige raakvlakken aan **Ethiek**, **Agency** en **Pedagogiek**.

- **Kennis:** herkenbaar als de docent kan uitleggen hoe een custom chatbot werkt (opgeslagen prompt), de prompt-opbouw benoemt, tools onderscheidt (GPT, Gem, project, skill, agent, NotebookLM, deep research) en weet dat AI-output kritisch beoordeeld moet worden. Correcte terminologie en besef van betaald versus gratis horen erbij.
- **Mindset:** herkenbaar als de docent bewust afweegt welke taken hij wel en niet aan AI uitbesteedt, en dat koppelt aan eigen onderwijswaarden of werkplezier ("dit doe ik liever zelf"). AI als gereedschap dat verrijkt, niet als vervanging van vakmanschap.
- **Ethiek:** herkenbaar als de docent privacy concreet maakt (geen persoonsgegevens, anonimiseren, data naar de VS), transparantie benoemt (eigen naam onder AI-werk, eerlijkheid over AI-gebruik) en de hoog-risicostatus van beoordelen kent.
- **Agency:** herkenbaar als de docent regie en eigenaarschap toont: zelf kalibreren, zelf de eindverantwoordelijkheid houden, human in de loop, en niet door de tool gestuurd worden.
- **Pedagogiek:** herkenbaar als de docent AI-inzet verbindt aan een leerdoel en aan begeleiding, bijvoorbeeld een feedback-GPT aan studenten geven zodat zij zelf hun werk verbeteren, met aandacht voor het leerproces en niet alleen het eindproduct.

## 7. Koppeling naar de examenvragen

### 2A. "Beschrijf een GPT of GEM die jij hebt gebouwd of zou bouwen voor een van je docenttaken. Welke rol, welk doel, welke instructies geef je hem?" [domeinen: Kennis, Mindset; categorie: toepassen]

- *Waar je op let:* of de docent de prompt-opbouw concreet toepast op een echte eigen taak, met een herkenbare rol, een helder doel of context, en uitvoerbare instructies. Sterke antwoorden noemen een voorbeelditem of gewenste output.
- *Goed antwoord bevat:* een specifieke taak (toetsvragen, rubriek, feedback, lesopzet), een passende rol, doel met vak en niveau, en een paar concrete instructiestappen. Bonus: nadenken over welke tools aan of uit moeten en of de bot gedeeld wordt.
- *Misvatting die kan opduiken:* alleen een naam of vaag idee noemen ("een GPT die mijn werk doet") zonder rol, doel of instructie. Of denken dat de naam of beschrijving het gedrag bepaalt.

### 2B. "Voor welke docenttaak is AI volgens jou geen handige assistent? Waarom niet?" [domeinen: Mindset, Agency; categorie: analyseren]

- *Waar je op let:* of de docent een onderbouwde grens trekt, vanuit waarde, vakgebied of kwaliteit, en niet alleen voordelen opsomt.
- *Goed antwoord bevat:* een concrete taak die de docent zelf wil houden, met een reden (eigen oordeel nodig, persoonlijk contact, exacte versus open beoordeling, privacy, of werkplezier). Het laat zien dat de docent bewust kiest in plaats van alles uit te besteden.
- *Misvatting die kan opduiken:* zeggen dat AI overal handig is en geen enkele grens kunnen noemen, of een grens noemen zonder enige onderbouwing.

### 2C. "Een collega laat AI rapportages schrijven en zet zijn naam eronder. Wat vind je daarvan?" [domeinen: Ethiek, Agency; categorie: evalueren]

- *Waar je op let:* of de docent een afgewogen ethisch oordeel geeft over transparantie en verantwoordelijkheid, niet alleen goed- of afkeurt.
- *Goed antwoord bevat:* het onderscheid tussen AI als hulpmiddel (acceptabel) en eindverantwoordelijkheid afschuiven (problematisch). Aandacht voor transparantie, voor het zelf controleren van de inhoud, en voor privacy als er leerling- of persoonsgegevens in zitten. Een onderbouwde positie weegt zwaarder dan een kreet.
- *Misvatting die kan opduiken:* alles afwijzen ("AI gebruiken is vals") of alles goedkeuren ("scheelt tijd, prima") zonder de verantwoordelijkheids- en transparantievraag te raken. Of de privacydimensie missen.

### 2D. "Hoe voorkom je dat je AI-assistent-workflow leidt tot gemiddelde of inwisselbare output?" [domeinen: Mindset, Kennis; categorie: analyseren]

- *Waar je op let:* of de docent het kerninzicht raakt dat vage of generieke input generieke output geeft, en concreet benoemt hoe je daar bovenuit komt.
- *Goed antwoord bevat:* eigen context, eigen voorbeelden, eigen lesopbouw of stijl meegeven, goede instructies en voorbeelditems, en kritische nabewerking of eigen oordeel. Het laat regie en eigen vakmanschap zien in plaats van klakkeloos overnemen.
- *Misvatting die kan opduiken:* denken dat een betere of duurdere AI vanzelf unieke output geeft, of dat meer automatiseren het probleem oplost. De oplossing zit in de eigen inbreng en controle, niet in de tool.

---

*Twijfels over termen: de tooltermen zijn uit het automatische transcript geverifieerd tegen de slides. Zeker: GPT, Gem, project, skill, agent, NotebookLM, deep research, aTrain, Claude Cowork, model van Van Gelder, formatief handelen, EU AI-act, OCR. Het transcript schrijft tools vaak fonetisch fout (bijvoorbeeld "Jemenai" voor Gemini, "clode" voor Claude, "Openclaw" voor de computer-use-tool, "Rir-score" als "rearscore"); de slides bevestigen de juiste schrijfwijze. De term "computerhuse" in het transcript is computer use.*
