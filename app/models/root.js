import { GlobalModalModel } from './globalModal.js';
import { InviteModel } from './invite.js';
import { ProfileModel } from './profile.js';
import { ProfilesModel } from './profiles.js';

export class RootModel {
	constructor() {
		this.profileModel = new ProfileModel();
		this.profilesModel = new ProfilesModel();
		this.inviteModel = new InviteModel(this);
		this.globalModalModel = new GlobalModalModel(this);

		this.profilesModel.loadProfiles();
	}
}
