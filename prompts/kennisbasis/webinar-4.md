# Kennisbasis Webinar 4: AI om het leren te verrijken (Mollick-rollen)

> Bronnen: transcripten webinar 7 en 8 (gevorderd cohort, inhoudelijk gelijk aan basiswebinar 4) en webinar 7 slides. Niveau: basis (gekalibreerd). Ground truth voor de examinator (Lieke) en de beoordelaar.

Webinar 7 (Mollick deel 1) is gegeven door Marcel Mutsaarts en Tom Naberink, een praktische tool-demo over vier rollen die AI kan spelen bij het leren. Webinar 8 (leren met AI deel 2) is gegeven door Barend Last, een onderwijskundige sessie over de overige twee rollen (mentor en coach) en over zelfregulerend leren. De centrale boodschap van beide: AI kan leiden tot leerverarming OF leerverrijking, en de docent houdt daar de regie over. Het verschil zit in HOE je AI inzet en hoe goed je het didactisch inbedt.

Belangrijke kalibratie: dit is gevorderd-materiaal. Voor het basisexamen geldt dat een docent de KERN van Mollicks rollen en NotebookLM moet kunnen herkennen, kiezen en toepassen op het eigen vak. De diepere onderwijskundige onderbouwing (Zimmerman, zelfregulerend leren, co-regulatie, de onderzoeksreviews) hoort eerder bij gevorderd dan bij basis en wordt hieronder expliciet zo gemarkeerd. Verwacht die diepgang dus niet van een basis-docent, maar herken het als een plus.

## 1. Kernbegrippen en correcte definities

**Mollicks rollen van AI bij het leren.** Ethan Mollick (in het transcript fonetisch als "Ive molek") beschrijft in een paper zeven manieren waarop AI in het onderwijs kan worden ingezet. De Nederlandse vertaling in het webinar noemt er zeven; vier daarvan zijn in webinar 7 uitgewerkt, twee (mentor en coach) in webinar 8, en een (hulpmiddel) wordt bewust kort gehouden. De standaardstand van AI, als je niets stuurt, is die van tutor: hij legt uit en doet dingen voor je.

De rollen, met een correcte beknopte definitie:

- **Tutor.** AI legt uit, doet voor, geeft feedback, checkt begrip. De AI als persoonlijke docent die 24 uur per dag beschikbaar is en de stof op je eigen tempo uitlegt. Zeker aan het begin van een leerproces, als je iets nog niet begrijpt, heel zinvol. Voorbeelden uit het webinar: de AI-docenten op AI voor leerlingen (zoals "Aisha" voor geschiedenis havo), AI-tutor Tom gekoppeld aan een specifieke videoles, en NotebookLM.
- **Socratische bot (Socratisch).** In plaats van direct antwoord te geven stelt deze AI wedervragen, zodat de leerling of student zelf tot inzicht of de oplossing komt. Het doel is niet informatie geven, maar kritisch denken stimuleren. De leerling wordt in de denkpositie gezet en moet zelf de antwoorden geven. Krachtig, maar werkt alleen op het juiste moment (zie sectie 4). Tutor en Socratisch horen vaak bij elkaar en werken het best in een cirkel: vraag stellen, en bij een fout antwoord alsnog uitleg geven.
- **Simulator.** AI bootst een situatie, persoon of proces na zodat je een vaardigheid kunt oefenen. Twee soorten kwamen langs: (a) gesprekssimulaties, bijvoorbeeld een lastige leerling (Iris, 13 jaar, in weerstand met iets thuis), een klantgesprek in de retail, een oudergesprek, of een patientgesprek bij verpleegkunde, vaak met spraakmodus (advanced voice mode); en (b) visuele simulaties die laten zien wat er gebeurt, bijvoorbeeld een bloedtransfusiesimulator bij biologie of een limonadeverkoop-spel voor groep 8. Geeft een hele andere dynamiek: je oefent actief in plaats van te consumeren.
- **Procesbegeleider.** AI begeleidt het PROCES (de stappen), de leerling of student levert zelf de INHOUD. De AI bewaakt waar je bent in een stappenplan, zodat je je hoofd kunt vrijhouden voor de inhoud in plaats van voor de vraag "welke stap moet ik nu nemen". Wordt nog weinig gebruikt, maar Marcel ziet er veel kracht in. Voorbeeld: een reflectie met de STARR-methodiek, waarbij de AI je door de stappen loodst, mild blijft maar doorvraagt als antwoorden te vaag zijn, en pas aan het eind een verslag schrijft.
- **Mentor.** [eerder gevorderd dan basis] Iemand die begeleidt vanuit ervaring, richting en advies geeft, als rolmodel fungeert. Een langer lopende relatie gericht op persoonlijke en professionele ontwikkeling. Kernvragen: wie ben ik, waar ga ik naartoe, wat motiveert mij. Volgens webinar 8 is dit de RISICOVOLSTE rol voor AI, omdat het relationele diepgang, echte empathie en vertrouwen mist. AI neigt naar standaardadvies zonder nuance, kan bias bevatten en kan niet nagaan of een advies geholpen heeft.
- **Coach.** [eerder gevorderd dan basis] Iemand die op het PROCES zit, vragen stelt, reflectie activeert, feedback geeft en de ander helpt zelf antwoorden te vinden. Minder hierarchisch dan een mentor, procesgericht, gericht op zelfinzicht en zelfregulatie. Kernvragen: wat moet ik doen en hoe pak ik dat aan? Een coach weet het antwoord niet (anders dan een mentor). Dit is de rol waar AI het meest veelbelovend is, mits goed geprompt en ingebed. De woordherkomst die Barend noemt: "koets" als instrument om ergens te komen; een goede coach geeft de leerling instrumenten om doelen te bereiken.
- **Hulpmiddel.** Het multitool, het Zwitsers zakmes waar leerlingen en studenten vanzelf naar grijpen: schrijf dit voor me, vat samen, haal referenties erbij. Wordt in het webinar bewust kort gehouden omdat het al overal tussendoor terugkomt.

**NotebookLM.** Een gratis AI-tool van Google die ALTIJD vanuit bronnen werkt (geuploade pdf, tekst, website, YouTube-video, mp3). Dat is het grote verschil met ChatGPT, Gemini of Copilot, die ook zonder bron werken. Doordat NotebookLM gebonden is aan je bronnen, hallucineert het veel minder en verwijst het naar de passages waar het antwoord vandaan komt. Het kan van een bron veel verschillende vormen maken: een chat over de bron, een podcast, een diapresentatie, een video-overzicht, een mindmap, flashcards, een quiz en een infographic. Daarmee kun je dezelfde leerstof op veel modaliteiten tot je nemen. Let op: NotebookLM is gratis maar traint wel op je data, dus geen privacygevoelige of vertrouwelijke informatie uploaden. De diapresentatie komt eruit als pdf (plaatjes), niet als een bewerkbare PowerPoint. (Schrijfwijze in transcript wisselt: "notebook Lm", "noordboekelem"; de juiste naam is NotebookLM.)

**Custom chatbot (GPT / Gem).** Een chatbot die je zelf bouwt met eigen instructies en eigen kennis aan de achterkant. Binnen ChatGPT heet dit een GPT, binnen Gemini een Gem. Je geeft rol, context, instructies, eventueel een outputvorm en kennis mee (bijvoorbeeld de syllabus van Examenblad). Hierdoor praat je niet meer met een algemene AI maar met een afgebakende chatbot die precies weet waar hij voor is.

**Leerverrijking versus leerverarming.** AI kan het leren versterken of ondermijnen. Onderzoek (in het transcript aangehaald, gaat over cognitive offloading bij het schrijven van een betoog) laat zien: zet je AI in ZONDER uitleg over verantwoord gebruik, dan besteed je veel denken uit, wordt het werk slechter, leer je minder en ben je minder betrokken. Krijg je WEL uitleg over verantwoord gebruik, dan leer je meer, schrijf je een beter betoog en ben je actiever betrokken. Dat is de kern: AI maakt je lui als je niets doet, en verrijkt als je het bewust en begeleid inzet.

**Zelfregulerend leren.** [eerder gevorderd dan basis] Het vermogen van een leerling of student om verantwoordelijkheid te nemen over het eigen leren en dat te sturen. In webinar 8 uitgewerkt via vijf bouwstenen (metacognitie, motivatie, leerstrategieen/gedrag, bronnen benutten, emotie) en het drie-fasenmodel van Barry Zimmerman: voorbereidingsfase (doel, strategie, planning), uitvoeringsfase (taak uitvoeren en monitoren), reflectiefase (terugblikken en meenemen naar de volgende keer). Verwante term: **co-regulatie**, het idee dat sturing nooit alleen van de leerling komt, maar in voortdurende wisselwerking met docent en medeleerlingen. AI kan een co-regulator zijn, maar nooit de docent vervangen.

## 2. Leerdoelen

Gekalibreerd op basisniveau:

- De docent kan de vier centrale Mollick-rollen (tutor of Socratisch, simulator, hulpmiddel, procesbegeleider) herkennen en in eigen woorden uitleggen. [categorie: begrijpen; domeinen: Kennis, Pedagogiek]
- De docent kan een passende rol kiezen voor het eigen vak en uitleggen hoe en waarom hij die zou inzetten. [categorie: toepassen; domeinen: Pedagogiek, Kennis]
- De docent kan NotebookLM inzetten in de eigen lespraktijk en benoemt dat het vanuit bronnen werkt en daardoor minder hallucineert. [categorie: toepassen; domeinen: Pedagogiek, Kennis]
- De docent kan het didactische verschil tussen een tutorbot (geeft uitleg) en een Socratische bot (stelt wedervragen) analyseren en uitleggen wanneer elk passend is. [categorie: analyseren; domeinen: Pedagogiek, Kennis]
- De docent kan beoordelen wat wel en niet wenselijk is als een leerling AI gebruikt om te leren, bijvoorbeeld een tutorbot voor toetsvoorbereiding. [categorie: evalueren; domeinen: Pedagogiek, Ethiek]
- De docent kan afwegen wanneer AI het leerproces versterkt en wanneer het denken wordt uitbesteed dat je juist wilde oefenen. [categorie: evalueren; domeinen: Pedagogiek, Mindset]
- [eerder gevorderd dan basis] De docent kan uitleggen waarom de mentorrol risicovol is voor AI en de coachrol veelbelovender, en dat AI co-reguleert maar de docent niet vervangt. [categorie: begrijpen; domeinen: Pedagogiek, Ethiek, Agency]

## 3. Verwachte praktijkvoorbeelden

Een sterke docent op basisniveau kan voorbeelden in deze geest noemen:

- **Tutor:** een AI-docent of custom chatbot voor het eigen vak die uitleg geeft, oefenvragen stelt, ezelsbruggetjes bedenkt en stap voor stap een redenering opbouwt. Liefst afgebakend per thema, blok of les in plaats van voor het hele vak, omdat een te brede chatbot oppervlakkig blijft.
- **NotebookLM:** een hoofdstuk, lesopname of bronnenset uploaden en er een podcast, infographic, quiz of mindmap van laten maken zodat leerlingen de stof op verschillende manieren tot zich nemen. Of een YouTube-video laten transcriberen.
- **Socratische bot:** een chatbot die studenten die de stof al gelezen hebben helpt verwerken en testen of ze het echt weten, door vragen terug te stellen in plaats van uit te leggen.
- **Procesbegeleider:** een chatbot die een leerling door een reflectie (STARR), een marketingplan, een Business Model Canvas, een onderzoeksvraag of een intervisie loodst, waarbij de leerling zelf de inhoud levert en de AI alleen het proces bewaakt en doorvraagt bij vage antwoorden.
- **Simulator:** een gesprekssimulatie met een lastige leerling, een klant, een ouder of een patient (eventueel met spraakmodus om een vaardigheid als luisteren, samenvatten en doorvragen te oefenen), of een visuele simulatie zoals een bloedtransfusie of een ondernemingsspel.
- **Toetsvoorbereiding:** AI als tutor en NotebookLM inzetten om je voor te bereiden op een examen, mits je het gebruikt om te oefenen en begrip te checken, niet om antwoorden klakkeloos over te nemen.
- [eerder gevorderd dan basis] **Coach:** een planner-chatbot of reflectiecoach-app die de leerling door de voorbereidings- of reflectiefase loodst, waarvan de uitdraai daarna in een mentor- of coachgesprek wordt besproken. Een podcast van NotebookLM als voorbereiding op een les (flipped classroom), zodat je in de les samen de tekst kunt annoteren.

## 4. Veelgemaakte misvattingen en rode vlaggen

Dit is het sturende deel voor doorvragen en voor de anti-buzzword beoordeling.

**Misvatting: een Socratische bot (altijd wedervragen) is per definitie beter dan een tutor (uitleg).** Correctie: in de praktijk werkt een pure Socratische bot vaak juist NIET. Studenten die de stof nog niet kenden of niet hadden voorbereid vonden de bot zwaar irritant en gingen terug naar de gewone chatbot, die wel gewoon antwoord geeft. Studenten die WEL hadden voorbereid werden er blij van. Er is dus een moment in het leerproces waarop uitleg (tutor) nodig is en een moment waarop bevragen (Socratisch) zinvol is. Het Estland-voorbeeld (een speciale schoolversie van ChatGPT die constant vragen stelt) illustreert dit: een leerling gaf toe thuis toch de gewone versie te gebruiken, omdat die sneller antwoord geeft. De beste oplossing is vaak een combinatie, een cirkel: eerst zelf laten denken, en bij een fout alsnog uitleg geven (zoals de quiz in NotebookLM, waar je na een fout antwoord uitleg krijgt en kunt doorklikken naar de chatbot).

**Misvatting: AI als tutor is altijd goed, want het legt alles uit.** Correctie: het grootste nadeel van een tutor is dat je luier wordt, minder diep nadenkt en meer consumeert. Leren is niet altijd uitleg krijgen; je krijgt soms juist dieper inzicht door zelf moeite te doen om iets te bedenken. De weg naar "tutor, leg het even uit" is heel kort. Andere genoemde nadelen: niet wederkerig, minder maatwerk, de docent heeft geen zicht op wat er gezegd wordt en weet dus niet wat leerlingen wel of niet begrijpen, en de chatbot is geneigd te pleasen (sycofant). Een sterk antwoord erkent dit en koppelt de rol aan het juiste moment in het leerproces.

**Misvatting: een tutorbot voor toetsvoorbereiding (vraag 4B) is gewoon goed of gewoon slecht.** Correctie: het hangt af van HOE de leerling hem gebruikt. Wel wenselijk: oefenen met examenvragen, begrip checken, stof op een andere manier uitgelegd krijgen, gepersonaliseerde feedback (die het officiele Cito-antwoordmodel bijvoorbeeld niet geeft). Niet wenselijk: de bot het denkwerk laten overnemen, antwoorden klakkeloos overnemen, of de bot als orakel gebruiken zonder zelf na te denken. Risico's die meespelen: de tutor pleast en bevestigt, kan hallucineren of bias bevatten, en de docent heeft geen zicht op wat er gebeurd is. Een sterk antwoord weegt het leerdoel mee: wordt het leren versterkt of vervangen?

**Misvatting: de demo's nabouwen is het doel.** Correctie: Marcel zegt expliciet dat hij hoopt dat docenten NIET de getoonde dingen nabouwen, maar dat de rollen en voorbeelden inspiratie geven om minstens een ding in de eigen context te proberen. Het gaat om het denkkader (welke rol past bij welk leerdoel), niet om de specifieke tool.

**Misvatting: AI kan de mentor- of coachrol gewoon overnemen.** [eerder gevorderd dan basis] Correctie: de mentorrol is juist risicovol voor AI, omdat empathie, vertrouwen en relationele diepgang ontbreken en AI naar standaardadvies en bias neigt. De coachrol is veelbelovender, maar werkt alleen mits goed geprompt en ingebed, en altijd MET een docent of medeleerling erbij die het aanstuurt. Onderzoek liet zien dat AI weinig werkt voor motivatie en emotionele begeleiding (studenten vertrouwen de aanmoediging niet en vinden het onnatuurlijk), maar wel voor cognitieve en metacognitieve taken zoals plannen, voortgang inzichtelijk maken en reflectie. AI is een co-regulator, geen vervanger van de docent.

**Misvatting: als je een coachende rol pakt, mag je geen instructie meer geven.** [eerder gevorderd dan basis] Correctie: het tegendeel. Een goed college of directe uitleg blijft prima; het gaat erom WANNEER je wat inzet, wat eraan voorafgaat en wat erna komt.

**Misvatting: je gooit een algemene AI los in het leerproces en dat werkt vanzelf.** Correctie: dan schiet je blind, je weet niet of het raak is. De crux van beide webinars: een algemene AI vervalt in de "didactische bias", de meest gemiddelde, oppervlakkige uitwerking (klassikaal, docentgestuurd, feedback op de taak en niet op het proces). Pas als je goed prompt en didactisch inbedt (afbakenen, kennis meegeven, koppelen aan een opdracht en een gesprek) wordt AI een hefboom. Onderscheid: algemene AI versus educatieve, doelbewust ingebedde AI.

**Misvatting: deze tools brengen privacyrisico's mee.** Belangrijke nuance: een app die met AI is GEBOUWD maar zelf geen AI-integratie meer bevat (bijvoorbeeld een planner die op een vaste database draait en lokaal in de browser werkt) heeft geen privacyprobleem. NotebookLM daarentegen traint wel op je data, dus daar geen vertrouwelijke informatie in. Een sterk antwoord maakt dit onderscheid in plaats van alles over een kam te scheren.

**Rode vlaggen voor een oppervlakkig of ingestudeerd antwoord:**
- Somt de rollen op als rijtje zonder ze aan het eigen vak of een concreet leerdoel te koppelen.
- Zegt "Socratisch is beter dan tutor" (of omgekeerd) als absoluut feit, zonder het moment in het leerproces te benoemen.
- Verwart tutor en Socratisch, of beschrijft een procesbegeleider als iemand die de inhoud levert (dat doet de leerling).
- Noemt NotebookLM zonder te weten dat het vanuit bronnen werkt, of denkt dat het hetzelfde is als ChatGPT.
- Behandelt AI als tutor of als orakel als onverdeeld positief, zonder het risico van uitbesteed denken of pleasen te benoemen.
- Bij vraag 4B: een zwart-wit oordeel ("mag wel" of "mag niet") zonder af te wegen of het leren wordt versterkt of vervangen.
- Buzzwords zonder inhoud: "gepersonaliseerd leren", "AI is de toekomst", "24/7 beschikbaar", zonder uit te leggen wat de docent concreet anders doet.
- Geen voorbeeld uit het eigen vak of de eigen onderwijscontext.
- Denkt dat de docent overbodig wordt; mist dat AI co-reguleert en de docent de regie en de menselijke kerntaken (motivatie, relatie, duiding) houdt.

## 5. Verifieerbare claims en goede doorvraagrichtingen

- *Claim:* AI kan leiden tot leerverarming of leerverrijking, het verschil zit in begeleiding (cognitive offloading-onderzoek: zonder uitleg slechter en minder betrokken, met uitleg beter en actiever). *Doorvragen:* hoe zorg jij dat jouw leerlingen AI verrijkend gebruiken en niet hun denken uitbesteden?
- *Claim:* een pure Socratische bot werkt in de praktijk vaak niet (leerlingen wijken uit naar de gewone chatbot, Estland-voorbeeld). *Doorvragen:* op welk moment in het leerproces zet jij bevragen in, en wanneer juist uitleg? Stuur richting de combinatie tutor plus Socratisch.
- *Claim:* NotebookLM werkt vanuit bronnen en hallucineert daardoor minder. *Doorvragen:* welke bronnen zou jij uploaden, en waarom is dat betrouwbaarder dan een open chatbot? Stuur richting bronnen, verificatie en modaliteiten (podcast, quiz, infographic).
- *Claim:* een procesbegeleider laat de leerling de inhoud leveren en bewaakt alleen het proces. *Doorvragen:* welk proces of stappenplan uit jouw vak zou je willen laten begeleiden, en hoe voorkom je dat de AI de inhoud voorzegt?
- *Claim:* AI-tutoren zijn meer dan 100.000 keer gebruikt, maar de algemene AI-docenten zijn juist te breed en daardoor zwak; afgebakende chatbots per les of thema zijn krachtiger. *Doorvragen:* zou jij voor je hele vak een chatbot bouwen of per thema, en waarom?
- *Claim:* een simulator geeft een andere dynamiek omdat je een vaardigheid actief oefent in plaats van consumeert. *Doorvragen:* welke vaardigheid of welk gesprek uit jouw vak zou je willen laten oefenen via simulatie?
- [eerder gevorderd dan basis] *Claim:* AI werkt voor cognitieve en metacognitieve coachtaken (plannen, reflectie) maar weinig voor de mentorrol (motivatie, emotie). *Doorvragen:* welke begeleiding wil je echt zelf blijven doen, en wat zou je aan AI durven uitbesteden?
- [eerder gevorderd dan basis] *Claim:* AI co-reguleert maar vervangt de docent niet; zonder kaders doen leerlingen maar wat, en onderzoek toont dat reflectie (zeker samen) het verschil maakt. *Doorvragen:* hoe bed jij AI-gebruik in zodat er ook echt gesprek en reflectie omheen zit?

## 6. Domeinkoppeling

Dit webinar raakt vooral **Pedagogiek** (wanneer AI het leerproces versterkt, leerlingen begeleiden bij bewust gebruik, de juiste rol op het juiste moment) en **Kennis** (hoe de tools werken, NotebookLM, custom chatbots, effectief inzetten en output kritisch beoordelen). Daarnaast **Ethiek** (privacy bij NotebookLM, wat wel en niet wenselijk is bij toetsvoorbereiding, pleasen en bias van de tutor), **Mindset** (AI als gereedschap dat het leren verrijkt, niet als vervanging van eigen denken) en **Agency** (de docent en de leerling houden regie, AI co-reguleert maar neemt het niet over).

Waaraan je beheersing herkent in dit onderwerp:
- *Pedagogiek:* de docent kiest een rol die past bij het leerdoel en het moment in het leerproces, en weet wanneer uitleg, bevragen, begeleiden of simuleren passend is.
- *Kennis:* de docent legt uit hoe een rol of tool werkt (bijvoorbeeld dat NotebookLM vanuit bronnen werkt), kan tools vergelijken en beoordeelt output kritisch.
- *Ethiek:* de docent benoemt concreet wat wel en niet wenselijk is (toetsvoorbereiding, privacy bij data, pleasen en bias) in plaats van AI klakkeloos te vertrouwen.
- *Mindset:* de docent ziet AI als verrijking van het leren met behoud van eigen denkwerk, en weegt af wanneer denken juist niet uitbesteed mag worden.
- *Agency:* de docent houdt de regie over hoe AI het leren raakt, en wil dat ook bij leerlingen ontwikkelen (zelf nadenken voordat ze AI gebruiken).

## 7. Koppeling naar de examenvragen

**4A. "Welke van Mollicks rollen (tutor of Socratisch, simulator, hulpmiddel, mentor, coach, procesbegeleider) zou jij in jouw vak inzetten en hoe?"** [Pedagogiek, Kennis; toepassen]
*Waar je op let:* een concrete keuze voor een of twee rollen, gekoppeld aan het eigen vak en aan een leerdoel, met uitleg HOE de docent die zou inzetten. Een sterk antwoord beschrijft de rol correct (bijvoorbeeld: procesbegeleider bewaakt het proces, leerling levert de inhoud) en kiest bewust, niet willekeurig. Bonus: erkennen dat de rol moet passen bij het moment in het leerproces.
*Wat een goed antwoord bevat:* een herkenbare rol, een vakvoorbeeld, en een reden waarom die rol daar versterkend werkt.
*Misvatting die kan opduiken:* rollen door elkaar halen (tutor versus Socratisch, of procesbegeleider als inhoudleverancier), of een rol noemen zonder concrete toepassing.

**4B. "Een leerling gebruikt een tutorbot om zich op een toets voor te bereiden. Wat is hier wel en niet wenselijk aan?"** [Pedagogiek, Ethiek; evalueren]
*Waar je op let:* een afgewogen oordeel met beide kanten. Wel wenselijk: oefenen, begrip checken, andere uitleg, gepersonaliseerde feedback, 24/7 beschikbaar. Niet wenselijk: denkwerk uitbesteden, antwoorden overnemen, de bot als orakel gebruiken, en de risico's dat de tutor pleast, kan hallucineren of bias bevat en dat de docent geen zicht heeft op wat er gebeurt. Het beste antwoord koppelt aan het leerdoel: wordt het leren versterkt of vervangen?
*Wat een goed antwoord bevat:* een tweezijdige afweging plus de onderliggende vraag of de leerling actief leert of passief consumeert.
*Misvatting die kan opduiken:* een zwart-wit oordeel ("prima" of "verboden"), of alleen de voordelen noemen zonder het risico van uitbesteed denken en pleasen.

**4C. "Hoe zou je NotebookLM inzetten in jouw lespraktijk?"** [Pedagogiek, Kennis; toepassen]
*Waar je op let:* een concreet gebruik, gekoppeld aan het eigen vak. Een sterk antwoord laat zien dat de docent weet dat NotebookLM vanuit BRONNEN werkt (en daardoor minder hallucineert en naar passages verwijst) en noemt minstens een van de vormen: chat over de bron, podcast, infographic, quiz, flashcards, mindmap of video-overzicht. Bonus: een didactische inbedding, bijvoorbeeld een podcast als voorbereiding op de les (flipped) of een quiz met directe feedback. Extra sterk: de privacynuance (gratis, maar traint op data, dus geen vertrouwelijke informatie).
*Wat een goed antwoord bevat:* een bron, een gemaakte vorm, en hoe dat het leren van de leerling helpt.
*Misvatting die kan opduiken:* NotebookLM verwarren met een gewone chatbot, niet weten dat het bronnen nodig heeft, of het noemen zonder enige toepassing.

**4D. "Wat is het didactische verschil tussen een tutorbot en een Socratische bot?"** [Pedagogiek, Kennis; analyseren]
*Waar je op let:* een helder onderscheid. Tutor: geeft uitleg, doet voor, beantwoordt vragen, neemt het denkwerk deels over, zinvol als de leerling iets nog niet begrijpt. Socratisch: geeft geen direct antwoord maar stelt wedervragen, zet de leerling zelf aan het denken, zinvol als de leerling de stof al kent en wil verwerken of testen. Een sterk antwoord benoemt dat de keuze afhangt van het moment in het leerproces en dat ze elkaar aanvullen (de cirkel: eerst bevragen, bij een fout alsnog uitleggen).
*Wat een goed antwoord bevat:* het kernverschil (uitleg geven versus laten nadenken via vragen) plus wanneer elk passend is.
*Misvatting die kan opduiken:* denken dat Socratisch altijd beter is, of de twee verwarren; of het verschil puur als techniek beschrijven zonder de didactische bedoeling (wie doet het denkwerk?).
