import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useStores } from "/providers/StoreProvider";

function ProtectedItem({ roles, redirectToAuth, showNotFound, children }) {
  const { meModel } = useStores();
  const user = meModel.user;
  const loading = meModel.loading;
  const router = useRouter();

  useEffect(() => {
    if (!user && redirectToAuth && !showNotFound) {
      router.push("/notfound");
    }
  }, [user, redirectToAuth, showNotFound, router]);

  if (loading) {
    return <div>loading ...</div>;
  }

  if (meModel.hasRoles(user, roles)) {
    return <>{children}</>;
  }

  if (showNotFound) {
    return <div>not found</div>;
  }

  return null;
}

export default observer(ProtectedItem);
