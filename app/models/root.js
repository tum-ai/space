import axios from 'axios';
import { CertificateModel } from './certificate.js';
import { DepartmentMembershipsModel } from './department_memberships.js';
import { InviteModel } from './invite.js';
import { MeModel } from './me.js';
import { ProfileModel } from './profile.js';
import { ProfilesModel } from './profiles.js';
import { RolesModel } from './roles.js';
import { UiModel } from './ui.js';

export class RootModel {
	constructor() {
		this.profileModel = new ProfileModel(this);
		this.profilesModel = new ProfilesModel(this);
		this.inviteModel = new InviteModel(this);
		this.uiModel = new UiModel(this);
		this.meModel = new MeModel(this);
		this.rolesModel = new RolesModel(this);
		this.certificateModel = new CertificateModel(this);
		this.departmentMembershipsModel = new DepartmentMembershipsModel(this);
	}

	async GET(path) {
		try {
			const response = await axios(path);
			return response?.data?.data;
		} catch (error) {
			console.log(error);
			this.uiModel.updateModalContent(<div>Error:</div>);
			this.uiModel.toggleModal();
			return;
		}
	}

	async PATCH(path, data) {
		try {
			const response = await axios(path, {
				data: data,
				method: 'PATCH',
			});
			return response?.data.data;
		} catch (error) {
			console.log(error);
			const response = error.response;
			const data = response.data;
			const message = data.detail[0]['msg'];
			this.uiModel.toggleModal();
			this.uiModel.updateModalContent(<div>Error: {message}</div>);
			return;
		}
	}

	async DELETE(path, data) {
		try {
			const response = await axios(path, {
				data: data,
				method: 'DELETE',
			});
			return response?.data.data;
		} catch (error) {
			console.log(error);
			const response = error.response;
			const data = response.data;
			const message = data.detail[0]['msg'];
			this.uiModel.toggleModal();
			this.uiModel.updateModalContent(<div>Error: {message}</div>);
			return;
		}
	}

	async POST(path, data, config, returnResponse) {
		try {
			const response = await axios(path, {
				data: data,
				method: 'POST',
				...config,
			});
			if (returnResponse) {
				return response;
			}
			return response?.data;
		} catch (error) {
			console.log(error);
			const response = error.response;
			const data = response.data;
			const message = data.detail[0]['msg'];
			this.uiModel.toggleModal();
			this.uiModel.updateModalContent(<div>Error: {message}</div>);
			return;
		}
	}
}
