import ProfilesList from './components/ProfilesList';
import Page from '/components/Page';

function Profiles() {
	return (
		<Page>
			<div className='font-thin text-6xl'>Members</div>
			<ProfilesList />
		</Page>
	);
}

export default Profiles;
