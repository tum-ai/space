import { useAuth } from '../context/AuthContext';
import Page from '/components/Page';

export default function Home() {

	const { user } = useAuth()
	console.log("Home")
	console.log(user)

	return (
		<Page>
			<div className='m-auto pt-32 text-center'>
				<div className='glow font-thin'>Space</div>
				<div className='font-code'>TUM.ai</div>
			</div>
		</Page>
	);
}
