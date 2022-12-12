import { MembersModel } from './members.js';

export class RootModel {
	membersModel;

	constructor() {
		this.membersModel = new MembersModel(this);

		this.membersModel.loadMembers();
	}

	// I dont't understand this part by it works
	hydrate(data) {
		if (data.x) {
			this.membersModel.hydrate(data.x);
		}
	}
}
