import axios from 'axios';
import { makeAutoObservable } from 'mobx';

export class InviteModel {
	root;
	text = '';

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	// STATE FUNCTIONS
	updateText(changes) {
		this.editorProfile = { ...this.editorProfile, ...changes };
	}

	formatText() {
		let rows = this.text.split('\n');
		rows = rows.map((row) => {
			const items = row.split(',');
			return {
				email: items[0],
				first_name: items[1],
				last_name: items[2],
				department_handle: items[3],
				department_position: items[4],
			};
		});
		return rows;
	}

	async invite() {
		// TODO
		const formatedText = this.formatText();
		const data = await InviteModel.inviteMembers(formatedText);
		if (data.failed?.length > 0) {
			this.root.globalModalModel.updateBody(
				<div className='flex flex-col space-y-2'>
					<div className=''>
						Failed to invite the following accounts:
					</div>
					{data.failed.map((obj) => (
						<div key={obj.data.email}>
							<span className='font-bold'>{obj.data.email}</span>
							{': '}
							{obj.error}
						</div>
					))}
				</div>
			);
			this.root.globalModalModel.toggleModal();
		} else {
			this.root.globalModalModel.updateBody(
				<div className='flex flex-col space-y-2'>
					Users invited successfully. They will receive an email
					shortly with a link to reset their password.
				</div>
			);
			this.root.globalModalModel.toggleModal();
			this.text = '';
		}
	}

	// API FUNCTIONS
	static async inviteMembers(formatedText) {
		const invites = await axios('/profiles/invite/members', {
			method: 'POST',
			data: formatedText,
		});
		const data = invites.data;
		return data;
	}
}
