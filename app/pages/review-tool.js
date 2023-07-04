import { observer } from 'mobx-react';
import ProtectedItem from '../components/ProtectedItem';
import Page from '/components/Page';
import { useStores } from '/providers/StoreProvider';

function ReviewTool() {
	const { reviewToolModel } = useStores();

	// TODO choose member's name from member profiles directly and fill in information accordingly
	return (
		<ProtectedItem showNotFound roles={['submit_reviews']}>
			<Page>awdaw</Page>
		</ProtectedItem>
		// TODO download button for cert
	);
}

export default observer(ReviewTool);
