import axios from "axios";
import { makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
import { RootModel } from "./root";

export class ProfilesModel {
  root: RootModel;
  profiles = [];
  filteredProfiles = [];
  filter: any = {};
  search = "";
  sortBy = "";

  constructor(root: RootModel) {
    this.root = root;
    makeAutoObservable(this);
  }

  getProfiles() {
    return this.profiles;
  }

  setProfiles(profiles: any[]) {
    this.profiles = profiles;
  }

  findProfile(id: string) {
    return this.profiles.find((profile) => profile.id === id);
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
          return profileA[this.sortBy] - profileB[this.sortBy];
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
    const profiles = await axios
      .get("/profiles/")
      .then((res) => res.data.data)
      .catch((err) => {
        toast.error(err);
      });

    if (profiles) {
      this.profiles = profiles;
      this.filteredProfiles = profiles;
    }
  }
}
