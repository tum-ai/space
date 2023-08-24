import { Section } from '@components/Section';
import ProfilesList from './components/ProfilesList';

function Profiles() {
	return (
		<>
			<Section>
				<div className='text-6xl font-thin'>Members</div>
			</Section>
			<Section>
				<ProfilesList />
			</Section>
		</>
	);
}

export default Profiles;
