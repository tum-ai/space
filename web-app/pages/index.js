import Page from 'components/Page';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export default function Home() {
	const session = useSessionContext();
	console.log(session);
	return <Page>Welcome to TUM.ai</Page>;
}
