"use client";
import { useStores } from "@/providers/StoreProvider";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  roles?: any[];
  redirectToAuth?: boolean;
  showNotFound?: boolean;
  children?: React.ReactNode;
}

function ProtectedItem({
  roles,
  redirectToAuth,
  showNotFound,
  children,
}: Props) {
  const { meModel } = useStores();
  const user = meModel.user;
  const router = useRouter();

  useEffect(() => {
    if (!user && redirectToAuth && !showNotFound) {
      router.push("/notfound");
    }
  }, [user, redirectToAuth, showNotFound, router]);

  if (meModel.hasRoles(user, roles)) {
    return <>{children}</>;
  }

  if (showNotFound) {
    return <div>not found</div>;
  }

  return null;
}

export default observer(ProtectedItem);
