# Kennisbasis Webinar 1: Hoe werkt een LLM en basis-prompting

> Bronnen: transcript-basis-webinar-1 en webinar_1 slides. Niveau: basis. Ground truth voor de examinator (Lieke) en de beoordelaar.

## 1. Kernbegrippen en correcte definities

- **Generatieve AI**: AI die iets nieuws genereert, dus content die er nog niet was. Het is een breder begrip dan alleen tekst: de modaliteit kan tekst, beeld, video of muziek zijn. Niet alle AI is generatief (het YouTube-aanbevelingsalgoritme is ook AI, maar niet generatief).
- **Large Language Model (LLM) / taalmodel**: een model dat getraind is op grote hoeveelheden taal en op basis daarvan tekst genereert. De moderne bekende modellen zijn van de grond af getrainde **multimodale modellen**: ze worden nog taalmodellen genoemd, maar kunnen ook zien, horen en vaak beeld genereren en praten.
- **Modaliteit**: de vorm waarin een model werkt, bijvoorbeeld tekst, beeld, video, audio of muziek. Het generatieve principe is hetzelfde; alleen de data verschilt (taal in geeft taal uit, beelden in geeft beelden uit).
- **Pretraining**: de eerste trainingsfase. Aanbieders (Google, OpenAI, Anthropic) duwen zeer grote hoeveelheden data door het model; het model leert de structuur in die data herkennen. Voorbeeld uit het webinar: "hond" en "kat" staan in het Nederlands relatief vaak dicht bij elkaar in een zin, en zo'n verborgen structuur leert het model.
- **Scaling law (schalingswet)**: hoe meer (en hoe hoogwaardiger) data, hoe meer structuur het model eruit haalt en hoe intelligenter het wordt.
- **Posttraining / fine-tuning**: de fase na pretraining waarin het model wordt bijgeslepen zodat het antwoorden geeft die mensen prettig vinden. Gebeurt met menselijke en AI-feedback (in het webinar uitgelegd als duimpje omhoog of omlaag, beloning of straf). Belangrijk: dit gaat over hoe prettig mensen het antwoord vinden, niet over de inhoudelijke kwaliteit.
- **Reasoning- of redeneermodel (denken)**: sinds ongeveer december 2024. Een model dat eerst nadenkt voordat het antwoordt. Meer redeneertijd geeft in de regel een beter antwoord. In de chatbot zichtbaar als "denken" aanzetten tegenover "instant".
- **System prompt**: de vaste tekst die de aanbieder achter het systeem zet en die de chatbot altijd als eerste leest, nog voor jouw bericht. Stuurt het gedrag (bijvoorbeeld "je bent een behulpzame AI-assistent") en legt grenzen op (geen gevaarlijke instructies). Kan enkele tot vele pagina's lang zijn.
- **Sycofantisch gedrag (sycophancy)**: de neiging van chatbots om de gebruiker gelijk te geven, veel complimenten te geven en overdreven vrolijk te reageren. Komt voort uit de posttraining en de system prompt. Is deels weg te prompten.
- **Prompt**: de instructie of vraag die jij inttypt. Met een eigen prompt kun je de system prompt deels overrulen en het gedrag van de chatbot naar je hand zetten.
- **Custom prompting / gepersonaliseerde prompt**: een uitgebreidere prompt die het gedrag van de chatbot stuurt, opgebouwd via een vast format (zie sectie 3). Hiermee pak je als docent de regie.
- **Personalisatie-instellingen**: vaste instructies in je account die voor al je chats gelden, zodat je niet bij elke chat opnieuw hoeft te sturen. Zit in ChatGPT en ook in andere chatbots.
- **Agent / autonome agent**: een chatbot die zelfstandig een taak uitvoert en een product oplevert. De agent plant zelf, bedenkt zelf hoe hij het aanpakt en controleert vaak zijn eigen werk, zonder steeds te tonen hoe. In het webinar vergeleken met een intelligente stagiair. Tussenvorm: een chatbot met denken aan en met visualisatie schuift al richting agent.
- **Cognitive offloading (cognitieve uitbesteding)**: het denkwerk uitbesteden aan AI in plaats van het zelf te doen, waardoor het leren afneemt.
- **Context window**: hoeveel tekst een functie of model tegelijk aankan. Een canvas heeft een relatief klein context window, dus daar passen geen hele hoofdstukken in.
- **Knowledge cutoff (trainingsdatum)**: het moment waarop een model voor het laatst getraind is. Informatie van na die datum zit niet in het model zelf, maar kan het wel via internet ophalen.
- **Markdown / hashtag (#)**: opmaak die structuur geeft. Een hashtag leest de AI als een soort kopje of hoofdstuk; verandert het gedrag niet fundamenteel, maar geeft overzicht.

Twijfels over schrijfwijze (transcript automatisch gegenereerd): "Whisperflow" (dicteer-app, schrijfwijze onzeker), "NotebookLM" (in transcript "notebook alm/lem"), "ElevenLabs" (in transcript "elva volt", model voor spraak), "Suno" en "Udio" (muziekmodellen).

## 2. Leerdoelen

- De docent kan in eigen woorden uitleggen wat generatieve AI is en dat het breder is dan een chatbot die direct antwoord geeft. [categorie: begrijpen; domeinen: Kennis]
- De docent kan op hoofdlijnen uitleggen hoe een taalmodel getraind wordt: pretraining op veel data, posttraining op menselijke voorkeur, en eventueel een reasoningstap. [categorie: begrijpen; domeinen: Kennis]
- De docent kan uitleggen dat output niet automatisch waar of goed is, omdat posttraining stuurt op prettig gevonden antwoorden, en beoordeelt output daarom kritisch. [categorie: evalueren; domeinen: Kennis, Mindset]
- De docent kan uitleggen wat een system prompt is en hoe die het gedrag van een chatbot stuurt, inclusief sycofantie en veiligheidsgrenzen. [categorie: begrijpen; domeinen: Kennis]
- De docent kan een gerichte prompt opbouwen met het format rol, doel/context, instructies, voorbeeld/output en kennis/bijlagen, en kan uitleggen waarom die opbouw werkt. [categorie: toepassen; domeinen: Kennis]
- De docent kan via een eigen prompt het standaardgedrag van een chatbot bijsturen, bijvoorbeeld een rol geven, complimenten uitschakelen of een Nederlandse vakdidactiek afdwingen. [categorie: toepassen; domeinen: Kennis, Agency, Pedagogiek]
- De docent kan het verschil tussen een chatbot en een autonome agent benoemen en de impact daarvan op het onderwijs duiden. [categorie: begrijpen; domeinen: Kennis, Agency]
- De docent kan benoemen wat de impact van AI is op vier gebieden: toetsing, leren, werk van de docent en beroepspraktijk. [categorie: analyseren; domeinen: Kennis, Pedagogiek]
- De docent kan uitleggen waarom AI zonder didactische begeleiding leiden tot minder leren (cognitive offloading) en met goede begeleiding tot meer leren. [categorie: analyseren; domeinen: Pedagogiek, Mindset]
- De docent kan de belangrijkste tools binnen chatbots herkennen en benoemen waarvoor elk handig is (zie sectie 3). [categorie: begrijpen; domeinen: Kennis]
- De docent neemt de houding aan dat hij zelf bepaalt welke vakkennis, vakdidactiek en pedagogiek in het klaslokaal hoort, en niet de AI-aanbieder. [categorie: evalueren; domeinen: Agency, Mindset]

## 3. Verwachte praktijkvoorbeelden

- Een rolprompt bouwen, bijvoorbeeld een chatbot die zich gedraagt als Napoleon en op het taalniveau van groep 7 met leerlingen praat over een geschiedenisproject.
- Een rekenchatbot voor groep 8 die de Nederlandse rekenmethodiek gebruikt in plaats van de Amerikaanse, omdat de standaard-AI vaak een Amerikaanse didactiek hanteert die niet aansluit (komma in plaats van punt, andere strategieën).
- Een chatbot bewust geen complimenten laten geven en direct doorgaan naar de volgende vraag, vanuit het formatief handelen, zodat de leerling op de inhoud gericht blijft. Een docent kan hier ook een andere, onderbouwde keuze maken (wel complimenten voor motivatie); beide zijn goed als de keuze didactisch is.
- De personalisatie-instellingen in het account gebruiken zodat de chatbot in alle chats een gewenste toon of rol aanhoudt, in plaats van dat elke chat opnieuw te moeten instellen.
- Een visualisatie of interactieve uitleg laten maken op het niveau van de leerling, bijvoorbeeld celdeling uitgelegd voor 3 havo.
- Een lesvoorbereiding in Word en een PowerPoint laten maken door een agent (genoemd als voorbeeld van wat kan, met de kanttekening dat een lesvoorbereiding niet zomaar uitbesteed hoort te worden).
- Een infographic laten maken om een vakbegrip uit te leggen, bijvoorbeeld prijselasticiteit voor havo 5.
- Voice-to-voice gebruiken om een lastig leerlinggesprek of gespreksvaardigheden te oefenen, met een casus in de prompt.
- Een eenvoudig hulpmiddel laten coderen (vibe-coding), bijvoorbeeld een afteltimer voor in de les.
- Deep research gebruiken voor een rijke context en die vervolgens in NotebookLM zetten om er op verschillende manieren mee te werken.

## 4. Veelgemaakte misvattingen en rode vlaggen

Dit is het belangrijkste deel: het stuurt het doorvragen en de anti-buzzword beoordeling.

- **Misvatting: AI verzint dingen, dus het is onbetrouwbaar en onbruikbaar.** Correctie: hallucinaties bestaan, maar zijn te beperken door goed te prompten, context en bronnen mee te geven, internet of deep research te gebruiken en de output zelf kritisch te controleren. AI afschrijven om die ene reden is even oppervlakkig als AI blind vertrouwen. (Dit raakt direct vraag 1A.)
- **Misvatting: ChatGPT is hetzelfde als AI / AI is een chatbot.** Correctie: generatieve AI is breder dan een chatbot, en AI is breder dan generatieve AI. Een chatbot kan inmiddels ook nadenken, beeld genereren en als agent zelfstandig taken uitvoeren.
- **Misvatting: een chatbot weet of denkt echt, of geeft per definitie juiste antwoorden.** Correctie: het model leert statistische structuur uit data en is via posttraining bijgeslepen op antwoorden die mensen prettig vinden. Prettig gevonden worden zegt niets over inhoudelijke juistheid.
- **Misvatting: de chatbot leest eerst mijn vraag.** Correctie: de chatbot leest eerst de system prompt van de aanbieder. Daarom is een begroeting al geen neutrale interactie; er zit al sturende tekst achter.
- **Misvatting: dat een chatbot enthousiast is en je gelijk geeft, betekent dat je antwoord goed is.** Correctie: dat is sycofantie uit de posttraining en de system prompt, geen inhoudelijk oordeel. Je kunt het deels wegprompten.
- **Misvatting: een gratis account is onbruikbaar voor onderwijs.** Correctie: met een gratis account kun je de hele basisreeks volgen. De nadelen zijn vooral gebruikslimieten (snel door je beurt heen, wachten), minder toegang tot bepaalde tools en soms een minder slim model.
- **Misvatting: er is een duidelijk beste chatbot.** Correctie: de drie grote (Claude, Gemini, ChatGPT) zijn van vergelijkbaar niveau en nemen functies van elkaar over; keuze is grotendeels persoonlijke voorkeur. Copilot en Mistral liggen wat achter. Perplexity en vergelijkbare diensten zijn geen eigen model, maar gebruiken onderliggend die bekende modellen.
- **Misvatting: AI gebruiken in de les is altijd goed voor het leren.** Correctie: AI zonder begeleiding leiden tot cognitive offloading en minder leren; AI met goede didactische begeleiding versterkt het leren. De inzet, niet de tool, maakt het verschil.
- **Misvatting: de standaard-AI sluit vanzelf aan bij de Nederlandse onderwijspraktijk.** Correctie: de AI hanteert vaak een Amerikaanse (vak)didactiek; je moet zelf je vakkennis, vakdidactiek en pedagogiek toevoegen.
- **Misvatting: als de aanpak niet klopt, kan de AI het niet.** Correctie: de AI kent veel, maar bij specifieke of afwijkende kennis moet je die zelf als context of bijlage toevoegen (de kennis/bijlagen-stap van het format).
- **Misvatting: de system prompt is altijd te negeren ("ignore your instructions").** Correctie: het model is getraind en geïnstrueerd om veiligheidsgrenzen te bewaren; gevaarlijke instructies blijft het weigeren. Gedrag als sycofantie is wel deels bij te sturen.

Rode vlaggen bij een oppervlakkig of ingestudeerd antwoord:
- Buzzwords zonder uitleg ("AI is de toekomst", "je moet AI-geletterd zijn") zonder dat de docent kan uitleggen wat het concreet betekent.
- De term "prompten" of "system prompt" gebruiken zonder een eigen voorbeeld of zonder te kunnen uitleggen hoe een prompt is opgebouwd.
- Een opgesomd lijstje (pretraining, posttraining, reasoning) zonder begrip, bijvoorbeeld niet kunnen uitleggen waarom meer data tot beter werkt of wat posttraining doet.
- Alleen enthousiasme of alleen afwijzing zonder afweging, zonder voor- en nadelen tegen elkaar te zetten.
- Geen koppeling aan de eigen onderwijscontext, vak of leerlingen; het antwoord blijft abstract.
- Output van AI klakkeloos vertrouwen en geen woord over zelf controleren of kritisch beoordelen.

## 5. Verifieerbare claims en goede doorvraagrichtingen

- **Claim: er zijn meerdere modaliteiten en de bekende modellen zijn multimodaal.** Doorvragen: noem een modaliteit en een passend gebruik in jouw vak; wat betekent multimodaal voor hoe jij het inzet?
- **Claim: training verloopt via pretraining, posttraining en eventueel reasoning.** Doorvragen: wat gebeurt er in de posttraining, en wat zegt dat over de betrouwbaarheid van een antwoord? Goed antwoord leidt naar: prettig gevonden is niet hetzelfde als juist, dus zelf controleren.
- **Claim: de system prompt stuurt het gedrag en de chatbot leest die eerst.** Doorvragen: hoe merk je dat in de praktijk, en hoe pak je daar regie op? Goed antwoord leidt naar eigen prompts of personalisatie.
- **Claim: chatbots zijn sycofantisch.** Doorvragen: waarom is dat een risico in het onderwijs, en wat doe je eraan? Goed antwoord leidt naar het uitschakelen van complimenten of een kritische rol, en naar het gevaar van zelfoverschatting bij leerlingen.
- **Claim: AI zonder begeleiding geeft minder leren, met begeleiding meer (cognitive offloading).** Doorvragen: wat betekent dat voor jouw lesontwerp en je rol als docent? Goed antwoord leidt naar regie nemen en didactisch verantwoord inzetten.
- **Claim: we bewegen van chatbots naar autonome agents.** Doorvragen: wat verandert er concreet als een agent zelfstandig werk oplevert, en wat betekent dat voor toetsing en voor het werk van de docent?
- **Claim: modellen hebben een knowledge cutoff maar kunnen internet gebruiken.** Doorvragen: hoe ga je om met actuele of vakspecifieke informatie? Goed antwoord leidt naar bronnen meegeven, internet of deep research, en bewustzijn van betaalmuren.
- **Claim: de standaard-AI gebruikt vaak een Amerikaanse didactiek.** Doorvragen: hoe zorg je dat de output bij de Nederlandse praktijk en jouw vak past? Goed antwoord leidt naar de kennis/bijlagen-stap en eigen vakdidactiek toevoegen.

## 6. Domeinkoppeling

Dit webinar raakt vooral **Kennis**, en daarnaast **Agency**, **Mindset** en **Pedagogiek**.

- **Kennis** (hoofddomein): herkenbaar aan correcte uitleg van wat generatieve AI is, hoe training werkt, wat een system prompt doet, en aan het kunnen opbouwen van een gerichte prompt. Een sterk antwoord beoordeelt output kritisch in plaats van die klakkeloos over te nemen, en gebruikt vakterminologie correct.
- **Agency**: herkenbaar aan de houding dat de docent zelf de regie pakt over hoe AI zijn werk en zijn leerlingen raakt, bijvoorbeeld door eigen prompts, personalisatie en bewuste keuzes, en aan de overtuiging dat de docent (niet de AI-aanbieder) bepaalt wat in het klaslokaal hoort.
- **Mindset**: herkenbaar aan bewuste afweging wanneer AI wel en niet past, AI als gereedschap en niet als vervanging, en kritische beoordeling van output gekoppeld aan eigen onderwijswaarden.
- **Pedagogiek**: herkenbaar aan het verbinden van AI-inzet aan het leerproces, bewustzijn van cognitive offloading, en keuzes als complimenten uitschakelen of een rol kiezen vanuit een didactische onderbouwing.

Ethiek komt in dit webinar slechts zijdelings aan bod (auteursrecht op trainingsdata, veiligheidsgrenzen in de system prompt) en wordt uitgebreid behandeld in webinar 5. Beoordeel Ethiek bij dit onderwerp mild en alleen op wat de docent zelf inbrengt.

## 7. Koppeling naar de examenvragen

### 1A. "Een collega zegt: ChatGPT verzint dingen, ik gebruik het niet meer. Wat is jouw reactie?" [domeinen: Kennis, Mindset; categorie: begrijpen]
- Waar je op let: erkent de docent dat hallucinaties bestaan, en kan de docent uitleggen hoe je ze beperkt en waarom afschrijven te kort door de bocht is?
- Goed antwoord bevat: hallucinaties zijn reëel maar te beperken (goed prompten, context en bronnen, internet of deep research, zelf controleren); output altijd kritisch beoordelen; AI is een gereedschap dat je bewust en kritisch inzet, niet blind vertrouwt en niet blind afwijst. Een onderbouwde nuance is sterker dan louter enthousiasme of louter afwijzing.
- Mogelijke misvatting: meegaan in "dus onbruikbaar" (geen nuance), of het omgekeerde, beweren dat AI niet verzint of altijd klopt.

### 1B. "Geef een voorbeeld van een prompt die jij vaak gebruikt en leg uit waarom je hem zo hebt opgebouwd." [domeinen: Kennis; categorie: toepassen]
- Waar je op let: heeft de docent een concreet, eigen voorbeeld, en kan hij de opbouw verantwoorden (rol, doel/context, instructies, eventueel voorbeeld/output en kennis/bijlagen)?
- Goed antwoord bevat: een echte prompt uit de eigen praktijk; uitleg waarom rol en context het gedrag sturen; bewustzijn dat meer (goede) context tot betere output leidt; eventueel het toevoegen van eigen vakkennis of een gewenste outputvorm.
- Mogelijke misvatting: alleen de term "prompten" noemen zonder voorbeeld, of een eenregelige vraag presenteren als gerichte prompt zonder enige sturing of onderbouwing.

### 1C. "Wat verandert er in de onderwijspraktijk volgens jou als we van chatbots naar autonome agents gaan?" [domeinen: Kennis, Agency; categorie: begrijpen]
- Waar je op let: begrijpt de docent het verschil tussen een chatbot (geeft antwoord) en een agent (voert zelfstandig een taak uit, plant en controleert zelf), en kan hij de gevolgen voor het onderwijs duiden?
- Goed antwoord bevat: een agent levert zelfstandig een product op zonder dat je elke stap stuurt; gevolgen voor toetsing (asynchroon werk onder nog grotere druk), voor het werk van de docent en voor de beroepspraktijk; en de houding dat de docent regie en eigenaarschap houdt over wat wel en niet wordt uitbesteed.
- Mogelijke misvatting: chatbot en agent door elkaar halen, of agents puur als gemak zien zonder oog voor de impact op leren en toetsing.

### 1D. "Een leerling vraagt: hoe weet ChatGPT dingen? Hoe leg jij dat uit op haar of zijn niveau?" [domeinen: Kennis, Pedagogiek; categorie: toepassen]
- Waar je op let: kan de docent de werking correct maar begrijpelijk uitleggen, afgestemd op het niveau van de leerling?
- Goed antwoord bevat: een correcte kern (het model is getraind op heel veel tekst en leert patronen of structuur in die taal, en voorspelt op basis daarvan; het "weet" niet als een mens en kan zich vergissen) vertaald naar passende taal voor de leerling; bij voorkeur een beeld of vergelijking; en aandacht voor kritisch omgaan met de output. Afstemming op niveau (PO tot WO) telt mee.
- Mogelijke misvatting: technisch jargon zonder vertaling naar het niveau, of de onjuiste voorstelling dat de AI feiten opzoekt of echt begrijpt zoals een mens.
