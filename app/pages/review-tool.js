import { observer } from 'mobx-react';
import Link from 'next/link';
import ProtectedItem from '../components/ProtectedItem';
import Tabs from '../components/Tabs';
import Icon from '/components/Icon';
import Page from '/components/Page';
import { useStores } from '/providers/StoreProvider';

function ReviewTool() {
	// TODO choose member's name from member profiles directly and fill in information accordingly
	return (
		<ProtectedItem showNotFound roles={['submit_reviews']}>
			<Page>
				<Tabs
					tabs={{
						Applications: <Applications />,
						Review: <Review />,
					}}
				/>
			</Page>
		</ProtectedItem>
		// TODO download button for cert
	);
}

const Applications = observer(() => {
	const { reviewToolModel } = useStores();
	return (
		<div className='flex flex-col space-y-4 pt-4'>
			<div className='m-auto bg-white dark:bg-gray-700 rounded w-full lg:w-1/2 p-2 flex space-x-4'>
				<Icon name={'FaSearch'} className='p-2 rounded' />
				<input
					value={reviewToolModel.search}
					onChange={(e) => {
						reviewToolModel.setSearch(e.target.value);
					}}
					placeholder='search..'
					className='w-full bg-transparent outline-none'
				></input>
				{reviewToolModel.search && (
					<button
						onClick={(e) => {
							reviewToolModel.setSearch('');
						}}
					>
						clear
					</button>
				)}
			</div>
			{reviewToolModel.filteredApplications.map((application) => (
				<Application data={application} />
			))}
		</div>
	);
});

function Application({ data }) {
	return (
		<div className='bg-white rounded-2xl shadow grid grid-cols-4 lg:grid-cols-6 p-6'>
			<div>{data.id}</div>
			<div>{data.first_name}</div>
			<div>{data.last_name}</div>
			<div>{data.email}</div>
			<div>{data.degree_level}</div>
			<Link href={data.resume}>Resume</Link>
		</div>
	);
}

const Review = observer(() => {
	return <div>review</div>;
});

export default ReviewTool;
