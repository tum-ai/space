import { ProfileModel } from './profile.js';
import { ProfilesModel } from './profiles.js';

export class RootModel {
	profilesModel;
	profileModel;

	constructor() {
		this.profileModel = new ProfileModel(this);
		this.profilesModel = new ProfilesModel(this);

		this.profilesModel.loadProfiles();
	}
}
