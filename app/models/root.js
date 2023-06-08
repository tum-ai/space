import axios from 'axios';
import { ProfileModel } from './profile.js';
import { ProfilesModel } from './profiles.js';

export class RootModel {
	profilesModel;
	profileModel;

	constructor() {
		axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
		this.profileModel = new ProfileModel(this);
		this.profilesModel = new ProfilesModel(this);

		this.profilesModel.loadProfiles();
	}
}
