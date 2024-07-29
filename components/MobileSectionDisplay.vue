<template>
  <div class="md:block hidden fixed right-0 lg:w-[500px] w-[310px] h-[calc(100%-20px)] mt-[20px] mx-auto border-l border-l-gray-300 pt-20 overflow-auto">
    <div>
      <button @click="toggleDropdown"
        class="flex items-center justify-center w-full py-2 rounded-full text-white font-semibold"
        :class="['bg-[#8228D9]', 'hover:bg-[#6c21b3]', userStore.isMobile ? 'mt-6 text-lg' : 'mt-8 md:mt-6']">
        <span>{{ selectedLink || 'Select a link' }}</span>
      </button>

      <div v-if="showDropdown" class="dropdown-menu mt-2 bg-white rounded-lg shadow-lg">
        <ul class="list-none p-0 m-0">
          <li v-for="link in userStore.allEasyLinks" :key="link.id"
            class="dropdown-item flex justify-between items-center" @click="selectLink(link)">
            <span>{{ link.easyLinkURI }}</span>
            <div class="flex gap-2">
              <button @click.stop="deleteLink(link)" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </li>
        </ul>
        <button @click="toggleAddLinkForm" class="w-full text-blue-600 hover:text-blue-800 py-2 mt-2">
          Add New Link
        </button>
      </div>

      <div v-if="showAddLinkForm" class="add-link-form mt-2 bg-white rounded-lg shadow-lg p-4">
        <form @submit.prevent="addLink">
          <div class="mb-2">
            <label for="easyLinkURI" class="block text-sm font-medium text-gray-700">Link URI</label>
            <input v-model="newLink.easyLinkURI" type="text" id="easyLinkURI" class="mt-1 p-2 border w-full rounded-md" required>
          </div>
          <div class="mb-2">
            <label for="bgColor" class="block text-sm font-medium text-gray-700">Background Color</label>
            <input v-model="newLink.bgColor" type="color" id="bgColor" class="mt-1 p-2 border w-full rounded-md">
          </div>
          <div class="mb-2">
            <label for="textColor" class="block text-sm font-medium text-gray-700">Text Color</label>
            <input v-model="newLink.textColor" type="color" id="textColor" class="mt-1 p-2 border w-full rounded-md">
          </div>
          <div class="mb-2">
            <label for="buttonColor" class="block text-sm font-medium text-gray-700">Button Color</label>
            <input v-model="newLink.buttonColor" type="color" id="buttonColor" class="mt-1 p-2 border w-full rounded-md">
          </div>
          <div class="mb-2">
            <label for="andetColor" class="block text-sm font-medium text-gray-700">Andet Color</label>
            <input v-model="newLink.andetColor" type="color" id="andetColor" class="mt-1 p-2 border w-full rounded-md">
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800">Add Link</button>
          </div>
        </form>
      </div>
    </div>

    <div :style="{ backgroundColor: bgColor }" class="mx-auto mt-16 mb-16 flex items-center justify-center w-full lg:max-w-[230px] max-w-[200px] lg:h-[460px] h-[400px] p-3 rounded-3xl relative">
      <img class="absolute z-10 pointer-events-none select-none" src="~/assets/images/mobile-case.png" alt="Mobile Case">

      <div class="w-full h-full absolute lg:max-w-[225px] max-w-[195px] rounded-3xl z-0" />

      <div class="h-full mx-auto w-full overflow-auto z-10">
        <img v-if="userStore.currentEasyLink?.images" class="rounded-full min-w-[60px] w-[60px] mx-auto mt-8" :src="userStore.currentEasyLink?.images.logo" alt="Selected Link Image">

        <div :style="{ color: textColor }" class="text-center text-sm font-semibold mt-4 break-words">
          <span>{{ selectedLink || 'Select a link' }}</span>
        </div>

        <div class="text-center text-[8px] font-semibold mt-2">
          <div class="px-8 break-words">
          </div>
        </div>

        <div class="mt-4 max-w-[180px] mx-auto">
          <template v-if="currentLinks.length === 0">
            <p class="text-center text-gray-500">No links found.</p>
          </template>
          <template v-else>
            <div v-for="easyLink in currentLinks" :key="easyLink.id"
              :style="{ backgroundColor: buttonColor, color: textColor }"
              class="border rounded-xl p-2 mt-2 hover:bg-gray-100">
              <a :href="easyLink.url" target="_blank"
                :style="{ color: textColor }"
                class="block text-center text-xs py-2 px-4 truncate">{{ easyLink.linkName }}</a>
            </div>
          </template>

          <div class="mt-6 flex justify-center space-x-4">
            <a v-if="userStore.currentEasyLink?.facebook" :href="userStore.currentEasyLink.facebook" target="_blank" class="icon-button">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a v-if="userStore.currentEasyLink?.instagram" :href="userStore.currentEasyLink.instagram" target="_blank" class="icon-button">
              <i class="fab fa-instagram"></i>
            </a>
            <a v-if="userStore.currentEasyLink?.tiktok" :href="userStore.currentEasyLink.tiktok" target="_blank" class="icon-button">
              <i class="fab fa-tiktok"></i>
            </a>
            <a v-if="userStore.currentEasyLink?.linkedin" :href="userStore.currentEasyLink.linkedin" target="_blank" class="icon-button">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div class="pb-12" />
      </div>
    </div>
  </div>
</template>

<script setup>
import '@fortawesome/fontawesome-free/css/all.css';

import { ref, watch, computed } from 'vue';
import { useUserStore } from '~~/stores/user';

const userStore = useUserStore();
const showDropdown = ref(false);
const showAddLinkForm = ref(false);
const selectedLink = ref(userStore.currentEasyLink?.easyLinkURI || 'Select a Link');

const bgColor = ref(userStore.currentEasyLink?.bgColor || '#ffffff');
const textColor = ref(userStore.currentEasyLink?.textColor || '#000000');
const buttonColor = ref(userStore.currentEasyLink?.buttonColor || '#000000');
const andetColor = ref(userStore.currentEasyLink?.andetColor || '#000000');

const newLink = ref({
  easyLinkURI: '',
  bgColor: '#ffffff',
  textColor: '#000000',
  buttonColor: '#000000',
  andetColor: '#000000'
});

const currentLinks = computed(() => {
  const selectedLinkId = userStore.currentEasyLink ? userStore.currentEasyLink._id : null;
  return selectedLinkId ? userStore.allLinks[selectedLinkId] || [] : [];
});

watch(
  () => userStore.currentEasyLink?.bgColor,
  (newColor) => {
    bgColor.value = newColor || '#ffffff';
  }
);

watch(
  () => userStore.currentEasyLink?.textColor,
  (newColor) => {
    textColor.value = newColor || '#000000';
  }
);

watch(
  () => userStore.currentEasyLink?.buttonColor,
  (newColor) => {
    buttonColor.value = newColor || '#000000';
  }
);

watch(
  () => userStore.currentEasyLink?.andetColor,
  (newColor) => {
    andetColor.value = newColor || '#000000';
  }
);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function toggleAddLinkForm() {
  showAddLinkForm.value = !showAddLinkForm.value;
}

function selectLink(link) {
  selectedLink.value = link.easyLinkURI;
  userStore.updateCurrentLink(link);

  // Update colors based on selected link
  bgColor.value = userStore.currentEasyLink.bgColor || '#ffffff';
  textColor.value = userStore.currentEasyLink.textColor || '#000000';
  buttonColor.value = userStore.currentEasyLink.buttonColor || '#000000';
  andetColor.value = userStore.currentEasyLink.andetColor || '#000000';

  showDropdown.value = false;
}

async function editLink(link) {
  const newEasyLinkURI = prompt("Edit link name:", link.easyLinkURI);
  if (newEasyLinkURI) {
    link.easyLinkURI = newEasyLinkURI;
    await userStore.updateEasyLinkName(link._id, newEasyLinkURI);
  }
}
const hexToDecimal = (hex) => {
    return hex ? parseInt(hex.replace('#', ''), 16) : 0;
  };

async function deleteLink(link) {
  if (confirm("Are you sure you want to delete this link?")) {
    await userStore.deleteEasyLink(link._id);
    userStore.allEasyLinks = userStore.allEasyLinks.filter(item => item._id !== link._id);
    if (link._id === userStore.currentEasyLink?._id) {
      userStore.updateCurrentLink(null);
      selectedLink.value = 'Select a Link';
    }
  }
}
async function addLink() {
  try {
    const { easyLinkURI, bgColor, textColor, buttonColor, andetColor } = newLink.value;

    await userStore.addEasyLink(
      easyLinkURI,
      hexToDecimal(bgColor),
      hexToDecimal(textColor),
      hexToDecimal(buttonColor),
      hexToDecimal(andetColor)
    );

    newLink.value = {
      easyLinkURI: '',
      bgColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#000000',
      andetColor: '#000000'
    };

    showAddLinkForm.value = false;
    await userStore.getAllLinks();
    showDropdown.value = true;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request data:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
  }
}

</script>

<style scoped>
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f3f4f6;
  border-radius: 50%;
  color: #000000;
  font-size: 1.25rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.icon-button:hover {
  background-color: #e5e7eb;
  color: #1d4ed8;
}

.dropdown-menu {
  max-height: 300px; /* Adjust height if needed */
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #1e40af;
}

.dropdown-item span {
  color: #1d4ed8;
  font-weight: 500;
}
</style>
