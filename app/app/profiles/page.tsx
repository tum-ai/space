import Page from '@components/Page';
import ProfilesList from './components/ProfilesList';

function Profiles() {
	return (
		<Page>
			<div className='text-6xl font-thin'>Members</div>
			<ProfilesList />
		</Page>
	);
}

export default Profiles;
