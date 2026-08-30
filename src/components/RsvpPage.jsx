import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import copy from '../content/copy.json';

const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: 'easeIn' } },
};

function Spinner({ className = '' }) {
  return (
    <motion.span
      className={`inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function PrimaryButton({ children, disabled, loading, className = '', ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#A3542B] px-8 py-3 font-display text-label-lg uppercase tracking-[0.2em] text-white shadow-md transition-all duration-300 hover:bg-[#8a4523] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#A3542B] ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block font-display text-label-md uppercase tracking-[0.15em] text-neutral-500">
      {children}
    </label>
  );
}

function SearchSkeleton() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <div className="h-3 w-40 animate-pulse rounded-full bg-neutral-200" />
      <div className="h-3 w-56 animate-pulse rounded-full bg-neutral-200" />
    </div>
  );
}

// --- Step 1: search for an invitation -------------------------------------

function SearchStep({ onFound }) {
  const t = copy.rsvp.search;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setErrorMessage('');

    try {
      const { data: matches, error } = await supabase
        .from('guests')
        .select('*')
        .ilike('first_name', `%${firstName.trim()}%`)
        .ilike('last_name', `%${lastName.trim()}%`);

      if (error) throw error;

      if (!matches || matches.length === 0) {
        setNotFound(true);
        return;
      }

      const partyId = matches[0].party_id;

      const [{ data: party, error: partyError }, { data: partyGuests, error: guestsError }] = await Promise.all([
        supabase.from('wedding_parties').select('*').eq('id', partyId).single(),
        supabase.from('guests').select('*').eq('party_id', partyId).order('first_name', { ascending: true }),
      ]);

      if (partyError) throw partyError;
      if (guestsError) throw guestsError;

      onFound({ party, guests: partyGuests });
    } catch (err) {
      setErrorMessage('Something went wrong while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <motion.div
      key="search"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full max-w-md"
    >
      <div className="text-center">
        <p className="font-display text-label-md uppercase tracking-[0.3em] text-[#A3542B]">{copy.rsvp.subtitle}</p>
        <h1 className="mt-3 font-display italic text-display-sm text-neutral-900 md:text-display-md">{t.title}</h1>
        <p className="mt-4 font-display text-body-lg text-neutral-600">{t.intro}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-3xl bg-white p-8 shadow-xl md:p-10"
      >
        <div className="flex flex-col gap-6">
          <div>
            <FieldLabel>{t.firstNameLabel}</FieldLabel>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-[#F9F8F3] px-4 py-3 font-display text-body-lg text-neutral-900 outline-none transition-colors focus:border-[#A3542B]"
            />
          </div>
          <div>
            <FieldLabel>{t.lastNameLabel}</FieldLabel>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-[#F9F8F3] px-4 py-3 font-display text-body-lg text-neutral-900 outline-none transition-colors focus:border-[#A3542B]"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <PrimaryButton type="submit" loading={isSearching}>
            {t.button}
          </PrimaryButton>
        </div>

        {isSearching && <SearchSkeleton />}

        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 rounded-2xl bg-[#F9F0EA] p-5 text-center"
            >
              <p className="font-display text-title-sm font-semibold text-[#A3542B]">{t.notFoundTitle}</p>
              <p className="mt-2 font-display text-body-md text-neutral-600">{t.notFoundMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMessage && (
          <p className="mt-6 text-center font-display text-body-md text-red-600">{errorMessage}</p>
        )}
      </form>
    </motion.div>
  );
}

// --- Step 2: party RSVP form -----------------------------------------------

function GuestCard({ guest, onChange }) {
  const t = copy.rsvp.party;

  function setAttending(value) {
    onChange(guest.id, {
      is_attending: value,
      will_join_games: value ? guest.will_join_games : false,
      email: value ? guest.email : '',
    });
  }

  return (
    <div className="border-b border-neutral-100 py-6 last:border-b-0">
      <h3 className="font-display text-title-lg text-neutral-900">
        {guest.first_name} {guest.last_name}
      </h3>

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name={`attending-${guest.id}`}
            checked={guest.is_attending === true}
            onChange={() => setAttending(true)}
            className="h-4 w-4 accent-[#A3542B]"
          />
          <span className="font-display text-body-lg text-neutral-800">{t.attendingLabel}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name={`attending-${guest.id}`}
            checked={guest.is_attending === false}
            onChange={() => setAttending(false)}
            className="h-4 w-4 accent-[#A3542B]"
          />
          <span className="font-display text-body-lg text-neutral-800">{t.decliningLabel}</span>
        </label>
      </div>

      <AnimatePresence initial={false}>
        {guest.is_attending === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={guest.will_join_games}
                onChange={(e) => onChange(guest.id, { will_join_games: e.target.checked })}
                className="h-4 w-4 accent-[#A3542B]"
              />
              <span className="font-display text-body-lg text-neutral-800">{t.gamesLabel}</span>
            </label>

            <div className="mt-4">
              <FieldLabel>{t.emailLabel}</FieldLabel>
              <input
                type="email"
                value={guest.email || ''}
                onChange={(e) => onChange(guest.id, { email: e.target.value })}
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl border border-neutral-200 bg-[#F9F8F3] px-4 py-3 font-display text-body-lg text-neutral-900 outline-none transition-colors focus:border-[#A3542B]"
              />
              <p className="mt-2 font-display text-body-md text-neutral-400">{t.emailHint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PartyStep({ party, guests, onSubmitted }) {
  const t = copy.rsvp.party;
  const [localGuests, setLocalGuests] = useState(guests);
  const [songSuggestions, setSongSuggestions] = useState(party.song_suggestions || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function updateGuest(id, fields) {
    setLocalGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...fields } : g)));
  }

  const allAnswered = localGuests.every((g) => g.is_attending === true || g.is_attending === false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const guestUpdates = localGuests.map((g) =>
        supabase
          .from('guests')
          .update({
            is_attending: g.is_attending,
            will_join_games: g.will_join_games,
            email: g.email || null,
          })
          .eq('id', g.id)
      );

      const partyUpdate = supabase
        .from('wedding_parties')
        .update({ song_suggestions: songSuggestions })
        .eq('id', party.id);

      const results = await Promise.all([...guestUpdates, partyUpdate]);
      const failed = results.find((r) => r.error);
      if (failed) throw failed.error;

      onSubmitted({ guests: localGuests, songSuggestions });
    } catch (err) {
      setErrorMessage('We could not save your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      key="party"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full max-w-xl"
    >
      <div className="text-center">
        <p className="font-display text-label-md uppercase tracking-[0.3em] text-[#A3542B]">
          Party of {localGuests.length}
        </p>
        <h1 className="mt-3 font-display italic text-display-sm text-neutral-900 md:text-display-md">
          {party.party_name}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <div>
          {localGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} onChange={updateGuest} />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="font-display text-title-lg text-neutral-900">{t.songTitle}</h3>
          <p className="mt-1 font-display text-body-md text-neutral-500">{t.songIntro}</p>
          <textarea
            value={songSuggestions}
            onChange={(e) => setSongSuggestions(e.target.value)}
            placeholder={t.songPlaceholder}
            rows={4}
            className="mt-3 w-full rounded-xl border border-neutral-200 bg-[#F9F8F3] px-4 py-3 font-display text-body-lg text-neutral-900 outline-none transition-colors focus:border-[#A3542B]"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <PrimaryButton type="submit" loading={isSubmitting} disabled={!allAnswered}>
            {t.submitButton}
          </PrimaryButton>
        </div>

        {!allAnswered && (
          <p className="mt-4 text-center font-display text-body-md text-neutral-400">
            Please respond for every guest before submitting.
          </p>
        )}

        {errorMessage && (
          <p className="mt-4 text-center font-display text-body-md text-red-600">{errorMessage}</p>
        )}
      </form>
    </motion.div>
  );
}

// --- Step 3: confirmation ----------------------------------------------------

function CheckmarkIcon() {
  return (
    <motion.svg
      viewBox="0 0 52 52"
      className="h-16 w-16"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="#A3542B"
        strokeWidth="2"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        fill="none"
        stroke="#A3542B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 27l7 7 15-15"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
      />
    </motion.svg>
  );
}

function ThankYouStep({ guests, onEdit }) {
  const t = copy.rsvp.thankYou;
  const attendingCount = guests.filter((g) => g.is_attending).length;
  const anyAttending = attendingCount > 0;

  return (
    <motion.div
      key="thankyou"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full max-w-md"
    >
      <div className="flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-xl">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F9F0EA]"
        >
          <CheckmarkIcon />
        </motion.div>

        <h1 className="mt-6 font-display italic text-display-sm text-neutral-900">{t.title}</h1>
        <p className="mt-4 font-display text-body-lg text-neutral-600">
          {anyAttending ? t.attendingMessage : t.decliningMessage}
        </p>
        <p className="mt-2 font-display text-body-md text-neutral-400">
          {attendingCount} of {guests.length} guest{guests.length === 1 ? '' : 's'} attending
        </p>

        <button
          onClick={onEdit}
          className="mt-8 font-display text-label-md uppercase tracking-[0.2em] text-[#A3542B] underline-offset-4 transition-colors hover:underline"
        >
          {t.editButton}
        </button>
      </div>
    </motion.div>
  );
}

// --- Page --------------------------------------------------------------------

export default function RsvpPage() {
  const [step, setStep] = useState('search');
  const [party, setParty] = useState(null);
  const [guests, setGuests] = useState([]);
  const [songSuggestions, setSongSuggestions] = useState('');

  function handleFound({ party: foundParty, guests: foundGuests }) {
    setParty(foundParty);
    setGuests(foundGuests);
    setStep('party');
  }

  function handleSubmitted({ guests: submittedGuests, songSuggestions: submittedSongs }) {
    setGuests(submittedGuests);
    setSongSuggestions(submittedSongs);
    setStep('thankyou');
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F9F8F3] px-4 py-16 md:px-8">
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 font-display text-title-md text-[#E4463A] md:top-8 md:left-10"
      >
        J&amp;G
      </Link>

      <AnimatePresence mode="wait">
        {step === 'search' && <SearchStep key="search" onFound={handleFound} />}
        {step === 'party' && party && (
          <PartyStep key="party" party={party} guests={guests} onSubmitted={handleSubmitted} />
        )}
        {step === 'thankyou' && (
          <ThankYouStep key="thankyou" guests={guests} onEdit={() => setStep('party')} />
        )}
      </AnimatePresence>
    </section>
  );
}
