"use client";
import { observer } from "mobx-react";
import React from "react";

interface Props {
  roles?: any[];
  redirectToAuth?: boolean;
  showNotFound?: boolean;
  children?: React.ReactNode;
}
/**
 * @deprecated. just deprecated
 */
function ProtectedItem({ children }: Props) {
  return <>{children}</>;
}

export default observer(ProtectedItem);
