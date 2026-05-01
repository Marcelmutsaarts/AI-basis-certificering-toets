/**
 * Privacy-tekst voor het Start-scherm.
 * Tekst exact uit projectspec, geen herformulering.
 */
export function PrivacyText() {
  return (
    <div className="rounded-xl bg-purple-light-bg/60 border border-purple-light-bg p-5 text-sm leading-relaxed text-text-body">
      <p>
        Tijdens dit examen worden je antwoorden als tekstueel transcript
        bewaard. Audio wordt niet opgeslagen. Doel: beoordeling,
        kwaliteitsborging, en mogelijke heroverweging bij bezwaar.
        Bewaartermijn: 24 maanden, gelijk aan de geldigheidsduur van je
        certificaat. Daarna anonimiseren we je gegevens. Inzage: alleen jij en
        de examencommissie van AI voor Docenten. Door op Start te klikken stem
        je hiermee in. Je kunt het examen op elk moment afbreken; het transcript
        wordt dan gemarkeerd als afgebroken.
      </p>
    </div>
  );
}
