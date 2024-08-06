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

    async deleteImage(type, easyLinkId) {
      this.loading = true;
    
      try {
        const response = await useFetch('https://scan.easyrate.dk/user/deleteEasylinkImage', {
          method: 'DELETE',
          headers: {
           // 'Content-Type': 'application/json', // Set content type for JSON body
            Authorization: `Bearer ${this.accessToken}`
          },
          body: {
            type: type,
            easyLinkId: easyLinkId
          }
        });
    
        // if (!response.ok) {
        //   throw new Error(`Error: ${response.statusText}`);
        // }
    
        console.log('Image deleted successfully');
    
        // Optionally, you can handle the success case here, like updating local state
    
      } catch (e) {
        console.error('Error deleting previous image:', e.message || e);
        throw e;
      } finally {
        this.loading = false;
      }
    }
,    

    async uploadImage(type, easyLinkId, imageFile) {
      this.loading = true;
      const formData = new FormData();
      formData.append('type', type);
      formData.append('easyLinkId', easyLinkId);
      formData.append('image', imageFile);
    
      try {

        const response = await fetch('https://scan.easyrate.dk/user/upload', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
    
        // Construct the new image URL
        const mimeType = imageFile.type.split('/')[1];
        const newImageUrl = `https://scan.easyrate.dk/easylink-images/${easyLinkId}/${type}/${type}.${mimeType}`;
        console.log('New Image URL:', newImageUrl);
    
        // Update allEasyLinks
        const easyLinkIndex = this.allEasyLinks.findIndex(link => link._id === easyLinkId);
        if (easyLinkIndex !== -1) {
          // Use dynamic property names to correctly assign the image URL
          this.allEasyLinks[easyLinkIndex].images[type] = newImageUrl;
        }
    
        // Update currentEasyLink
        if (!this.currentEasyLink.images) {
          this.currentEasyLink.images = {};
        }
        // Use dynamic property names to correctly assign the image URL
        this.currentEasyLink.images[type] = newImageUrl;
    
      } catch (e) {
        console.error('Error uploading image:', e.message || e);
        throw e;
      } finally {
        this.loading = false;
      }
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
      try{
        console.log(id);
        console.log(name);
        console.log(url);
      await useFetch('https://scan.easyrate.dk/user/createLinks', {
        method: 'POST',
        body: [
          {
            easyLinkId: id,
            linkName: name,
            url: url,
            size : "small",
            placement : 0
          },
        ],
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });}catch(error){

        console.log(error);
      }
    },
    async addEasyLink(name, bgColor, textColor, buttonColor, andetColor) {
      console.log(easyLinkURI);
      console.log(bgColor);

      try{
      await useFetch('https://scan.easyrate.dk/user/createEasyLink', {
        method: 'POST',
        body: 
          {
            easyLinkURI: name,
            bgColor: bgColor,
        textColor: textColor,
        buttonColor:buttonColor,
        andetColor: andetColor,

          },
        
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });}
      catch(e){
        console.log(e);
      }
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
    async updateEasyLinkName(id, name) {
      await useFetch('https://scan.easyrate.dk/user/updateEasylink', {
        method: 'PUT',
        body: { _id: id, easyLinkURI: name },
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
    },
    async deleteEasyLink(_id) {
      await useFetch('https://scan.easyrate.dk/user/deleteEasylink', {
        method: 'DELETE',
        body: [{ _id }],
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
