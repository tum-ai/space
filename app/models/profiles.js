import { makeAutoObservable } from "mobx";

export class ProfilesModel {
  root;
  profiles = [];
  filteredProfiles = [];
  filter = {};
  search = "";
  sortBy = "";

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);

    this.fetchProfiles();
  }

  getProfiles() {
    return this.profiles;
  }

  findProfile(id) {
    return this.profiles.find((profile) => profile.id === id);
  }

  setProfiles(profiles) {
    this.profiles = profiles;
  }

  getRoles() {
    const rolesSet = new Set(this.profiles.map((profile) => profile.role));
    return Array.from(rolesSet);
  }

  setFilter(key, value) {
    if (!value) {
      delete this.filter[key];
    } else {
      this.filter[key] = value;
    }
    this.filterProfiles();
  }

  resetFilters() {
    this.filter = {};
    this.filterProfiles();
  }

  filterProfiles() {
    this.filteredProfiles = this.profiles.filter((profile) => {
      for (const key in this.filter) {
        if (key == "role") {
          if (
            !this.root.rolesModel.roleHolderships[profile.id]?.includes(
              this.filter[key],
            )
          ) {
            return false;
          }
        } else if (this.filter[key] && profile[key] != this.filter[key]) {
          return false;
        }
      }
      return (
        !this.search ||
        JSON.stringify({ ...profile, _id: "" })
          .toLocaleLowerCase()
          .includes(this.search.toLocaleLowerCase())
      );
    });
    this.sortProfiles();
  }

  sortProfiles() {
    if (this.sortBy) {
      this.filteredProfiles = this.filteredProfiles.sort(
        (profileA, profileB) => {
          return profileA[this.sortBy] > profileB[this.sortBy];
        },
      );
    }
  }

  setSearch(value) {
    this.search = value;
    this.filterProfiles();
  }

  setSortBy(value) {
    this.sortBy = value;
    this.sortProfiles();
  }

  async fetchProfiles() {
    const profiles = await this.root.GET("/profiles/");
    this.profiles = profiles;
    this.filteredProfiles = profiles;
  }
}

// var mockData =
// [
// 	{
// 		  "name": "Max Mustermann",
// 		  "picture":
// 			  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
// 		  "department": "Industry",
// 		  "role": "Profile",
// 		  "description": "",
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
// 		  "role": "Profile",
// 		  "description": "",
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
// 		  "role": "Profile",
// 		  "description": "",
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
// 		  "description": "",
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
// 		  "role": "Profile",
// 		  "description": "",
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
// 		  "description": "",
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
// 		  "role": "Profile",
// 		  "description": "",
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
// 		  "role": "Profile",
// 		  "description": "",
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
