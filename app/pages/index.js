import Page from '/components/Page';

// TODO: remove this once signin frontend is ready
import { auth } from '../config/firebase'

export default function Home() {
	return (
		<Page>
			<div className='m-auto pt-32 text-center'>
				<div className='glow font-thin'>Space</div>
				<div className='font-code'>TUM.ai</div>
			</div>
			<button onClick={
				async () => {
					console.log(await auth.currentUser?.getIdToken())
				}
			}>Log AuthToken</button><br/>
		</Page>
	);
}
