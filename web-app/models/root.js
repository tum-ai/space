import { MeModel } from './me.js';
import { MembersModel } from './members.js';
import { ProfileEditorModel } from './profileEditor.js';

export class RootModel {
	membersModel;
	meModel;
	profileEditorModel;

	constructor() {
		this.membersModel = new MembersModel(this);
		this.meModel = new MeModel(this);
		this.profileEditorModel = new ProfileEditorModel(this);

		this.membersModel.loadMembers();
		this.meModel.loadProfile();
	}

	// I dont't understand this part but it works
	hydrate(data) {
		if (data.x) {
			this.membersModel.hydrate(data.x);
			this.meModel.hydrate(data.x);
			this.profileEditorModel.hydrate(data.x);
		}
	}
}
