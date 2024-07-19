import _ from "lodash";
import { defineStore } from "pinia";

const initialState = {
  id: "",
  theme_id: "",
  name: "",
  email: "",
  image: "",
  bio: "",
  theme: null,
  colors: null,
  allEasyLinks: null,
  allLinks: null,
  isMobile: false,
  refreshToken: "",
  accessToken: "",
  updatedLinkId: 0,
  addLinkOverlay: false,
  isPreviewOverlay: false,
  currentEasyLink: null,
  loading: false, // Added loading state
};

export const useUserStore = defineStore("user", {
  state: () => initialState,
  actions: {
    hidePageOverflow(val, id) {
      if (val) {
        document.body.style.overflow = "hidden";
        if (id) {
          document.getElementById(id).style.overflow = "hidden";
        }
        return;
      }
      document.body.style.overflow = "visible";
      if (id) {
        document.getElementById(id).style.overflow = "visible";
      }
    },

    allLowerCaseNoCaps(str) {
      return str.split(" ").join("").toLowerCase();
    },

    async hasSessionExpired() {
      await $axios.interceptors.response.use(
        (response) => {
          // Call was successful, continue.
          return response;
        },
        (error) => {
          switch (error.response.status) {
            case 401: // Not logged in
            case 419:
              this.refreshUser(); // Session expired
            case 503: // Down for maintenance
              // Bounce the user to the login screen with a redirect back
              this.resetState();
              window.location.href = "/";
              break;
            case 500:
              alert("Oops, something went wrong!  The team has been notified.");
              break;
            default:
              // Allow individual requests to handle other errors
              return Promise.reject(error);
          }
        }
      );
    },

    async login(email, password) {
      this.loading = true; // Set loading to true
      try {
        const { data, error } = await useFetch('/user/login', {
          method: 'POST',
          body: { email, password },
        });

        if (error.value) {
          throw error.value;
        }

        this.refreshToken = data.value.refreshToken;
        this.accessToken = data.value.accessToken;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false; // Set loading to false
      }
    },

    async logout() {
      await useFetch('/user/logout', {
        method: 'POST',
        body: { refreshToken: this.refreshToken },
      });

      this.resetState();
    },

    async refreshUser() {
      const { data } = await useFetch('/user/refresh', {
        method: 'POST',
        body: { refreshToken: this.refreshToken },
      });

      this.refreshToken = data.value.refreshToken;
      this.accessToken = data.value.accessToken;
    },

    updateCurrentLink(easyLink){
      this.currentEasyLink = easyLink;
    },

    async getAllLinks() {
      const { data } = await useFetch('/user/getEasylinks', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      this.allEasyLinks = data.value.easylinks;
      this.allLinks = _.groupBy(data.value.links, 'easyLinkId');
    },

    async addLink(url, name, id) {
      await useFetch('/user/createLinks', {
        method: 'POST',
        body: [
          {
            easyLinkId: id,
            linkName: name,
            url: url,
          },
        ],
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
    },

    async updateLink(id, desc) {
      await useFetch('/user/updateEasylink', {
        method: 'PUT',
        body: { _id: id, desc },
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
    },

    async deleteLink(_id) {
      await useFetch('/user/deleteLinks', {
        method: 'DELETE',
        body: [{ _id }],
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
    },

    resetState() {
      _.merge(this, initialState);
    },
  },
  persist: true,
});
