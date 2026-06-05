"use client";

import { FormEvent, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  emptyAnswers,
  getProfileDescription,
  getQuizProfile,
  questions,
  type QuizAnswers,
} from "@/lib/quiz";

type LeadForm = {
  name: string;
  email: string;
  phone: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const questionLabels: Record<keyof QuizAnswers, string> = {
  goal: "Qual seu principal objetivo?",
  difficulty_moment: "Em qual momento voce mais sente dificuldade?",
  satiety_level: "Como esta sua saciedade hoje?",
  main_obstacle: "Qual maior obstaculo?",
  routine_level: "Como esta sua rotina?",
  preferred_plan: "Voce prefere um plano:",
};

export function QuizFunnel() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isResultStep = step >= questions.length;
  const currentQuestion = questions[step];
  const profile = useMemo(() => getQuizProfile(answers), [answers]);
  const progress = started
    ? Math.min(((step + 1) / (questions.length + 1)) * 100, 100)
    : 0;

  function selectAnswer(answer: string) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.key]: answer,
    }));

    window.setTimeout(() => {
      setStep((current) => Math.min(current + 1, questions.length));
    }, 180);
  }

  function goBack() {
    if (isResultStep) {
      setStep(questions.length - 1);
      return;
    }

    setStep((current) => Math.max(current - 1, 0));
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const params = new URLSearchParams(window.location.search);
      const leadId = crypto.randomUUID();
      const supabase = getSupabaseBrowserClient();

      const { error: leadError } = await supabase.from("leads").insert({
        id: leadId,
        name: leadForm.name.trim(),
        email: leadForm.email.trim().toLowerCase(),
        phone: leadForm.phone.trim(),
        goal: answers.goal,
        difficulty_moment: answers.difficulty_moment,
        satiety_level: answers.satiety_level,
        main_obstacle: answers.main_obstacle,
        routine_level: answers.routine_level,
        preferred_plan: answers.preferred_plan,
        quiz_result: profile,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
      });

      if (leadError) {
        throw leadError;
      }

      const answerRows = questions.map((question) => ({
        lead_id: leadId,
        question: questionLabels[question.key],
        answer: answers[question.key],
      }));

      const { error: answersError } = await supabase
        .from("quiz_answers")
        .insert(answerRows);

      if (answersError) {
        throw answersError;
      }

      setSubmitState("success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar seus dados agora.";
      setErrorMessage(message);
      setSubmitState("error");
    }
  }

  if (!started) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f7f3ea] text-[#20231f]">
        <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-12">
          <nav className="flex items-center justify-between text-sm font-medium">
            <span>Protocolo Bariatrica Natural</span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-[#52614a]">
              21 dias
            </span>
          </nav>

          <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full bg-[#dce9cb] px-4 py-2 text-sm font-semibold text-[#446036]">
                Protocolo educativo de rotina alimentar
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-[#192116] sm:text-5xl lg:text-6xl">
                Descubra seu protocolo de saciedade para os proximos 21 dias
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#4b5148]">
                Responda algumas perguntas rapidas e receba uma direcao
                personalizada para melhorar sua rotina alimentar com mais
                controle e menos beliscos impulsivos.
              </p>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mt-8 w-full rounded-2xl bg-[#254d32] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#254d32]/20 transition hover:bg-[#1d3e28] sm:w-auto"
              >
                Comecar avaliacao
              </button>
              <p className="mt-4 max-w-lg text-xs leading-5 text-[#6b6f67]">
                Este conteudo e educativo e nao substitui orientacao medica,
                nutricional ou psicologica. Nao promete resultado especifico.
              </p>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[32px] bg-[#31573a] p-5 shadow-2xl shadow-[#172018]/20">
              <div className="relative flex h-full flex-col justify-between rounded-[26px] bg-[#fbfaf5] p-5">
                <div>
                  <div className="mb-5 h-2 rounded-full bg-[#e6eadf]">
                    <div className="h-2 w-2/3 rounded-full bg-[#e5a642]" />
                  </div>
                  <p className="text-sm font-semibold text-[#5e704f]">
                    Avaliacao rapida
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-snug">
                    Um plano simples para reduzir improvisos e beliscos.
                  </h2>
                </div>
                <div className="space-y-3">
                  {["Saciedade", "Rotina", "Planejamento"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#e4e0d5] bg-white px-4 py-4 text-sm font-medium"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-4 py-5 text-[#20231f]">
      <section className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-xl flex-col">
        <header className="mb-6">
          <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[#52614a]">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || submitState === "success"}
              className="disabled:opacity-0"
            >
              Voltar
            </button>
            <span>
              {Math.min(step + 1, questions.length + 1)} de{" "}
              {questions.length + 1}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#e7e2d5]">
            <div
              className="h-2 rounded-full bg-[#e5a642] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        {!isResultStep && currentQuestion ? (
          <div className="flex flex-1 flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#668057]">
              Avaliacao de rotina
            </p>
            <h1 className="mb-7 text-3xl font-semibold leading-tight">
              {currentQuestion.title}
            </h1>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.key] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectAnswer(option)}
                    className={`w-full rounded-2xl border px-5 py-5 text-left text-base font-semibold shadow-sm transition ${
                      selected
                        ? "border-[#254d32] bg-[#e6f0db] text-[#1c3624]"
                        : "border-[#e2ded2] bg-white text-[#2b3028] hover:border-[#b7c4aa]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#668057]">
              Seu perfil foi analisado
            </p>
            <h1 className="text-3xl font-semibold leading-tight">{profile}</h1>
            <p className="mt-4 text-base leading-7 text-[#4b5148]">
              {getProfileDescription(profile)}
            </p>

            {submitState === "success" ? (
              <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold">Dados recebidos</h2>
                <p className="mt-3 leading-7 text-[#4b5148]">
                  Seu protocolo inicial educativo foi solicitado. Confira seu
                  email e WhatsApp para os proximos passos.
                </p>
              </div>
            ) : (
              <form onSubmit={submitLead} className="mt-8 space-y-4">
                <p className="text-base font-semibold">
                  Digite seus dados para receber seu protocolo inicial.
                </p>
                <input
                  required
                  minLength={2}
                  value={leadForm.name}
                  onChange={(event) =>
                    setLeadForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Nome"
                  className="w-full rounded-2xl border border-[#ddd8ca] bg-white px-5 py-4 outline-none transition focus:border-[#254d32]"
                />
                <input
                  required
                  type="email"
                  value={leadForm.email}
                  onChange={(event) =>
                    setLeadForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Email"
                  className="w-full rounded-2xl border border-[#ddd8ca] bg-white px-5 py-4 outline-none transition focus:border-[#254d32]"
                />
                <input
                  required
                  inputMode="tel"
                  value={leadForm.phone}
                  onChange={(event) =>
                    setLeadForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="WhatsApp"
                  className="w-full rounded-2xl border border-[#ddd8ca] bg-white px-5 py-4 outline-none transition focus:border-[#254d32]"
                />
                {errorMessage ? (
                  <p className="rounded-2xl bg-[#fff1df] px-4 py-3 text-sm text-[#8a4a16]">
                    {errorMessage}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="w-full rounded-2xl bg-[#254d32] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#254d32]/20 transition hover:bg-[#1d3e28] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitState === "submitting"
                    ? "Salvando..."
                    : "Receber protocolo inicial"}
                </button>
                <p className="text-xs leading-5 text-[#6b6f67]">
                  Conteudo educativo sobre organizacao alimentar e habitos
                  progressivos. Nao substitui profissionais de saude.
                </p>
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
