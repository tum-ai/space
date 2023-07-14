import { observer } from 'mobx-react';
import ProtectedItem from '../components/ProtectedItem';
import Tabs from '../components/Tabs';
import Icon from '/components/Icon';
import Input from '/components/Input';
import Page from '/components/Page';
import { useStores } from '/providers/StoreProvider';

const ReviewTool = observer(() => {
	const { reviewToolModel } = useStores();

	return (
		<ProtectedItem showNotFound roles={['submit_reviews']}>
			<Page>
				<Tabs
					tabs={{
						Applications: <Applications />,
						Review: <Review />,
					}}
					value={reviewToolModel.openTab}
					onValueChange={(tab) => {
						reviewToolModel.setOpenTab(tab);
					}}
				/>
			</Page>
		</ProtectedItem>
	);
});

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
				/>
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
			{reviewToolModel.filteredApplications?.map((application) => (
				<Application key={application.id} data={application} />
			))}
		</div>
	);
});

function Application({ data }) {
	const { reviewToolModel } = useStores();
	return (
		<div className='bg-white rounded-2xl shadow grid grid-cols-4 lg:grid-cols-7 p-6'>
			<div>{data.id}</div>
			<button
				onClick={() => {
					reviewToolModel.reviewApplication(data.id);
				}}
			>
				review
			</button>
		</div>
	);
}

function Review() {
	return (
		<div className='grid md:grid-cols-2 p-4 gap-4'>
			<div>
				<ReviewForm />
			</div>
			<ApplicationOverview />
		</div>
	);
}

const ApplicationOverview = observer(() => {
	const { reviewToolModel } = useStores();
	const applicationOnReview = reviewToolModel.applicationOnReview;

	return (
		<div className='space-y-4 overflow-scroll'>
			<div className='grid lg:grid-cols-2 gap-4'>
				<div>
					<span className='font-thin'>ID: </span>
					{applicationOnReview.id}
				</div>
				<div>
					<span className='font-thin'>From: </span>
					{applicationOnReview.submission?.data?.formName}
				</div>
				<div>
					<span className='font-thin'>Created at: </span>
					{applicationOnReview.submission?.data?.createdAt &&
						new Date(
							applicationOnReview.submission?.data?.createdAt
						).toDateString()}
				</div>
			</div>
			<hr className='border-2' />
			<div className='grid lg:grid-cols-2 gap-4'>
				{applicationOnReview.submission?.data?.fields?.map((field) => {
					return (
						<div>
							<div className='font-thin'>{field.label}</div>
							<div>{JSON.stringify(field.value)}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
});

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
			className='grid lg:grid-cols-2 gap-4 sticky top-24'
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
			<button
				className='p-4 px-8 py-1 rounded-lg w-full bg-gray-200 text-black'
				type='submit'
			>
				Submit review
			</button>
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

export default ReviewTool;
