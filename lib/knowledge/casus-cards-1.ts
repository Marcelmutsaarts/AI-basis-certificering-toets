/**
 * Casuskaartjes voor webinar 1 t/m 3, gecondenseerd uit sectie 7 van elk
 * kennisbasis-bestand. Wordt samengevoegd in casus-cards.ts.
 */
import type { CasusCard } from './types';

export const CASUS_CARDS_1: Record<string, CasusCard> = {
  '1A': {
    code: '1A',
    webinar: 1,
    waarOpLetten:
      'Erkent de docent dat hallucinaties bestaan, en kan hij uitleggen hoe je ze beperkt en waarom afschrijven te kort door de bocht is?',
    goedAntwoord:
      'Hallucinaties zijn reeel maar te beperken (goed prompten, context en bronnen, internet of deep research, zelf controleren). AI is een gereedschap dat je bewust en kritisch inzet, niet blind vertrouwt en niet blind afwijst.',
    misvatting:
      'Meegaan in "dus onbruikbaar" zonder nuance, of het omgekeerde, beweren dat AI niet verzint of altijd klopt.',
  },
  '1B': {
    code: '1B',
    webinar: 1,
    waarOpLetten:
      'Heeft de docent een concreet, eigen voorbeeld, en kan hij de opbouw verantwoorden (rol, doel of context, instructies, eventueel voorbeeld en kennis)?',
    goedAntwoord:
      'Een echte prompt uit de eigen praktijk, met uitleg waarom rol en context het gedrag sturen en het besef dat meer goede context betere output geeft. Eventueel eigen vakkennis of een gewenste outputvorm toevoegen.',
    misvatting:
      'Alleen de term "prompten" noemen zonder voorbeeld, of een eenregelige vraag presenteren als gerichte prompt zonder sturing of onderbouwing.',
  },
  '1C': {
    code: '1C',
    webinar: 1,
    waarOpLetten:
      'Begrijpt de docent het kernverschil tussen een chatbot (geeft op verzoek antwoord, per beurt) en een autonome agent (voert zelfstandig een taak uit, plant en controleert zelf)? Een doorkijk naar de gevolgen voor het onderwijs is mooi meegenomen, maar het draait om het verschil.',
    goedAntwoord:
      'Een chatbot reageert per beurt op wat je vraagt; een agent werkt zelfstandig naar een doel toe zonder dat je elke stap stuurt. Bonus: de docent benoemt wat dat betekent voor zijn werk of voor toetsing.',
    misvatting:
      'Chatbot en agent door elkaar halen of als hetzelfde zien.',
  },
  '1D': {
    code: '1D',
    webinar: 1,
    waarOpLetten:
      'Kan de docent de werking correct maar begrijpelijk uitleggen, afgestemd op het niveau van de leerling?',
    goedAntwoord:
      'Een correcte kern (getraind op heel veel tekst, leert patronen of structuur en voorspelt daarop, "weet" niet als een mens en kan zich vergissen) vertaald naar passende taal, bij voorkeur met een beeld of vergelijking, plus aandacht voor kritisch omgaan met de output.',
    misvatting:
      'Technisch jargon zonder vertaling naar het niveau, of de onjuiste voorstelling dat de AI feiten opzoekt of echt begrijpt zoals een mens.',
  },
  '2A': {
    code: '2A',
    webinar: 2,
    waarOpLetten:
      'Past de docent de prompt-opbouw concreet toe op een echte eigen taak, met een herkenbare rol, een helder doel of context, en uitvoerbare instructies?',
    goedAntwoord:
      'Een specifieke taak (toetsvragen, rubriek, feedback, lesopzet), een passende rol, doel met vak en niveau, en een paar concrete instructiestappen. Bonus: nadenken over welke tools aan of uit moeten en of de bot gedeeld wordt.',
    misvatting:
      'Alleen een naam of vaag idee noemen ("een GPT die mijn werk doet") zonder rol, doel of instructie, of denken dat de naam of beschrijving het gedrag bepaalt.',
  },
  '2B': {
    code: '2B',
    webinar: 2,
    waarOpLetten:
      'Trekt de docent een onderbouwde grens vanuit waarde, vakgebied of kwaliteit, en somt hij niet alleen voordelen op?',
    goedAntwoord:
      'Een concrete taak die de docent zelf wil houden, met een reden (eigen oordeel nodig, persoonlijk contact, exacte versus open beoordeling, privacy, of werkplezier). De docent kiest bewust in plaats van alles uit te besteden.',
    misvatting:
      'Zeggen dat AI overal handig is en geen enkele grens kunnen noemen, of een grens noemen zonder enige onderbouwing.',
  },
  '2C': {
    code: '2C',
    webinar: 2,
    waarOpLetten:
      'Geeft de docent een afgewogen ethisch oordeel over transparantie en verantwoordelijkheid, en niet alleen goed- of afkeuren?',
    goedAntwoord:
      'Het onderscheid tussen AI als hulpmiddel (acceptabel) en eindverantwoordelijkheid afschuiven (problematisch), met aandacht voor transparantie, het zelf controleren van de inhoud, en privacy bij leerling- of persoonsgegevens.',
    misvatting:
      'Alles afwijzen ("AI gebruiken is vals") of alles goedkeuren ("scheelt tijd, prima") zonder de verantwoordelijkheids- en transparantievraag te raken, of de privacydimensie missen.',
  },
  '2D': {
    code: '2D',
    webinar: 2,
    waarOpLetten:
      'Raakt de docent het kerninzicht dat vage of generieke input generieke output geeft, en benoemt hij concreet hoe je daar bovenuit komt?',
    goedAntwoord:
      'Eigen context, eigen voorbeelden, eigen lesopbouw of stijl meegeven, goede instructies en voorbeelditems, en kritische nabewerking of eigen oordeel. Dit laat regie en eigen vakmanschap zien.',
    misvatting:
      'Denken dat een betere of duurdere AI vanzelf unieke output geeft, of dat meer automatiseren het probleem oplost. De oplossing zit in eigen inbreng en controle, niet in de tool.',
  },
  '3A': {
    code: '3A',
    webinar: 3,
    waarOpLetten:
      'Een afgewogen oordeel, geen reflexmatig eens of oneens. Erkent de docent dat mondeling (performance) robuust is tegen AI, maar benoemt hij ook de blinde vlek (vluchtig, contextafhankelijk, spillage)?',
    goedAntwoord:
      'Mondeling geeft directe observatie en is robuust tegen AI, maar een enkele observatie is zelden representatief en meet al gauw hoe vlot iemand praat. De beste keuze koppelt aan het leerdoel en pleit voor een mix van bewijsvormen, niet voor een dogma.',
    misvatting:
      'Mondeling als wondermiddel zien ("dan kan AI niet meer frauderen") of juist helemaal afwijzen. Beide missen de afweging per leerdoel.',
  },
  '3B': {
    code: '3B',
    webinar: 3,
    waarOpLetten:
      'Een concreet voorbeeld uit het eigen vak, een heldere analyse waarom het kwetsbaar is (AI kan het product genereren, constructvaliditeit onder druk), en een gerichte aanpassing.',
    goedAntwoord:
      'Het oud-naar-nieuw patroon: van "schrijf X" naar "schrijf X plus maak je keuzes zichtbaar en onderbouw ze". De aanpassing gaat richting proces, verantwoording, dialoog of een authentieke context.',
    misvatting:
      'De oplossing zoeken in detectie of toezicht in plaats van herontwerp, of een vaag antwoord zonder eigen vakvoorbeeld.',
  },
  '3C': {
    code: '3C',
    webinar: 3,
    waarOpLetten:
      'Concrete maatregelen om de nadruk van eindproduct naar proces te verschuiven.',
    goedAntwoord:
      'Weging verschuiven van verslag naar dialoog (bijvoorbeeld twee minuten presenteren, de rest gesprek), werken met fasen en mijlpalen, een AI-verantwoording vragen (welke tools, wat overgenomen, wat verworpen), bronnen en analyse beoordelen, en begeleidingsgesprekken plannen.',
    misvatting:
      '"Proces toetsen" reduceren tot een logboek inleveren (met AI te fabriceren) zonder dialoog of verantwoording, of denken dat een toelichting van vijf minuten genoeg is.',
  },
  '3D': {
    code: '3D',
    webinar: 3,
    waarOpLetten:
      'Een genuanceerde afweging wanneer AI afschermen (mondeling, toezicht, klassikaal) alsnog verdedigbaar is.',
    goedAntwoord:
      'Verdedigbaar als het leerdoel juist het denken zonder hulpmiddel is, bij summatieve ijkmomenten met hoge belangen, of bij een centraal examen. Het verschilt per leerdoel en context, een bewuste keuze, geen algemene oplossing. Ethische laag: eerlijkheid en gelijke kansen tegen het risico van vals beschuldigen via onbetrouwbare detectie.',
    misvatting:
      '"Altijd AI-proof, want anders frauderen ze" (negeert validiteit), of het omgekeerde dogma dat AI-proof nooit mag. Ook: AI-proof verwarren met detectietools in plaats van met toetscondities.',
  },
};
