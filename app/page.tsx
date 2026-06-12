"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "english" | "french";

type Flashcard = {
  english: string;
  french: string;
  pronunciation: string;
  speechEnglish?: string;
  speechFrench?: string;
};

const flashcards: Flashcard[] = [
  {
    english: "Hello / Good day",
    french: "Bonjour",
    pronunciation: "bohn-ZHOOR",
  },
  {
    english: "Good evening",
    french: "Bonsoir",
    pronunciation: "bohn-SWAHR",
  },
  {
    english: "Hi (casual)",
    french: "Salut / Allô",
    pronunciation: "sah-LU / ah-LOH",
    speechFrench: "Salut. Allô.",
  },
  {
    english: "Goodbye",
    french: "Au revoir",
    pronunciation: "oh ruh-VWAHR",
  },
  {
    english: "See you soon",
    french: "À bientôt",
    pronunciation: "ah byan-TOH",
  },
  {
    english: "Please",
    french: "S'il vous plaît",
    pronunciation: "seel voo PLEH",
  },
  {
    english: "Thank you",
    french: "Merci",
    pronunciation: "mair-SEE",
  },
  {
    english: "Thank you very much",
    french: "Merci beaucoup",
    pronunciation: "mair-SEE boh-KOO",
  },
  {
    english: "You're welcome",
    french: "De rien",
    pronunciation: "duh ree-AN",
  },
  {
    english: "Yes / No",
    french: "Oui / Non",
    pronunciation: "wee / nohn",
    speechEnglish: "Yes. No.",
    speechFrench: "Oui. Non.",
  },
  {
    english: "Excuse me / Pardon",
    french: "Excusez-moi / Pardon",
    pronunciation: "ex-koo-zay-MWAH / par-DOHN",
    speechEnglish: "Excuse me. Pardon.",
    speechFrench: "Excusez-moi. Pardon.",
  },
  {
    english: "I'm sorry",
    french: "Je suis désolé(e)",
    pronunciation: "zhuh swee day-zoh-LAY",
    speechFrench: "Je suis désolé.",
  },
  {
    english: "Do you speak English?",
    french: "Parlez-vous anglais?",
    pronunciation: "par-lay-voo ahn-GLEH",
  },
  {
    english: "I don't speak French",
    french: "Je ne parle pas français",
    pronunciation: "zhuh nuh parl pah frahn-SEH",
  },
  {
    english: "I don't understand",
    french: "Je ne comprends pas",
    pronunciation: "zhuh nuh kohm-PRAHN pah",
  },
  {
    english: "Where is...?",
    french: "Où est...?",
    pronunciation: "oo EH",
    speechEnglish: "Where is?",
    speechFrench: "Où est?",
  },
  {
    english: "How do we get to...?",
    french: "Comment se rendre à...?",
    pronunciation: "koh-MAHN suh RAHN-druh ah",
    speechEnglish: "How do we get to?",
    speechFrench: "Comment se rendre à?",
  },
  {
    english: "How much is it?",
    french: "C'est combien?",
    pronunciation: "say kohm-bee-AN",
  },
  {
    english: "The bill, please",
    french: "L'addition, s'il vous plaît",
    pronunciation: "lah-dee-see-OHN seel voo PLEH",
  },
  {
    english: "I would like...",
    french: "Je voudrais...",
    pronunciation: "zhuh voo-DREH",
    speechEnglish: "I would like",
    speechFrench: "Je voudrais",
  },
  {
    english: "Do you have...?",
    french: "Avez-vous...?",
    pronunciation: "ah-vay-VOO",
    speechEnglish: "Do you have?",
    speechFrench: "Avez-vous?",
  },
  {
    english: "I'm looking for...",
    french: "Je cherche...",
    pronunciation: "zhuh SHAIRSH",
    speechEnglish: "I'm looking for",
    speechFrench: "Je cherche",
  },
  {
    english: "Where are the toilets?",
    french: "Où sont les toilettes?",
    pronunciation: "oo sohn lay twah-LET",
  },
  {
    english: "Help!",
    french: "À l'aide!",
    pronunciation: "ah LED",
  },
  {
    english: "Good morning",
    french: "Bonjour",
    pronunciation: "bohn-ZHOOR",
  },
];

function oppositeLanguage(language: Language): Language {
  return language === "french" ? "english" : "french";
}

export default function Home() {
  const [frontLanguage, setFrontLanguage] = useState<Language>("french");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentCard = flashcards[cardIndex];
  const visibleLanguage = isFlipped
    ? oppositeLanguage(frontLanguage)
    : frontLanguage;
  const hiddenLanguage = oppositeLanguage(visibleLanguage);
  const visibleText = currentCard[visibleLanguage];
  const visibleSpeechText =
    visibleLanguage === "french"
      ? currentCard.speechFrench ?? currentCard.french
      : currentCard.speechEnglish ?? currentCard.english;

  const frontCard = useMemo(
    () => ({
      language: frontLanguage,
      text: currentCard[frontLanguage],
    }),
    [currentCard, frontLanguage],
  );

  const backCard = useMemo(() => {
    const language = oppositeLanguage(frontLanguage);

    return {
      language,
      text: currentCard[language],
    };
  }, [currentCard, frontLanguage]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedLanguage = window.localStorage.getItem(
        "montreal-flashcards-front-language",
      );

      if (savedLanguage === "english" || savedLanguage === "french") {
        setFrontLanguage(savedLanguage);
      }

      setCanSpeak("speechSynthesis" in window);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.speechSynthesis?.cancel();
    };
  }, []);

  function chooseFrontLanguage(language: Language) {
    setFrontLanguage(language);
    setIsFlipped(false);
    window.localStorage.setItem("montreal-flashcards-front-language", language);
  }

  function goToCard(nextIndex: number) {
    setCardIndex(nextIndex);
    setIsFlipped(false);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }

  function goToPreviousCard() {
    const previousIndex =
      cardIndex === 0 ? flashcards.length - 1 : cardIndex - 1;

    goToCard(previousIndex);
  }

  function goToNextCard() {
    const nextIndex =
      cardIndex === flashcards.length - 1 ? 0 : cardIndex + 1;

    goToCard(nextIndex);
  }

  function speakVisiblePhrase() {
    if (!canSpeak) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(visibleSpeechText);
    utterance.lang = visibleLanguage === "french" ? "fr-CA" : "en-US";
    utterance.rate = visibleLanguage === "french" ? 0.84 : 0.92;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="min-h-screen bg-[#f4f6f4] text-[#172020]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 border-b border-[#d7ded8] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#cf3f2e]">
              Montreal French
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal sm:text-4xl">
              Phrasebook Flashcards
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#4d5a55]">
            <span>
              Card {cardIndex + 1} of {flashcards.length}
            </span>
          </div>
        </header>

        <section className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="flex min-w-0 flex-col gap-4">
            <button
              aria-label={`Show ${hiddenLanguage} translation for ${visibleText}`}
              aria-pressed={isFlipped}
              className={`flashcard-button ${isFlipped ? "is-flipped" : ""}`}
              onClick={() => setIsFlipped((flipped) => !flipped)}
              type="button"
            >
              <span className="flashcard-inner">
                <CardFace
                  card={currentCard}
                  isHidden={isFlipped}
                  side={frontCard}
                />
                <CardFace
                  card={currentCard}
                  isBack
                  isHidden={!isFlipped}
                  side={backCard}
                />
              </span>
            </button>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr]">
              <button
                className="control-button"
                onClick={goToPreviousCard}
                type="button"
              >
                Previous
              </button>
              <button
                className="audio-button"
                disabled={!canSpeak}
                onClick={speakVisiblePhrase}
                type="button"
              >
                {isSpeaking ? "Playing" : "Play audio"}
              </button>
              <button
                className="control-button"
                onClick={goToNextCard}
                type="button"
              >
                Next
              </button>
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-4">
            <section className="panel">
              <h2 className="text-base font-bold">Settings</h2>
              <fieldset className="mt-3">
                <legend className="text-sm font-semibold text-[#4d5a55]">
                  Front language
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["french", "english"] as Language[]).map((language) => (
                    <button
                      className={`segmented-button ${
                        frontLanguage === language ? "is-selected" : ""
                      }`}
                      key={language}
                      onClick={() => chooseFrontLanguage(language)}
                      type="button"
                    >
                      {language === "french" ? "French" : "English"}
                    </button>
                  ))}
                </div>
              </fieldset>
            </section>

            <section className="panel min-h-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold">Deck</h2>
                <span className="rounded-md bg-[#f2c94c] px-2 py-1 text-xs font-bold text-[#172020]">
                  25 cards
                </span>
              </div>
              <div className="mt-3 grid max-h-[320px] gap-2 overflow-auto pr-1 lg:max-h-none">
                {flashcards.map((card, index) => {
                  const deckLabel = card[frontLanguage];

                  return (
                    <button
                      className={`deck-button ${
                        cardIndex === index ? "is-current" : ""
                      }`}
                      key={`${card.english}-${index}`}
                      onClick={() => goToCard(index)}
                      type="button"
                    >
                      <span className="deck-number">{index + 1}</span>
                      <span className="min-w-0 truncate text-left">
                        {deckLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function CardFace({
  card,
  isBack = false,
  isHidden,
  side,
}: {
  card: Flashcard;
  isBack?: boolean;
  isHidden: boolean;
  side: {
    language: Language;
    text: string;
  };
}) {
  return (
    <span
      aria-hidden={isHidden}
      className={`flashcard-face ${isBack ? "flashcard-back" : ""}`}
    >
      <span className="flex h-full flex-col gap-5">
        <span className="flex items-center justify-between gap-3">
          <span className="language-pill">
            {side.language === "french" ? "French" : "English"}
          </span>
          {side.language === "french" && (
            <span className="pronunciation-chip">{card.pronunciation}</span>
          )}
        </span>
        <span className="flex flex-1 items-center justify-center">
          <span className="block max-w-full break-words text-center text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
            {side.text}
          </span>
        </span>
      </span>
    </span>
  );
}
