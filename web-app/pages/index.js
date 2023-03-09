import Page from 'components/Page';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export default function Home() {
	const session = useSessionContext();
	console.log(session);
	return (
		<Page>
			<div className='m-auto pt-32 text-center'>
				<div className='glow font-thin'>Space</div>
				<div className='font-code'>TUM.ai</div>
			</div>
		</Page>
	);
}
