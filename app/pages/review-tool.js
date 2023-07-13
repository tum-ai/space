import { observer } from 'mobx-react';
import Link from 'next/link';
import ProtectedItem from '../components/ProtectedItem';
import Tabs from '../components/Tabs';
import Icon from '/components/Icon';
import Input from '/components/Input';
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

function Review() {
	return (
		<div className='grid lg:grid-cols-2 p-4 gap-4'>
			<ReviewForm />
			<ApplicationOverview />
		</div>
	);
}

const ReviewForm = observer(() => {
	const { reviewToolModel } = useStores();
	const editorReview = reviewToolModel.editorReview;

	function handleChange(e) {
		reviewToolModel.updateEditorReview({
			[e.target.name]: e.target.value,
		});
	}

	return (
		<form
			className='grid lg:grid-cols-2 gap-4'
			onSubmit={async (e) => {
				e.preventDefault();
				await reviewToolModel.submitReview();
			}}
		>
			<Input
				label='Motivation'
				type='number'
				id='motivation'
				name='motivation'
				value={editorReview?.motivation}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Skill'
				type='number'
				id='skill'
				name='skill'
				value={editorReview?.skill}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Overall fit'
				type='number'
				id='fit'
				name='fit'
				value={editorReview?.fit}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Fit in Tum.ai'
				type='number'
				id='in_tumai'
				name='in_tumai'
				value={editorReview?.in_tumai}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Tum.ai fit comment'
				type='text'
				id='commentFitTUMai'
				name='commentFitTUMai'
				value={editorReview?.commentFitTUMai}
				onChange={handleChange}
				required={false}
			/>
			<Input
				label='Time commitment'
				type='text'
				id='timecommit'
				name='timecommit'
				value={editorReview?.timecommit}
				onChange={handleChange}
				required={false}
			/>
			<Input
				label='Department 1 score'
				type='number'
				id='dept1Score'
				name='dept1Score'
				value={editorReview?.dept1Score}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Department 2 score'
				type='number'
				id='dept2Score'
				name='dept2Score'
				value={editorReview?.dept2Score}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Department 3 score'
				type='number'
				id='dept3Score'
				name='dept3Score'
				value={editorReview?.dept3Score}
				onChange={handleChange}
				required={true}
			/>
			<Input
				label='Good fit?'
				type='text'
				id='maybegoodfit'
				name='maybegoodfit'
				value={editorReview?.maybegoodfit}
				onChange={handleChange}
				required={false}
			/>
			<Input
				label='Further comments'
				type='text'
				id='furthercomments'
				name='furthercomments'
				value={editorReview?.furthercomments}
				onChange={handleChange}
				required={false}
			/>
			<button type='submit'>Submit review</button>
			<button
				type='button'
				onClick={() => {
					reviewToolModel.updateEditorReview({
						motivation: 4,
						skill: 7,
						fit: 6,
						in_tumai: 2,
						commentFitTUMai: 'The fit seems good',
						timecommit: '10 hours per week',
						dept1Score: 8,
						dept2Score: 5,
						dept3Score: 7,
						maybegoodfit: 'Yes, potentially',
						furthercomments: 'Should keep an eye on progress',
					});
				}}
			>
				test
			</button>
		</form>
	);
});

const ApplicationOverview = observer(() => {
	return <div>Application</div>;
});

export default ReviewTool;
