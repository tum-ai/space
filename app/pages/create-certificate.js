import axios from 'axios';
import { observer } from 'mobx-react';
import ProtectedItem from '../components/ProtectedItem';
import Page from '/components/Page';
import Textarea from '/components/Textarea';
import { useStores } from '/providers/StoreProvider';
import Input from '/components/Input';
import download from 'downloadjs';

const Certificate = observer(() => {
	const certificate = {}

	function handleChange(e) {
		// console.log(e)
		certificate[e.target.name] = e.target.value
	}

	// TODO choose member's name from member profiles directly and fill in information accordingly
	// TODO dropdown for department
	// TODO dropdown for title
	// TODO dropdown for pronoun
	return (
		<div className='flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-full'>
			<div className='text-2xl font-light'>Create Member Certificate</div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					console.log(certificate)
					const response = await axios('/certificate/membership/', {
						data: certificate,
						method: 'POST',
						responseType: 'blob'
					});
					console.log(response);
					const contentDisposition = response.headers['content-disposition'];
					let fileName = 'download.pdf';
					download(response.data, fileName, response.headers['content-type']);
				}}
				className='flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-8'
			>
				<Input
					label="First Name"
					type='text'
					id='first_name'
					name='NAME'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Last Name"
					type='text'
					id='first_name'
					name='LASTNAME'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Department"
					type='text'
					id='first_name'
					name='DEPARTMENT'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Title (TL/Member ...)"
					type='text'
					id='first_name'
					name='TITLE'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Date Now"
					type='text'
					id='first_name'
					name='DATENOW'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Date Joined"
					type='text'
					id='first_name'
					name='DATEJOINED'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Pronoun (his/her)"
					type='text'
					id='first_name'
					name='PRONOUNPOS'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Date Signed On"
					type='text'
					id='first_name'
					name='SIGNED_ON'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Contribution 1"
					type='text'
					id='first_name'
					name='CONTRIB_1'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Contribution 2"
					type='text'
					id='first_name'
					name='CONTRIB_2'
					onChange={handleChange}
					required={true}
				/>
				<Input
					label="Contribution 3"
					type='text'
					id='first_name'
					name='CONTRIB_3'
					onChange={handleChange}
					required={true}
				/>
				<button
					type='submit'
					className='p-4 px-8 py-1 rounded-lg w-1/2 bg-gray-200 text-black'
				>
					<div>save</div>
				</button>
			</form>
		</div>
		// TODO download button for cert
	);
});

export default Certificate;
