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
              class="dropdown-item" @click="selectLink(link)">
              <span>{{ link.easyLinkURI }}</span>
            </li>
          </ul>
        </div>
      </div>
  
      <div :style="{ backgroundColor: bgColor }" class="mx-auto mt-16 mb-16 flex items-center justify-center w-full lg:max-w-[230px] max-w-[200px] lg:h-[460px] h-[400px] p-3 rounded-3xl relative">
        <img class="absolute z-10 pointer-events-none select-none" src="~/assets/images/mobile-case.png" alt="Mobile Case">
  
        <div class="w-full h-full absolute lg:max-w-[225px] max-w-[195px] rounded-3xl z-0" />
  
        <div class="h-full mx-auto w-full overflow-auto z-10">
          <img v-if="userStore.currentEasyLink?.images" class="rounded-full min-w-[60px] w-[60px] mx-auto mt-8" :src="userStore.currentEasyLink?.images.logo" alt="Selected Link Image">
  
          <div :style="{ color: andetColor }" class="text-center text-sm font-semibold mt-4 break-words">
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
  const selectedLink = ref(userStore.currentEasyLink?.easyLinkURI || 'Select a Link');
  
  const bgColor = ref(userStore.currentEasyLink?.bgColor || '#ffffff');
  const textColor = ref(userStore.currentEasyLink?.textColor || '#000000');
  const buttonColor = ref(userStore.currentEasyLink?.buttonColor || '#000000');
  const andetColor = ref(userStore.currentEasyLink?.andetColor || '#000000');
  
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
  