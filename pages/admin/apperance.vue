<template>
  <AdminLayout>
    <div id="AppearancePage" class="flex h-[calc(100%-50px)] pb-4">
      <div class="lg:w-[calc(100%-500px)] md:w-[calc(100%-330px)] w-full md:pt-20 pt-14">
        <div class="max-w-[750px] mx-auto pb-24">
          <div id="ThemeSection">
            <div class="font-semibold pb-4" :class="userStore.isMobile ? 'mt-8 text-2xl' : 'mt-20 md:mt-8 text-xl'">
              Choose Colors
            </div>
            <div class="w-full bg-white rounded-3xl p-6 shadow-lg">
              <div class="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Background Color</label>
                  <div class="flex items-center">
                    <input type="color" v-model="bgColor" class="color-input" />
                    <input type="text" v-model="bgColor" class="color-text-input" />
                  </div>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Text Color</label>
                  <div class="flex items-center">
                    <input type="color" v-model="textColor" class="color-input" />
                    <input type="text" v-model="textColor" class="color-text-input" />
                  </div>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Button Color</label>
                  <div class="flex items-center">
                    <input type="color" v-model="buttonColor" class="color-input" />
                    <input type="text" v-model="buttonColor" class="color-text-input" />
                  </div>
                </div>
                <div>
                  <label class="block text-gray-700 text-sm font-bold mb-2">Andet Color</label>
                  <div class="flex items-center">
                    <input type="color" v-model="andetColor" class="color-input" />
                    <input type="text" v-model="andetColor" class="color-text-input" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="ImageUploadSection" class="mt-12">
            <div class="font-semibold pb-4 text-2xl">Upload Images</div>
            <div class="w-full bg-white rounded-3xl p-6 shadow-lg">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Upload Logo</label>
                <input type="file" @change="onImageChange('logo', $event)" accept="image/*" />
                <div v-if="logoImage">
                  <img :src="logoImage" alt="Logo" class="mt-4 w-32 h-32 object-cover" />
                  <button @click="deleteImageLogo('logo')" class="mt-2 text-red-600 hover:text-red-800">
                    Delete Logo
                  </button>
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Upload Background</label>
                <input type="file" @change="onImageChange('background', $event)" accept="image/*" />
                <div v-if="backgroundImage">
                  <img :src="backgroundImage" alt="Background" class="mt-4 w-32 h-32 object-cover" />
                  <button @click="deleteImageBackground('background')" class="mt-2 text-red-600 hover:text-red-800">
                    Delete Background
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full mt-8">
            <button @click="saveEasyLink" class="flex items-center justify-center w-full py-3 rounded-full text-white font-semibold bg-[#8228D9] hover:bg-[#6c21b3]">
              Save Easy Link
            </button>
          </div>
          <div v-if="successMessage" class="mt-4 p-4 bg-green-100 text-green-800 rounded">
            {{ successMessage }}
          </div>
        </div>
      </div>
      <MobileSectionDisplay />
    </div>
  </AdminLayout>
</template>
<script setup>
import { ref, watch } from 'vue';
import AdminLayout from '~~/layouts/AdminLayout.vue';
import { useUserStore } from '~~/stores/user';

const userStore = useUserStore();
const successMessage = ref('');
const bgColor = ref(userStore.currentEasyLink?.bgColor || '#ffffff');
const textColor = ref(userStore.currentEasyLink?.textColor || '#000000');
const buttonColor = ref(userStore.currentEasyLink?.buttonColor || '#000000');
const andetColor = ref(userStore.currentEasyLink?.andetColor || '#000000');
const logoImage = ref(userStore.currentEasyLink?.images?.logo || "");
const backgroundImage = ref(userStore.currentEasyLink?.images?.background || "");

const hexToDecimal = (hex) => {
  return hex ? parseInt(hex.replace('#', ''), 16) : 0;
};

watch(bgColor, (newColor) => {
  userStore.currentEasyLink.bgColor = newColor;
});

watch(textColor, (newColor) => {
  userStore.currentEasyLink.textColor = newColor;
});

watch(buttonColor, (newColor) => {
  userStore.currentEasyLink.buttonColor = newColor;
});

watch(andetColor, (newColor) => {
  userStore.currentEasyLink.andetColor = newColor;
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

watch(
  () => userStore.currentEasyLink?.images?.logo,
  (newLogo) => {
    logoImage.value = newLogo || "";
  }
);


watch(
  () => userStore.currentEasyLink?.images?.background,
  (newBackground) => {
    console.log(newBackground);
    backgroundImage.value = newBackground || "";
  }
);

async function saveEasyLink() {
  const bgColorDecimal = hexToDecimal(bgColor.value);
  const textColorDecimal = hexToDecimal(textColor.value);
  const buttonColorDecimal = hexToDecimal(buttonColor.value);
  const andetColorDecimal = hexToDecimal(andetColor.value);

  try {
    await userStore.updateColors(
      userStore.currentEasyLink._id,
      bgColorDecimal,
      textColorDecimal,
      buttonColorDecimal,
      andetColorDecimal
    );
    successMessage.value = 'Colors updated successfully!';
    setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
  } catch (error) {
    console.error('Error updating colors:', error);
    successMessage.value = 'Error updating colors. Please try again.';
    setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
  }
}

const onImageChange = async (type, event) => {
  const file = event.target.files[0];
  if (file) {
    try {

        console.log("Previous image deleted");
        await userStore.deleteImage(type, userStore.currentEasyLink._id);
    
      await userStore.uploadImage(type, userStore.currentEasyLink._id, file);
      successMessage.value = `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully!`;
    } catch (error) {
      console.error('Error uploading image:', error);
      successMessage.value = `Error uploading ${type} image. Please try again.`;
    }
    setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
  }
};

async function deleteImageLogo(type) {
  try {
    console.log(type);
    await userStore.deleteImage("logo", userStore.currentEasyLink._id);
    successMessage.value = `${type.charAt(0).toUpperCase() + type.slice(1)} image deleted successfully!`;
    // Clear the image URL from the store
    userStore.currentEasyLink.images.logo = '';
  } catch (error) {
    userStore.currentEasyLink.images.logo = '';
    console.error('Error deleting image:', error);
    successMessage.value = `Error deleting ${type} image. Please try again.`;
  }
  setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
}
async function deleteImageBackground(type) {
  try {
    console.log(type);
    await userStore.deleteImage("background", userStore.currentEasyLink._id);
    successMessage.value = `${type.charAt(0).toUpperCase() + type.slice(1)} image deleted successfully!`;
    // Clear the image URL from the store
    userStore.currentEasyLink.images.background = '';
  } catch (error) {
    userStore.currentEasyLink.images.background = '';
    console.error('Error deleting image:', error);
    successMessage.value = `Error deleting ${type} image. Please try again.`;
  }
  setTimeout(() => successMessage.value = '', 3000); // Clear message after 3 seconds
}
</script>


<style scoped>
.color-input {
  width: 3rem;
  height: 3rem;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
}

.color-text-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db; /* Tailwind's border-gray-300 */
  border-radius: 0.375rem;
  background-color: #f9fafb; /* Tailwind's bg-gray-50 */
  color: #374151; /* Tailwind's text-gray-700 */
  font-size: 0.875rem; /* Tailwind's text-sm */
}
</style>
