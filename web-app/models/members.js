import axios from 'axios';
import { makeAutoObservable } from 'mobx';

export class MembersModel {
	root;
	members = [];
	filteredMembers = [];
	filter = {};

	constructor(root) {
		this.root = root;
		makeAutoObservable(this);
	}

	getMembers() {
		return this.members;
	}

	findMember(id) {
		return this.members.find((member) => member.id === id);
	}

	setMembers(members) {
		this.members = members;
	}

	// STATE FUNCTIONS
	getDepartments() {
		const departmentsSet = new Set(
			this.members.map((member) => member.department)
		);
		return Array.from(departmentsSet);
	}
	getRoles() {
		const rolesSet = new Set(this.members.map((member) => member.role));
		return Array.from(rolesSet);
	}

	setFilter(key, value) {
		if (!value) {
			delete this.filter[key];
		} else {
			this.filter[key] = value;
		}
		this.filterMembers();
	}

	resetFilters() {
		this.filter = {};
		this.filterMembers();
	}

	filterMembers() {
		this.filteredMembers = this.members.filter((member) => {
			for (const key in this.filter) {
				if (this.filter[key] && member[key] != this.filter[key]) {
					return false;
				}
			}
			return true;
		});
	}

	// API FUNCTIONS
	async fetchMembers() {
		try {
			const profiles = await axios('/profiles');
			this.members = profiles.data.data;
			this.filteredMembers = profiles.data.data;
		} catch (error) {
			console.log(error.response);
			console.log('Could not get profiles');
		}
	}

	// ONLOAD
	async loadMembers() {
		await this.fetchMembers();
	}
}

// var mockData =
// [
// 	{
// 		  "name": "Max Mustermann",
// 		  "picture":
// 			  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
// 		  "department": "Industry",
// 		  "role": "Member",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Information Systems",
// 		  "degreeLevel": "M.Sc.",
// 		  "degreeSemester": "4",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "John Smith",
// 		  "picture": "",
// 		  "department": "Marketing",
// 		  "role": "Member",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Computer Science",
// 		  "degreeLevel": "B.Sc.",
// 		  "degreeSemester": "1",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "Thomas Schmidt",
// 		  "picture": "",
// 		  "department": "Software Development",
// 		  "role": "Member",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Information Systems",
// 		  "degreeLevel": "M.Sc.",
// 		  "degreeSemester": "3",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "Thomas Schmidt",
// 		  "picture": "",
// 		  "department": "Makeathon",
// 		  "role": "Teamlead",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Management & Technology",
// 		  "degreeLevel": "M.Sc.",
// 		  "degreeSemester": "1",
// 		  "university": "LMU",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "Jakob",
// 		  "picture": "",
// 		  "department": "Marketing",
// 		  "role": "Member",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Data Engineering and Analytics",
// 		  "degreeLevel": "M.Sc.",
// 		  "degreeSemester": "3",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "Matthias Müller",
// 		  "picture": "",
// 		  "department": "Community",
// 		  "role": "Teamlead",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Information Systems",
// 		  "degreeLevel": "B.Sc.",
// 		  "degreeSemester": "3",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "Lukas Zimmermann",
// 		  "picture": "",
// 		  "department": "Software Development",
// 		  "role": "Member",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Information Systems",
// 		  "degreeLevel": "M.Sc.",
// 		  "degreeSemester": "3",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  },
// 	  {
// 		  "name": "Mo Salah",
// 		  "picture": "",
// 		  "department": "Software Development",
// 		  "role": "Member",
// 		  "description": "Hollywood star",
// 		  "degreeName": "Information Systems",
// 		  "degreeLevel": "M.Sc.",
// 		  "degreeSemester": "3",
// 		  "university": "TUM",
// 		  "joinedBatch": "2022-01-01T00:00:00",
// 		  "nationality": "International",
// 		  "currentJob": "",
// 		  "involvedProjects": [],
// 		  "previousDepartments": [],
// 		  "socialNetworks": []
// 	  }
//   ]
