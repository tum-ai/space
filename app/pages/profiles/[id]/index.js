import ProfileEditor from './components/ProfileEditor';
import ProfileOverview from './components/ProfileOverview';
import Page from '/components/Page';

export default function Profile() {
	return (
		<Page>
			<ProfileEditor />
			<ProfileOverview />
		</Page>
	);
}
