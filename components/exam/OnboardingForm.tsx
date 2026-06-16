'use client';

/**
 * Onboarding-formulier voor de eerste login. De deelnemer vult zijn school en
 * onderwijsniveau in. Deze gegevens lezen Lieke en de beoordelaar uit profiles,
 * dus ze moeten kloppen voordat het examen start. Vakgebied vragen we hier niet
 * uit, dat vraagt Lieke live. De role wijzigen we niet zodat de RLS-policy
 * profiles_own_update de update toestaat.
 */
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

type Niveau = 'PO' | 'VO' | 'MBO' | 'HBO' | 'WO';

const NIVEAU_OPTIES: Array<{ code: Niveau; label: string }> = [
  { code: 'PO', label: 'primair onderwijs' },
  { code: 'VO', label: 'voortgezet onderwijs' },
  { code: 'MBO', label: 'middelbaar beroepsonderwijs' },
  { code: 'HBO', label: 'hoger beroepsonderwijs' },
  { code: 'WO', label: 'wetenschappelijk onderwijs' },
];

export function OnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [school, setSchool] = useState('');
  const [niveau, setNiveau] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!school.trim() || !niveau) {
      setError('Vul je school en je onderwijsniveau in.');
      return;
    }

    setPending(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setPending(false);
      router.replace('/login');
      return;
    }

    // We vragen de bijgewerkte rij terug met select + maybeSingle. Raakt de
    // update 0 rijen (bijv. een user zonder profielrij), dan geeft PostgREST
    // geen error maar wel data null. Zonder deze check zouden we wegnavigeren
    // naar /start, waarna de gate weer terugstuurt naar /welkom: een
    // onzichtbare redirect-loop. We navigeren dus alleen bij een echte rij.
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({ school: school.trim(), niveau: niveau as Niveau })
      .eq('user_id', user.id)
      .select('user_id')
      .maybeSingle();

    if (updateError || !updated) {
      setPending(false);
      setError(
        'Je profiel kon niet worden bijgewerkt. Neem contact op met de examencommissie.'
      );
      return;
    }

    router.replace('/start');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error ? (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <label htmlFor="school" className="flex flex-col gap-1 text-sm text-text-body">
        <span className="font-medium">School</span>
        <input
          id="school"
          type="text"
          autoComplete="organization"
          value={school}
          onChange={(event) => setSchool(event.target.value)}
          className="rounded-xl border border-purple-primary/20 px-4 py-3 text-base focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/30"
          placeholder="Naam van je school"
        />
      </label>

      <label htmlFor="niveau" className="flex flex-col gap-1 text-sm text-text-body">
        <span className="font-medium">Onderwijsniveau</span>
        <select
          id="niveau"
          value={niveau}
          onChange={(event) => setNiveau(event.target.value)}
          className="rounded-xl border border-purple-primary/20 px-4 py-3 text-base bg-white focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/30"
        >
          <option value="" disabled>
            Kies je onderwijsniveau
          </option>
          {NIVEAU_OPTIES.map((optie) => (
            <option key={optie.code} value={optie.code}>
              {optie.code}, {optie.label}
            </option>
          ))}
        </select>
      </label>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="mt-2 min-h-[44px]"
      >
        {pending ? 'Bezig met opslaan' : 'Opslaan en verder'}
      </Button>
    </form>
  );
}
