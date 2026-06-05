export type QuestionKey =
  | "goal"
  | "difficulty_moment"
  | "satiety_level"
  | "main_obstacle"
  | "routine_level"
  | "preferred_plan";

export type QuizQuestion = {
  key: QuestionKey;
  title: string;
  options: string[];
};

export type QuizAnswers = Record<QuestionKey, string>;

export type QuizProfile =
  | "Perfil Belisco Emocional"
  | "Perfil Rotina Desorganizada"
  | "Perfil Fome Noturna"
  | "Perfil Falta de Planejamento"
  | "Perfil Recomeco";

export const questions: QuizQuestion[] = [
  {
    key: "goal",
    title: "Qual seu principal objetivo?",
    options: [
      "Ter mais controle alimentar",
      "Reduzir beliscos",
      "Melhorar rotina",
      "Emagrecer com mais organizacao",
    ],
  },
  {
    key: "difficulty_moment",
    title: "Em qual momento voce mais sente dificuldade?",
    options: ["Manha", "Tarde", "Noite", "Finais de semana"],
  },
  {
    key: "satiety_level",
    title: "Como esta sua saciedade hoje?",
    options: [
      "Sinto fome o tempo todo",
      "Tenho fome emocional",
      "Belisco sem perceber",
      "Consigo controlar bem",
    ],
  },
  {
    key: "main_obstacle",
    title: "Qual maior obstaculo?",
    options: [
      "Ansiedade",
      "Falta de rotina",
      "Compulsao por doces",
      "Falta de planejamento",
      "Comer fora de hora",
    ],
  },
  {
    key: "routine_level",
    title: "Como esta sua rotina?",
    options: [
      "Muito baguncada",
      "Mais ou menos",
      "Tenho alguma disciplina",
      "Ja sigo uma rotina",
    ],
  },
  {
    key: "preferred_plan",
    title: "Voce prefere um plano:",
    options: [
      "Simples e direto",
      "Mais detalhado",
      "Com acompanhamento diario",
      "Com metas leves",
    ],
  },
];

export const emptyAnswers: QuizAnswers = {
  goal: "",
  difficulty_moment: "",
  satiety_level: "",
  main_obstacle: "",
  routine_level: "",
  preferred_plan: "",
};

export function getQuizProfile(answers: QuizAnswers): QuizProfile {
  const emotionalSignals = [
    answers.satiety_level === "Tenho fome emocional",
    answers.main_obstacle === "Ansiedade",
    answers.main_obstacle === "Compulsao por doces",
  ].filter(Boolean).length;

  if (answers.difficulty_moment === "Noite") {
    return "Perfil Fome Noturna";
  }

  if (emotionalSignals >= 2 || answers.goal === "Reduzir beliscos") {
    return "Perfil Belisco Emocional";
  }

  if (
    answers.main_obstacle === "Falta de planejamento" ||
    answers.main_obstacle === "Comer fora de hora"
  ) {
    return "Perfil Falta de Planejamento";
  }

  if (
    answers.routine_level === "Muito baguncada" ||
    answers.main_obstacle === "Falta de rotina"
  ) {
    return "Perfil Rotina Desorganizada";
  }

  return "Perfil Recomeco";
}

export function getProfileDescription(profile: QuizProfile) {
  const descriptions: Record<QuizProfile, string> = {
    "Perfil Belisco Emocional":
      "Seu ponto de partida tende a ser criar pausas, organizar gatilhos e reduzir decisoes impulsivas ao longo do dia.",
    "Perfil Rotina Desorganizada":
      "Seu melhor caminho inicial e simplificar horarios, preparar escolhas faceis e reduzir improvisos nas refeicoes.",
    "Perfil Fome Noturna":
      "Seu protocolo inicial deve observar o fim do dia, reforcar saciedade antes da noite e organizar alternativas leves.",
    "Perfil Falta de Planejamento":
      "Seu foco principal e antecipar escolhas, montar uma rotina alimentar possivel e diminuir comida fora de hora.",
    "Perfil Recomeco":
      "Seu perfil combina bem com metas leves, ajustes progressivos e uma rotina simples para voltar a ter consistencia.",
  };

  return descriptions[profile];
}
