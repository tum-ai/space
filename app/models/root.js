import { InviteModel } from './invite.js';
import { ProfileModel } from './profile.js';
import { ProfilesModel } from './profiles.js';
import { UiModel } from './ui.js';

export class RootModel {
	constructor() {
		this.profileModel = new ProfileModel();
		this.profilesModel = new ProfilesModel();
		this.inviteModel = new InviteModel(this);
		this.uiModel = new UiModel(this);

		this.profilesModel.loadProfiles();
	}
}
