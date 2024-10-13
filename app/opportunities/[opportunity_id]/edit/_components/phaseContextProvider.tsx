"use client";

import type { Phases } from "@lib/types/opportunity";
import React, { useRef } from "react";
import { createPhasesStore, PhasesContext } from "./phases/usePhasesStore";

export const PhaseContextProvider = ({
  defaultValues,
  children,
}: {
  defaultValues: Phases;
  children: React.ReactNode;
}) => {
  const store = useRef(createPhasesStore(defaultValues)).current;

  return (
    <PhasesContext.Provider value={store}>{children}</PhasesContext.Provider>
  );
};
