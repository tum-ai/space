import { MembersModel } from './members.js';

export class RootModel {
	membersModel;

	constructor() {
		this.membersModel = new MembersModel(this);

		this.membersModel.loadMembers();
	}

	hydrate(data) {
		if (data.x) {
			this.membersModel.hydrate(data.x);
		}
	}
}
