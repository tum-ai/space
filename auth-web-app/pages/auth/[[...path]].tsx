import Head from "next/head";
import React, { useEffect } from "react";
import styles from "../../styles/Home.module.css";
import dynamic from "next/dynamic";
import SuperTokens from "supertokens-auth-react";

// @ts-ignore
const SuperTokensComponentNoSSR = dynamic(new Promise((res) => res(SuperTokens.getRoutingComponent)), { ssr: false });

export default function Auth(): JSX.Element {
    useEffect(() => {
        if (SuperTokens.canHandleRoute() === false) {
            SuperTokens.redirectToAuth({
                redirectBack: false,
            });
        }
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>TUM.ai Auth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <SuperTokensComponentNoSSR />
            </main>
        </div>
    );
}
