import { type Phase, type Questionnaire } from "@lib/types/opportunity";
import { createStore, useStore } from "zustand";
import { createContext, useContext } from "react";
import { immer } from "zustand/middleware/immer";

interface Props {
  phases: Phase[];
}

interface PhasesState extends Props {
  appendPhase: (data: Phase) => void;
  updatePhase: (index: number) => (data: Phase) => void;
  removePhase: (index: number) => void;

  appendQuestionnaire: (
    phaseIndex: number,
  ) => (questionnaire: Questionnaire) => void;
  removeQuestionnaire: (
    phaseIndex: number,
  ) => (questionnaireIndex: number) => void;
  updateQuestionnaire: (
    phaseIndex: number,
  ) => (questionnaireIndex: number, data: Questionnaire) => void;
}

type PhasesStore = ReturnType<typeof createPhasesStore>;

export const createPhasesStore = (initProps?: Partial<Props>) => {
  const DEFAULT_PROPS: Props = {
    phases: [],
  };
  return createStore<PhasesState>()(
    immer((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,

      appendPhase: (data) =>
        set((state) => {
          state.phases.push(data);
        }),
      updatePhase: (index) => (data) =>
        set((state) => {
          state.phases[index] = data;
        }),
      removePhase: (index) =>
        set((state) => {
          state.phases.splice(index, 1);
        }),

      appendQuestionnaire: (phaseIndex) => (questionnaire) =>
        set((state) => {
          state.phases[phaseIndex]!.questionnaires.push(questionnaire);
        }),
      removeQuestionnaire: (phaseIndex) => (questionnaireIndex) =>
        set((state) => {
          state.phases
            .at(phaseIndex)
            ?.questionnaires.splice(questionnaireIndex, 1);
        }),
      updateQuestionnaire: (phaseIndex) => (questionnaireIndex, data) =>
        set((state) => {
          state.phases[phaseIndex]!.questionnaires[questionnaireIndex] = data;
        }),
    })),
  );
};

export const PhasesContext = createContext<PhasesStore | null>(null);

export function usePhasesContext<T>(selector: (state: PhasesState) => T): T {
  const store = useContext(PhasesContext);
  if (!store) throw new Error("Missing PhaseContext.Provider in the tree");
  return useStore(store, selector);
}
