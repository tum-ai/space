import { useEffect } from "react";
import SessionReact, { useSessionContext } from "supertokens-auth-react/recipe/session";
import styles from "../styles/Home.module.css";

function ProtectedPage() {
    const session = useSessionContext();

    if (session.loading === true) {
        return null;
    }

    useEffect(() => {
        window.location.href = "http://space.tum-ai-dev.com:15950"
    }, [])

    return (
        <div className={styles.container}>
            Redirecting...
        </div>
    );
}

export default function Home(props) {
    return (
        <SessionReact.SessionAuth>
            <ProtectedPage />
        </SessionReact.SessionAuth>
    );
}
