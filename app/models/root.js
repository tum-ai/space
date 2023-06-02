import axios from 'axios';
import { MemberModel } from './member.js';
import { MembersModel } from './members.js';
import { ProfileModel } from './profile.js';

export class RootModel {
	membersModel;
	profileModel;

	constructor() {
		axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
		this.memberModel = new MemberModel(this);
		this.membersModel = new MembersModel(this);
		this.profileModel = new ProfileModel(this);

		this.membersModel.loadMembers();
		this.profileModel.loadProfile();
	}

	// I dont't understand this part but it works
	hydrate(data) {
		if (data.x) {
			this.memberModel.hydrate(data.x);
			this.membersModel.hydrate(data.x);
			this.profileModel.hydrate(data.x);
		}
	}
}
