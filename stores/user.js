import _, { method } from "lodash";
import axios from "~~/plugins/axios";
import { defineStore } from "pinia";

const $axios = axios().provide.axios;

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

    // async getTokens() {
    //   await $axios.get('/sanctum/csrf-cookie')
    // },

    // async register(name, email, password, confirmPassword) {
    //   await $axios.post('/register', {
    //     name: name,
    //     email: email,
    //     password: password,
    //     password_confirmation: confirmPassword
    //   })
    // },

    async login(email, password) {
      this.loading = true; // Set loading to true
      try {
        const res = await useFetch("/user/login",
          {
          email: email,
          password: password,
        });
        this.refreshToken = res.data.refreshToken;
        this.accessToken = res.data.accessToken;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false; // Set loading to false
      }
    },

    async logout() {
      await $axios.post("/user/logout", {
        refreshToken: this.refreshToken,
      });
      this.resetState();
    },

    async refreshUser() {
      let res = await $axios.post("/user/refresh", {
        refreshToken: this.refreshToken,
      });
      this.refreshToken = res.data.refreshToken;
      this.accessToken = res.data.accessToken;
    },
    updateCurrentLink(easyLink){
      this.currentEasyLink = easyLink;
    },

    // async getUser() {
    //   let res = await $axios.get('/api/users')

    //   this.id = res.data.id
    //   this.theme_id = res.data.theme_id
    //   this.name = res.data.name
    //   this.bio = res.data.bio
    //   this.image = res.data.image

    //   this.getUserTheme()
    // },

    // getUserTheme() {
    //   this.colors.forEach(color => {
    //     if (this.theme_id === color.id) {
    //       this.theme = color
    //     }
    //   })
    // },

    // async updateUserImage(data) {
    //   await $axios.post('/api/user-image', data)
    // },

    // async updateLinkImage(data) {
    //   await $axios.post(`/api/link-image`, data)
    // },

    // async updateUserDetails(name, bio) {
    //   await $axios.patch(`/api/users/${this.id}`, {
    //     name: name,
    //     bio: bio
    //   })
    // },

    // async updateTheme(themeId) {
    //   let res = await $axios.patch('/api/themes', {
    //     theme_id: themeId,
    //   })
    //   this.theme_id = res.data.theme_id
    //   this.getUserTheme()
    // },

    async getAllLinks() {
      let res = await $axios.get("/user/getEasylinks", {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
      this.allEasyLinks = res.data.easylinks;
      this.allLinks = _.groupBy(res.data.links, "easyLinkId");
    },

    async addLink(url, name, id) {
      await $axios.post(
        "/user/createLinks",

        [{
          easyLinkId: id,
          linkName: name,
          url: url
        },],
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      );
    },

    async updateLink(id, desc) {
      await $axios.put(
        `/user/updateEasylink`,
        { _id: id, desc },
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      );
    },

    async deleteLink(_id) {
      await $axios.delete(`/user/deleteLinks`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        data: [{ _id }],
      });
      // await $axios.delete(`/user/deleteEasylink`, {
      //   headers: { Authorization: `Bearer ${this.accessToken}` },
      //   data: [{ _id }],
      // });
    },

    resetState() {
      _.merge(this, initialState);
    },
  },
  persist: true,
});
