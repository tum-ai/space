import { makeAutoObservable } from 'mobx';

export class RolesModel {
	root;
	roleHolderships = [];
	roles = [];
	loading = true;

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);

		this.getRoleHolderships();
		this.getRoles();
	}

	async getRoleHolderships() {
		const roleHolderships = await this.root.GET('/role/holderships');
		if (!roleHolderships) return;
		let rolesObject = {};
		for (let i = 0; i < roleHolderships.length; i++) {
			const roleHoldership = roleHolderships[i];
			if (!rolesObject[roleHoldership['profile']['id']]) {
				rolesObject[roleHoldership['profile']['id']] = [];
			}
			rolesObject[roleHoldership['profile']['id']].push(
				roleHoldership['role']['handle']
			);
		}
		this.roleHolderships = rolesObject;
		this.loading = false;
	}

	async getRoles() {
		const roles = await this.root.GET('/roles');
		this.roles = roles;
		this.loading = false;
	}

	async updateRoles(roles) {
		const data = await this.root.PATCH('/role/holderships', roles);
		if (data) {
			this.profile = { ...this.profile, ...data };
		}
	}
}
