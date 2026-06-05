# Kennisbasis Webinar 5: Risico's van AI

> Bronnen: transcript webinar 5 en Webinar 5 slides. Niveau: basis. Ground truth voor de examinator (Lieke) en de beoordelaar.

Dit webinar is gegeven door Barend Last (onderwijskundige) en Marcel Mutsaarts. Barend behandelt de eerste helft: misinformatie en hallucinaties, bias en censuur, en cognitive offloading. Marcel behandelt de tweede helft: auteursrecht, privacy en datastromen, en duurzaamheid. De rode draad: AI brengt reele risico's met zich mee, maar bijna elk risico vraagt om nuance in plaats van een zwart-wit oordeel. De afsluitende boodschap is dat je risico's serieus neemt en tegelijk afzet tegen de context, en dat het antwoord niet is om AI uit het onderwijs te weren.

## 1. Kernbegrippen en correcte definities

**Taalmodel als droommachine.** Een taalmodel (het model onder de motorkap van chatbots zoals ChatGPT, Gemini, Copilot) voorspelt statistisch welk woord waarschijnlijk volgt op de vorige woorden. Het is geen bibliothecaris die een boek pakt en informatie voorschotelt, maar voorspelt op basis van patronen in trainingsdata. Daarom is het per definitie ongeschikt als bron van informatie op zichzelf. Wel bruikbaar als medium naar een bron toe, mits je verifieert. De APA (American Psychological Association) staat een AI-systeem dat op een taalmodel werkt niet toe als bron in een onderzoekspaper.

**Temperatuurinstelling.** De instelling die bepaalt of een model woorden met hoge of lage waarschijnlijkheid kiest. Samen met ingebouwde willekeur (zoals een dobbelsteen die niet elke worp hetzelfde uitvalt) zorgt dit ervoor dat je niet alleen een statistische benadering krijgt, maar elke keer een andere. Dat maakt het een onbetrouwbaar rekenmachientje voor taal.

**Hallucineren.** Wanneer een taalmodel plausibel klinkende informatie genereert die feitelijk onjuist is. Door Van Dale uitgeroepen tot woord van het jaar 2025. Belangrijk: er zit geen intentie achter, en het is niet hetzelfde als wat een mens doet bij hallucineren. Houd die betekenissen uit elkaar. Het is geen bug die we kunnen wegpoetsen, maar een eigenschap van systemen die voorspellend werken (zowel mensen als machines). Te verminderen, niet volledig op te lossen.

**Misinformatie versus desinformatie.** Misinformatie is onjuiste informatie zonder kwade opzet (iemand heeft het per ongeluk fout of weet het niet zeker). Desinformatie is moedwillig onjuiste informatie. Een taalmodel heeft geen intentie en kan dus geen desinformatie maken, tenzij een mens het daartoe aanzet. Een taalmodel produceert dus misinformatie.

**Bullshit (Frankfurt).** Term van filosoof Harry Frankfurt (jaren tachtig): iets zeggen waarbij het je niet uitmaakt of het waar is, onverschilligheid tegenover de waarheid. Uit het paper "ChatGPT is bullshit". Onderscheidt zich van liegen, want liegen veronderstelt dat je de waarheid kent en bewust afwijkt. Kanttekening in het webinar: termen als hallucineren en bullshit zijn menselijke eigenschappen die we toedichten aan niet-menselijke systemen, dus gebruik ze met zorg.

**Sycophancy (extreme meegaandheid).** De neiging van een chatbot om de gebruiker overdreven gelijk te geven. Voorbeeld uit het transcript: een gebruiker zegt dat zijn vrouw vindt dat twee plus vijf acht is, waarop het model zijn correcte antwoord (zeven) laat varen. Versterkt het misinformatieprobleem, want het model bevestigt liever dan dat het tegenspreekt. (Transcript schrijft "secofany"; de juiste term is sycophancy.)

**Redeneermodellen versus gewone taalmodellen.** Redeneermodellen lossen complexere vraagstukken op en tonen een soort denkproces ("aan het denken"). Dat is geen echt denken, maar langer rekenen. Recent onderzoek laat zien dat sommige redeneermodellen juist vaker hallucineren dan gewone taalmodellen, en dat een model in zijn redenering bij het juiste antwoord kan komen maar toch een fout eindantwoord geeft.

**Bias.** Vooringenomenheid die vooral uit de trainingsdata komt. Voorbeelden: horloges worden bijna altijd op tien over tien getekend (reclamebeeld in de data), een directeur wordt standaard een oudere man in pak, een arts een man en een verpleger een vrouw. Bias zit ook in taal zelf en in vertalingen (I'm a cleaner wordt vrouwelijk, I'm a strong cleaner wordt mannelijk). Niet volledig te verwijderen, want de wereld en de data zijn niet bias-vrij. Bias is niet alleen een probleem maar soms ook een functie: modellen kunnen patronen blootleggen die mensen niet bewust zien (bijvoorbeeld hypotheses voorspellen in onderzoek).

**Foundation model (bevroren model).** Een model dat eenmalig getraind wordt op data en dan in productie gaat. Het is beperkt tot de data die erin zijn gegaan tot de volgende trainingsrun. Het model zelf verandert niet door jouw prompts; het is bevroren. Het kan wel gekoppeld worden aan externe bronnen zoals internet.

**Censuur.** Opgelegde richtlijnen die bepalen wat een model wel of niet zegt, anders dan bias. Verschilt per model en per maker (een Chinees model zoals DeepSeek geeft een ander antwoord over Taiwan dan een westers model). Soms inconsistent: dezelfde prompt mislukt in het ene gesprek en werkt in het andere.

**Jailbreaking.** Een model zover krijgen dat het iets zegt wat het volgens zijn richtlijnen niet mag, bijvoorbeeld door een verboden recept als rap te laten schrijven.

**Cognitive offloading (cognitieve ontlasting).** Je denken ondersteunen met een extern hulpmiddel. Zo oud als de mensheid (notities maken, je hoofd draaien om makkelijker te lezen, een rekenmachine). Niet zwart-wit. Barend vermijdt bewust het woord "uitbesteding", omdat uitbesteden suggereert dat iemand anders het denkwerk doet, terwijl een AI-model niet kan denken. Het zorgt er alleen voor dat jij sneller bij een eindresultaat komt en zelf minder denkt. De slides splitsen dit in twee hoofdvormen:
- *Beneficial offloading (nuttig):* ontlasten (efficiency, zoals een rekenmachine), verplaatsen (redistribution, zoals AI-feedback op een eerste versie zodat je gerichter herschrijft), en verdiepen (stretch, verder denken vanuit een fundament van eigen kennis).
- *Detrimental offloading (schadelijk):* vermijden (avoidance, het leerproces overslaan, samenvatting in plaats van het boek), overgave (surrender, kritiekloos AI-output overnemen, "cognitive surrender"), en waarden afstaan (value offloading, AI bepaalt niet alleen het antwoord maar ook wat belangrijk is, en wordt een moreel kompas).

**E-bike-metafoor.** AI als e-bike. Je kunt hem gebruiken om met minder inspanning op dezelfde bestemming te komen (minder zelf denken), of juist om verder gelegen bestemmingen te bereiken die anders niet mogelijk waren (je denken oprekken). De metafoor laat zien dat offloading kan ontlasten en kan verrijken, afhankelijk van hoe je het inzet.

**Generatie-effect.** Zelf eerst worstelen met een antwoord levert duurzamer leren op dan passief lezen. Daarom: laat leerlingen eerst zelf denken, dan pas AI raadplegen.

**Auteursrecht in drie lagen.** Marcel behandelt auteursrecht in drie lagen: (1) de trainingsdata (met welke data mag je een model trainen), (2) het gebruikersperspectief (welke data mag jij erin stoppen), en (3) de output (van wie is wat eruit komt).

**Fair use.** Het argument van AI-bedrijven dat trainen op beschermd werk vergelijkbaar is met een mens die veel boeken leest en daaruit iets nieuws schrijft. Juridisch nog niet uitgevochten; loopt via rechtszaken (onder meer de New York Times tegen OpenAI en Google). Belangrijk: of AI auteursrecht schendt is nog maar heel beperkt aangetoond en verschilt per zaak.

**AVG en persoonsgegevens.** Marcel onderscheidt drie categorieen data voor privacy:
- *Privacy-ongevoelig:* leerinhoud, vakvragen, samenvattingen zonder persoonsgegevens. Vrij te gebruiken.
- *Gewone persoonsgegevens (AVG artikel 4):* naam, e-mail, BSN, cijfers. Hiervoor is een grondslag nodig; niet zomaar in een chatbot zetten. Leerlingwerk laten beoordelen door AI bevat bijna per definitie persoonsgegevens, dus eerst anonimiseren.
- *Bijzondere persoonsgegevens:* medische gegevens, religie, etniciteit, geaardheid. Verboden tenzij, dus nooit in AI.

**De reis van je prompt.** Marcels uitleg van wat er met je data gebeurt: je typt iets in, het gaat versleuteld naar een server (bij de grote chatbots vaak in de VS, niet in Europa), het komt in het bevroren taalmodel, en je prompt plus antwoord wordt versleuteld opgeslagen. Bij een gratis account moet je er bijna altijd van uitgaan dat toekomstige modellen op jouw ingevoerde data getraind worden. Het model zelf onthoudt niets tussen gesprekken van verschillende gebruikers; het heeft alleen kortetermijngeheugen (context) binnen jouw eigen gesprek.

**Verwerkersovereenkomst en EDU-accounts.** Een school die leerlingen met een chatbot laat werken, heeft een verwerkersovereenkomst nodig met de aanbieder, anders mag je dat formeel niet van leerlingen vragen. Copilot is populair in onderwijs omdat Microsoft data binnen Europa kan houden. EDU- of zakelijke accounts vormen de veiligste categorie: servers idealiter in Europa en geen training op jouw data.

**Opt-out.** Bij alle vier grote aanbieders kun je in gratis en betaalde accounts aangeven dat ze niet op jouw data trainen, maar dit staat vaak standaard aan en is verstopt. Je moet zelf actie ondernemen. (Een uitzondering blijft dat bedrijven zich het recht voorhouden om in zeer specifieke gevallen, zoals anti-terrorisme, naar data te kijken.)

**Drie pijlers van AI-duurzaamheid.** Marcel behandelt duurzaamheid via stroom, water en grondstoffen:
- *Stroom:* het trainen kost eenmalig veel, maar het gebruik (inference, inferentiekosten) loeit dag en nacht door. Hangt af van modelgrootte en type taak (een video kost veel meer dan tekst, een plaatje zit ertussenin). Reasoning kost meer dan een direct antwoord.
- *Water:* datacenters koelen chips met water. Veel water gaat (warmer) terug het ecosysteem in. Afgezet tegen landbouw, en zelfs tegen golfbanen in de VS, valt het waterverbruik nu nog relatief mee. Hangt sterk af van waar het datacenter staat.
- *Grondstoffen:* zelden genoemd, maar belangrijk. Mijnbouw voor zeldzame metalen verwoest grondgebied (met name in Afrika), de productie van chips veroorzaakt CO2-uitstoot, en versleten chips (levensduur ongeveer vier tot vijf jaar) leveren grote bergen e-waste op.

**Jevons-paradox.** Wanneer iets goedkoper of efficienter wordt om te draaien, neemt het gebruik automatisch toe. Hardware en software worden snel efficienter (groene stroom, zuiniger chips en modellen), maar het toenemende gebruik kan die winst weer opheffen. De open vraag: wint de efficientie of de groei in gebruik?

## 2. Leerdoelen

- De docent kan uitleggen waarom een taalmodel een statistische voorspeller is en daardoor ongeschikt als bron van informatie op zichzelf. [categorie: begrijpen; domeinen: Kennis]
- De docent begrijpt wat hallucineren is, dat er geen intentie achter zit, en kan misinformatie van desinformatie onderscheiden. [categorie: begrijpen; domeinen: Kennis, Ethiek]
- De docent kan bias in AI-output herkennen en toepassen op eigen lesmateriaal, inclusief didactische bias (zoals de mythe van de leerstijlen). [categorie: toepassen; domeinen: Ethiek, Kennis]
- De docent kan beoordelen wanneer cognitive offloading aan AI het leren versterkt en wanneer het het ondermijnt, en dit pedagogisch inbedden. [categorie: evalueren; domeinen: Pedagogiek, Mindset]
- De docent kan de auteursrechtsituatie rond trainingsdata, gebruik en output op hoofdlijnen uitleggen en de nuance benoemen dat veel nog niet juridisch beslist is. [categorie: begrijpen; domeinen: Ethiek, Agency]
- De docent kan beoordelen welke data wel en niet in een chatbot mogen volgens de AVG, en een keuze met leerlingdata verantwoorden. [categorie: evalueren; domeinen: Ethiek, Agency]
- De docent kan duurzaamheid genuanceerd meewegen in AI-keuzes door risico's af te zetten tegen het totaalplaatje. [categorie: evalueren; domeinen: Ethiek]
- De docent kan uitleggen wat de EU AI Act artikel 4 over AI-geletterdheid concreet voor de eigen praktijk betekent. [categorie: begrijpen; domeinen: Ethiek, Agency]

## 3. Verwachte praktijkvoorbeelden

Een sterke docent op basisniveau kan voorbeelden in deze geest noemen:

- AI als studieobject behandelen in plaats van als antwoordmachine: samen een hallucinatie opsporen, een niet-bestaande bron laten genereren en dan checken.
- Leerlingen bronnen laten verifieren via doorklikken (bijvoorbeeld in NotebookLM, waar je naar de passage van een bron kunt klikken waar een claim vandaan komt).
- Bias-oefeningen: een plaatje van een directeur laten genereren en bespreken waarom het bijna altijd een man is; een vertaling testen op gender-bias; output van twee modellen vergelijken (trianguleren).
- Leerlingen eerst zelf een antwoord laten formuleren en pas daarna AI raadplegen (generatie-effect), en het wegen van AI-antwoorden onderdeel van de opdracht maken.
- Zelf een tool bouwen die geen antwoorden voorschotelt maar kritische vragen stelt of feedback geeft, zodat AI niet de weg van de minste weerstand wordt.
- Leerlingwerk eerst anonimiseren (naam, schoolnaam, leerlingnummer weghalen) voordat je AI om feedback vraagt, zodat er geen persoonsgegevens in de chatbot belanden.
- Met leerlingen bespreken waar hun data heen gaat, hoe je een opt-out instelt, en waarom een EDU-account veiliger is dan een gratis account.
- Duurzaamheid in het totaalplaatje plaatsen: een papieren lesboek versus een AI-gegenereerd boek, of de reisbewegingen van studenten naar een hoorcollege versus een kennisclip thuis.
- Filosoferen met leerlingen over wat waarheid is, het verschil tussen iets geloven en iets weten, en hoe retoriek werkt (argument checken, niet alleen fact checken).

## 4. Veelgemaakte misvattingen en rode vlaggen

Dit is het sturende deel voor doorvragen en voor de anti-buzzword beoordeling. Let vooral op feitelijke fouten rond de EU AI Act en privacy.

**Misvatting: een taalmodel "weet" dingen en is dus een betrouwbare bron.** Correctie: het voorspelt statistisch het volgende woord en is een droommachine. Veilig gebruik vraagt de afweging: maakt het uit of de output waar is? Zo ja, kan ik het verifieren en heb ik de kennis daarvoor? Zo niet, dan niet veilig om op te leunen.

**Misvatting: hallucineren is een bug die de makers straks wel oplossen.** Correctie: het is een inherente eigenschap van voorspellende systemen, niet een fout die volledig te fixen is. Wel te verminderen (betere training, bronverantwoording, doorklikken naar bronnen), niet weg te poetsen. Modellen zijn er wel beter in geworden.

**Misvatting: misinformatie en desinformatie zijn hetzelfde.** Correctie: het verschil zit in intentie. Een taalmodel heeft geen intentie en maakt dus misinformatie, geen desinformatie. Wie de termen door elkaar haalt, mist dat onderscheid.

**Misvatting: langer nadenkende redeneermodellen hallucineren minder.** Correctie: recent onderzoek laat zien dat sommige redeneermodellen juist vaker hallucineren. Het zichtbare "denkproces" is gegenereerde tekst en kan heel overtuigend fout zijn.

**Misvatting: bias kun je er helemaal uithalen, of bias is altijd erg.** Correctie: bias komt uit data en uit taal zelf en is niet volledig te verwijderen. Geforceerde diversiteit kan ook misgaan (het Gemini-voorbeeld van een Duitse soldaat uit 1943 die als Aziatische of donkere soldaat werd weergegeven). Bias is soms zelfs een functie: modellen leggen patronen bloot. De juiste houding is kritisch blijven en goed prompten, niet doen alsof het probleem opgelost is.

**Misvatting: AI geeft didactisch neutrale lessuggesties.** Correctie: er zit didactische bias in. AI komt bijvoorbeeld vaak met de mythe van de leerstijlen (visueel versus auditief leren als vaste typen) en met klassikaal frontaal onderwijs. Zonder eigen expertise word je in een ouderwetse didactische richting gestuurd.

**Misvatting: cognitive offloading aan AI is altijd schadelijk voor het leren.** Correctie: het kan ontlasten, verplaatsen en verdiepen. Het is alleen schadelijk bij vermijden (denkstappen overslaan), overgave (kritiekloos overnemen) en waarden afstaan. Het draait om de afweging per leerdoel: zit hier het leren, of niet?

**Misvatting: het echte antwoord op de risico's is AI uit het onderwijs houden.** Correctie: dat is volgens beide sprekers een drogreden en naief. Een boek is niet tegengesteld aan AI; beide kunnen bestaan. Wie AI weert, bekrachtigt juist de negatieve kant, want leerlingen weten dan niet hoe ze het zinvol gebruiken en kiezen de weg van de minste weerstand. Begeleiden is een didactisch beroep.

**Misvatting (auteursrecht): AI gebruiken is per definitie diefstal, want het schendt auteursrecht.** Correctie: of trainen op beschermd werk auteursrecht schendt, is juridisch nog grotendeels onbeslist en verschilt per zaak. De Anthropic-schikking ging niet om het trainen zelf maar om het illegaal verkrijgen van boeken. "Ik gebruik geen AI want het is jatwerk" is een stelling, geen vaststaand feit. De twee sprekers verschillen hier bewust van mening (Marcel terughoudender, Barend vindt auteursrecht een juridisch construct).

**Misvatting (auteursrecht): output van AI is automatisch van mij.** Correctie: een rechter oordeelde dat AI geen persoon is en dus geen auteursrecht kan dragen. Puur AI-gegenereerde output (jij typt "maak een mooi plaatje") is rechtenvrij en niet van jou. Pas bij voldoende eigen creatieve, menselijke bewerking kun je er recht aan ontlenen. Daartussen ligt een grijs gebied.

**Misvatting (privacy): wat ik in ChatGPT typ, weet het model voortaan, en een ander kan dat opvragen.** Correctie: dit is feitelijk onjuist bij de huidige modellen. Het model is bevroren en leert niet realtime van jouw gesprek. Het onthoudt alleen binnen jouw eigen gesprek (context). Als iemand anders vraagt wat jij hebt ingevoerd, gaat het model hooguit hallucineren; het "weet" jouw invoer niet. Wel kan je prompt opgeslagen worden en bij een gratis account in een toekomstige trainingsrun belanden, dat is een andere kwestie.

**Misvatting (privacy): je mag alles in een chatbot zetten zolang je maar oppast.** Correctie: gewone persoonsgegevens (AVG artikel 4: naam, e-mail, BSN, cijfers) vragen een grondslag en horen niet zomaar in een chatbot. Leerlingwerk laten beoordelen door AI vereist anonimiseren. Bijzondere persoonsgegevens (medisch, religie, etniciteit, geaardheid) horen er nooit in.

**Misvatting (privacy): met een schoolaccount op Copilot zit alles automatisch goed, of juist: het mag nooit.** Correctie: het hangt af van de verwerkersovereenkomst. Zonder zo'n overeenkomst mag je het gebruik formeel niet van leerlingen eisen. Met een EDU- of zakelijk account met data binnen Europa zit je in de veilige categorie. De praktijk wijkt vaak af van wat juridisch mag.

**Misvatting (duurzaamheid): AI is per definitie zo onduurzaam dat je het niet zou moeten gebruiken.** Correctie: nuanceer en zet het af tegen het totaalplaatje. Het waterverbruik valt vergeleken met landbouw nu nog mee, de techniek wordt snel efficienter, en AI kan elders in het onderwijs juist duurzaamheidswinst opleveren (kennisclip in plaats van reisbewegingen, AI-boek versus papieren boek). Tegelijk zijn stroom en vooral grondstoffen en e-waste echte zorgen, en kan de Jevons-paradox de efficientiewinst opheffen. Eenzijdig afserveren of wegwuiven is allebei fout.

**Misvatting (EU AI Act artikel 4): artikel 4 verbiedt bepaalde AI-toepassingen, of regelt risicocategorieen.** Correctie: artikel 4 van de EU AI Act gaat over AI-geletterdheid (AI literacy). Het verplicht aanbieders en gebruiksverantwoordelijken van AI-systemen om te zorgen voor voldoende AI-geletterdheid bij hun personeel en anderen die namens hen met AI werken. Voor een school betekent dit een inspanningsverplichting om docenten (en in onderwijscontext leerlingen) AI-geletterd te maken, niet een verbod. Verwar dit niet met de risicocategorieen (onaanvaardbaar, hoog, beperkt, minimaal risico) of met verboden praktijken; die staan in andere artikelen.

**Rode vlaggen voor een oppervlakkig of ingestudeerd antwoord:**
- Buzzwords zonder inhoud: "AI is een black box", "AI hallucineert", "privacy is belangrijk", "denk aan de duurzaamheid", zonder uit te leggen wat dat concreet betekent of wat de docent anders doet.
- Stelt risico's als absoluut ("AI is niet duurzaam", "AI is diefstal", "AI maakt leerlingen dommer") zonder de nuance of het tegenvoorbeeld die in dit webinar centraal staan.
- Haalt feiten over de EU AI Act door elkaar (artikel 4 koppelen aan risicocategorieen of verboden in plaats van aan AI-geletterdheid).
- Beweert dat een chatbot onthoudt wat je typt en dat anderen dat kunnen opvragen (privacy-misvatting over het bevroren model).
- Noemt geen onderscheid tussen soorten persoonsgegevens, of denkt dat anonimiseren niet nodig is bij leerlingwerk.
- Verwart misinformatie en desinformatie, of schrijft intentie toe aan het model.
- Bepleit AI weren uit het onderwijs als oplossing, zonder de pedagogische afweging.
- Geeft geen voorbeeld uit het eigen vak of de eigen context.
- Behandelt cognitive offloading als puur slecht of puur goed, zonder de afweging per leerdoel.

## 5. Verifieerbare claims en goede doorvraagrichtingen

- *Claim:* een taalmodel is een statistische woordvoorspeller, geen kennisbank. *Doorvragen:* wanneer maakt het dan wel of niet uit of de output klopt, en hoe verifieer jij? Stuur richting de afweging verifieerbaarheid en eigen kennis.
- *Claim:* hallucineren is een eigenschap, geen bug. *Doorvragen:* hoe verklein je het risico in jouw lespraktijk? Stuur richting bronverantwoording, doorklikken, en AI als studieobject.
- *Claim:* bias komt uit de data en is niet volledig weg te krijgen (directeur-voorbeeld, vertaalbias, leerstijlen). *Doorvragen:* waar zou bias in jouw vak of lesmateriaal kunnen opduiken, en hoe vang je dat op? Stuur richting herkennen, prompten en trianguleren.
- *Claim:* offloading kan verrijken of ondermijnen (e-bike, paperclip-onderzoek). *Doorvragen:* waar in jouw vak wil je leerlingen juist laten worstelen, en waar mag AI ontlasten? Stuur richting bewust afwegen per leerdoel.
- *Claim:* AI-output is pas van jou bij voldoende eigen creatieve bewerking. *Doorvragen:* wanneer is iets nog "jouw werk" en wanneer niet? Stuur richting het spectrum van puur AI tot AI als hulpmiddel.
- *Claim:* het bevroren model leert niet realtime van jouw gesprek. *Doorvragen:* wat gebeurt er dan wel met je data bij een gratis account? Stuur richting opslag, opt-out en trainingsrun.
- *Claim:* leerlingwerk beoordelen door AI bevat bijna altijd persoonsgegevens. *Doorvragen:* wat zou jij concreet weghalen voordat je het invoert, en waarom? Stuur richting anonimiseren en AVG artikel 4.
- *Claim:* duurzaamheid moet je in het totaalplaatje bekijken (water versus landbouw, AI-boek versus papieren boek). *Doorvragen:* waar zou AI in jouw context netto duurzamer of juist onduurzamer uitpakken? Stuur richting afwegen in plaats van afserveren.
- *Claim:* EU AI Act artikel 4 verplicht tot AI-geletterdheid. *Doorvragen:* wat betekent die inspanningsverplichting concreet voor jou en je school? Stuur richting scholing van personeel en het AI-geletterd maken van leerlingen.

## 6. Domeinkoppeling

Dit webinar raakt vooral **Ethiek** (privacy, bias, transparantie, verantwoordelijkheid, auteursrecht, duurzaamheid, de EU AI Act) en daarnaast **Kennis** (hoe een taalmodel werkt, hallucineren, output kritisch beoordelen). **Pedagogiek** komt sterk terug bij cognitive offloading (wanneer AI het leren versterkt of ondermijnt, leerlingen begeleiden bij bewust gebruik). **Agency** speelt bij regie houden over je data, verantwoordelijkheid nemen voor AI-gebruik en je eigen keuzes kunnen verantwoorden. **Mindset** raakt het bij de bewuste, genuanceerde houding tegenover risico's en bij het afwegen wanneer AI past.

Waaraan je beheersing herkent in dit onderwerp:
- *Ethiek:* de docent benoemt privacy, bias, auteursrecht of duurzaamheid concreet en met nuance, kent het verschil tussen soorten persoonsgegevens, en haalt de EU AI Act niet door elkaar.
- *Kennis:* de docent kan uitleggen dat een taalmodel statistisch voorspelt, weet wat hallucineren is en zonder intentie gebeurt, en kan output kritisch wegen.
- *Pedagogiek:* de docent verbindt offloading aan een concreet leerdoel, weet wanneer leerlingen eerst zelf moeten worstelen, en kan AI-gebruik didactisch inbedden.
- *Agency:* de docent houdt regie over data en keuzes, neemt verantwoordelijkheid voor elke claim, en wil dat ook bij leerlingen ontwikkelen.
- *Mindset:* de docent kijkt genuanceerd naar risico's, vervalt niet in zwart-wit, en koppelt keuzes aan eigen professionele waarden.

## 7. Koppeling naar de examenvragen

**5A. "Wat is cognitive offloading en wanneer is het volgens jou wel of niet schadelijk in het leren?"** [Pedagogiek, Mindset; begrijpen]
*Waar je op let:* een correcte uitleg dat cognitive offloading je denken ondersteunen met een extern hulpmiddel is, en dat het niet zwart-wit is. Een sterk antwoord onderscheidt nuttige vormen (ontlasten, verplaatsen, verdiepen, de e-bike die je verder brengt) van schadelijke vormen (vermijden, overgave, waarden afstaan), en koppelt de afweging aan het leerdoel: zit hier het leren dat je wilt oefenen, of niet? Het generatie-effect (eerst zelf worstelen) en het paperclip-onderzoek (AI-groep dacht minder na over ideeen maar evalueerde en synthetiseerde meer) zijn sterke tekenen van begrip.
*Misvatting die kan opduiken:* offloading als puur slecht zien ("AI maakt leerlingen lui en dom") of puur goed ("het bespaart gewoon tijd"), zonder de afweging per leerdoel. Of "uitbesteden" letterlijk nemen alsof AI het denkwerk overneemt.

**5B. "Een docent voert leerlingdata in ChatGPT om feedbackbrieven te genereren. Beoordeel deze keuze."** [Ethiek, Agency; evalueren]
*Waar je op let:* het besef dat leerlingdata in feedbackbrieven bijna per definitie persoonsgegevens bevatten (naam, cijfers, mogelijk gevoelige inhoud) en dus onder de AVG vallen. Een sterk antwoord wijst op anonimiseren als minimale stap, op het ontbreken van een grondslag of verwerkersovereenkomst, en op het verschil tussen een gratis account (data mogelijk gebruikt voor training, servers in de VS) en een veilig EDU-account. De student neemt regie en verantwoordelijkheid (Agency) en weegt het ethisch af in plaats van alleen "het is handig". Bonus: het onderscheid tussen gewone en bijzondere persoonsgegevens.
*Misvatting die kan opduiken:* denken dat het veilig is omdat "het model het toch vergeet" (verwart kortetermijngeheugen met privacy), of denken dat een opt-out alle privacyproblemen oplost terwijl de persoonsgegevens nog steeds verwerkt worden. Of de keuze klakkeloos goedkeuren omdat het tijd bespaart.

**5C. "Hoe weeg jij duurzaamheid mee in je AI-keuzes als docent?"** [Ethiek; evalueren]
*Waar je op let:* een genuanceerde afweging in het totaalplaatje, niet een reflex. Een sterk antwoord noemt meer dan stroom: ook water (valt vergeleken met landbouw mee, hangt af van locatie) en grondstoffen of e-waste (vaak vergeten, wel een echte zorg). Het zet AI-gebruik af tegen alternatieven (AI-boek versus papieren boek, kennisclip versus reisbewegingen) en erkent de Jevons-paradox (efficientiewinst kan door meer gebruik teniet worden gedaan). Het verschil tussen tekst, beeld en video qua verbruik, en tussen training en inference, toont diepere kennis.
*Misvatting die kan opduiken:* "AI is niet duurzaam dus dat moeten we niet willen" als absoluut standpunt, of het tegenovergestelde wegwuiven ("valt allemaal wel mee"). Beide missen de afweging. Ook: alleen stroom en water noemen en grondstoffen vergeten.

**5D. "Wat betekent EU AI Act artikel 4 voor jou als docent concreet?"** [Ethiek, Agency; begrijpen]
*Waar je op let:* het besef dat artikel 4 over AI-geletterdheid (AI literacy) gaat en een inspanningsverplichting oplegt aan aanbieders en gebruiksverantwoordelijken om te zorgen voor voldoende AI-geletterdheid. Concreet voor een docent en school: zelf voldoende AI-geletterd zijn of worden, en leerlingen helpen AI-geletterd te worden (kritisch met output omgaan, weten hoe een taalmodel werkt, privacybewust zijn). Een sterk antwoord vertaalt dat naar de eigen praktijk en koppelt het aan eigenaarschap (Agency).
*Misvatting die kan opduiken:* artikel 4 verwarren met de risicocategorieen of verboden AI-praktijken van de EU AI Act, denken dat het een verbod of een technische eis is in plaats van een geletterdheidsverplichting, of helemaal niet weten waar het over gaat en gokken. Dit is het meest feitgevoelige onderwerp van dit webinar; let scherp op onjuiste claims over de wet.
