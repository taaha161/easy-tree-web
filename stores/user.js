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
  bgColor: "#ffffff",
  textColor: "#000000",
  andetColor: "#ffffff",
  buttonColor: "#000000",
  allEasyLinks: null,
  allLinks: null,
  isMobile: false,
  refreshToken: "",
  accessToken: "",
  facebook: "",
  instagram: "",
  linkedIn : "",
  tikTok: "",
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
        const { data, error } = await useFetch('https://scan.easyrate.dk/user/login', {
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
    decimalToHex(decimal) {
      // Convert decimal to hexadecimal string
      let hex = decimal.toString(16).toLowerCase();
  
      // Pad with leading zeros if necessary to ensure it's six digits
      while (hex.length < 6) {
          hex = '0' + hex;
      }
  
      // Append '#' at the start
      return '#' + hex;
  },

    async logout() {
      await useFetch('https://scan.easyrate.dk/user/logout', {
        method: 'POST',
        body: { refreshToken: this.refreshToken },
      });

      this.resetState();
    },

    async refreshUser() {
      const { data } = await useFetch('https://scan.easyrate.dk/user/refresh', {
        method: 'POST',
        body: { refreshToken: this.refreshToken },
      });

      this.refreshToken = data.value.refreshToken;
      this.accessToken = data.value.accessToken;
    },

    updateCurrentLink(easyLink){
      this.currentEasyLink = easyLink;
    },
    updateColors(easyLink){
      this.bgColor =   this.decimalToHex(easyLink.bgColor); 
      this.textColor = this.decimalToHex(easyLink.textColor);
      this.andetColor = this.decimalToHex(easyLink.andetColor);
      this.buttonColor =  this.decimalToHex(easyLink.buttonColor);   

    },

    async getAllLinks() {
      const { data } = await useFetch('https://scan.easyrate.dk/user/getEasylinks', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

      this.allEasyLinks = data.value.easylinks.map(link => ({
        ...link,
        bgColor: this.decimalToHex(link.bgColor),
        textColor: this.decimalToHex(link.textColor),
        buttonColor: this.decimalToHex(link.buttonColor),
        andetColor: this.decimalToHex(link.andetColor),
      }));
     
      this.allLinks = _.groupBy(data.value.links, 'easyLinkId');
    },

    async addLink(url, name, id) {
      await useFetch('https://scan.easyrate.dk/user/createLinks', {
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

    async updateColors (id, bgColor, textColor, andetColor, buttonColor){
      await useFetch('https://scan.easyrate.dk/user/updateEasylink', {
        method: 'PUT',
        body: { _id: id, bgColor : bgColor, textColor: textColor, andetColor: andetColor, buttonColor: buttonColor },
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });

    },

    async updateLink(id, desc) {
      await useFetch('https://scan.easyrate.dk/user/updateEasylink', {
        method: 'PUT',
        body: { _id: id, desc },
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
    },

    async deleteLink(_id) {
      await useFetch('https://scan.easyrate.dk/user/deleteLinks', {
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
