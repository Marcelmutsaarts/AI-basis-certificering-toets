/**
 * Casuskaartjes voor webinar 4 en 5, gecondenseerd uit sectie 7 van elk
 * kennisbasis-bestand. Wordt samengevoegd in casus-cards.ts.
 */
import type { CasusCard } from './types';

export const CASUS_CARDS_2: Record<string, CasusCard> = {
  '4A': {
    code: '4A',
    webinar: 4,
    waarOpLetten:
      'Een concrete keuze voor een of twee Mollick-rollen, gekoppeld aan het eigen vak en een leerdoel, met uitleg hoe de docent die zou inzetten. De rol wordt correct beschreven.',
    goedAntwoord:
      'Een herkenbare rol, een vakvoorbeeld, en een reden waarom die rol daar versterkend werkt. Bonus: erkennen dat de rol moet passen bij het moment in het leerproces.',
    misvatting:
      'Rollen door elkaar halen (tutor versus Socratisch, of procesbegeleider als inhoudleverancier), of een rol noemen zonder concrete toepassing.',
  },
  '4B': {
    code: '4B',
    webinar: 4,
    waarOpLetten:
      'Een afgewogen oordeel met beide kanten over een tutorbot voor toetsvoorbereiding.',
    goedAntwoord:
      'Wel wenselijk: oefenen, begrip checken, andere uitleg, gepersonaliseerde feedback, 24/7 beschikbaar. Niet wenselijk: denkwerk uitbesteden, antwoorden overnemen, de bot als orakel gebruiken, plus de risicos dat de tutor pleast, kan hallucineren en dat de docent geen zicht heeft. Koppelt aan het leerdoel: wordt het leren versterkt of vervangen?',
    misvatting:
      'Een zwart-wit oordeel ("prima" of "verboden"), of alleen de voordelen noemen zonder het risico van uitbesteed denken en pleasen.',
  },
  '4C': {
    code: '4C',
    webinar: 4,
    waarOpLetten:
      'Een concreet gebruik van NotebookLM, gekoppeld aan het eigen vak. Weet de docent dat NotebookLM vanuit bronnen werkt en daardoor minder hallucineert?',
    goedAntwoord:
      'Een bron, een gemaakte vorm (chat, podcast, infographic, quiz, flashcards, mindmap of video-overzicht), en hoe dat het leren helpt. Bonus: een didactische inbedding (podcast als voorbereiding, quiz met feedback). Extra sterk: de privacynuance (gratis, maar traint op data).',
    misvatting:
      'NotebookLM verwarren met een gewone chatbot, niet weten dat het bronnen nodig heeft, of het noemen zonder enige toepassing.',
  },
  '4D': {
    code: '4D',
    webinar: 4,
    waarOpLetten:
      'Een helder onderscheid tussen een tutorbot en een Socratische bot, met het juiste moment in het leerproces.',
    goedAntwoord:
      'Het kernverschil: tutor geeft uitleg en doet voor, Socratisch geeft geen direct antwoord maar stelt wedervragen en laat de leerling zelf denken. Plus wanneer elk passend is (tutor als de leerling iets nog niet begrijpt, Socratisch als de stof al gekend wordt) en dat ze elkaar aanvullen.',
    misvatting:
      'Denken dat Socratisch altijd beter is, of de twee verwarren, of het verschil puur als techniek beschrijven zonder de didactische bedoeling (wie doet het denkwerk?).',
  },
  '5A': {
    code: '5A',
    webinar: 5,
    waarOpLetten:
      'Een correcte uitleg dat cognitive offloading je denken ondersteunen met een extern hulpmiddel is, en dat het niet zwart-wit is.',
    goedAntwoord:
      'Onderscheidt nuttige vormen (ontlasten, verplaatsen, verdiepen, de e-bike die je verder brengt) van schadelijke vormen (vermijden, overgave, waarden afstaan), en koppelt de afweging aan het leerdoel: zit hier het leren dat je wilt oefenen, of niet? Het generatie-effect (eerst zelf worstelen) is een sterk teken.',
    misvatting:
      'Offloading als puur slecht zien ("AI maakt leerlingen lui en dom") of puur goed ("het bespaart gewoon tijd"), zonder de afweging per leerdoel.',
  },
  '5B': {
    code: '5B',
    webinar: 5,
    waarOpLetten:
      'Het besef dat leerlingdata in feedbackbrieven bijna per definitie persoonsgegevens bevatten (naam, cijfers, gevoelige inhoud) en dus onder de AVG vallen.',
    goedAntwoord:
      'Wijst op anonimiseren als minimale stap, op het ontbreken van een grondslag of verwerkersovereenkomst, en op het verschil tussen een gratis account (data mogelijk voor training, servers in de VS) en een veilig EDU-account. Bonus: het onderscheid tussen gewone en bijzondere persoonsgegevens.',
    misvatting:
      'Denken dat het veilig is omdat "het model het toch vergeet" (verwart kortetermijngeheugen met privacy), of denken dat een opt-out alle privacyproblemen oplost, of de keuze klakkeloos goedkeuren omdat het tijd bespaart.',
  },
  '5C': {
    code: '5C',
    webinar: 5,
    waarOpLetten:
      'Een genuanceerde afweging in het totaalplaatje, niet een reflex.',
    goedAntwoord:
      'Noemt meer dan stroom: ook water (valt vergeleken met landbouw mee, hangt af van locatie) en grondstoffen of e-waste (vaak vergeten, wel een echte zorg). Zet AI af tegen alternatieven (AI-boek versus papieren boek, kennisclip versus reisbewegingen) en erkent de Jevons-paradox.',
    misvatting:
      '"AI is niet duurzaam dus dat moeten we niet willen" als absoluut standpunt, of het tegenovergestelde wegwuiven ("valt allemaal wel mee"). Ook: alleen stroom en water noemen en grondstoffen vergeten.',
  },
  '5D': {
    code: '5D',
    webinar: 5,
    waarOpLetten:
      'Het besef dat artikel 4 over AI-geletterdheid gaat en een inspanningsverplichting oplegt aan aanbieders en gebruiksverantwoordelijken. Dit is het meest feitgevoelige onderwerp, let scherp op onjuiste claims over de wet.',
    goedAntwoord:
      'Artikel 4 gaat over AI-geletterdheid (AI literacy) en een inspanningsverplichting om te zorgen voor voldoende AI-geletterdheid. Concreet: zelf voldoende AI-geletterd zijn of worden, en leerlingen helpen AI-geletterd te worden. Vertaalt dat naar de eigen praktijk en koppelt aan eigenaarschap.',
    misvatting:
      'Artikel 4 verwarren met de risicocategorieen of verboden AI-praktijken, denken dat het een verbod of technische eis is in plaats van een geletterdheidsverplichting, of gokken zonder het te weten.',
  },
};
