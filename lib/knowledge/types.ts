/**
 * Datamodel voor de kennisbasis achter examinator (Lieke) en beoordelaar.
 * Bron: prompts/kennisbasis/webinar-1..5.md, sectie 1, 4 en 7.
 * Niets verzonnen, alles gecondenseerd uit die bestanden.
 */

export interface CasusCard {
  code: string; // bijv. "1A"
  webinar: number; // 1..5
  waarOpLetten: string; // uit sectie 7 "Waar je op let"
  goedAntwoord: string; // uit sectie 7 "Goed antwoord bevat" / "Wat een goed antwoord bevat"
  misvatting: string; // uit sectie 7 "Misvatting die kan opduiken"
}

export interface WebinarGround {
  webinar: number;
  titel: string;
  kernpunten: string[]; // feitelijke ground truth waar een correct antwoord op aansluit
  rodeVlaggen: string[]; // signalen van oppervlakkig, ingestudeerd of buzzword-antwoord
}
