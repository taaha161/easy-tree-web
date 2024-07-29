<template>
  <div :id="`LinkBox${link._id}`" class="w-full bg-white rounded-3xl px-8 py-5 flex flex-col gap-2">
    <div>
      <!-- Link URL Section -->
      <div class="flex items-center justify-between py-1">
        <div class="flex items-center w-full">
          <div v-if="isEditingLink" class="flex items-center justify-between gap-2">
            <input :id="`editLinkInput-${link._id}`" type="text" v-model="linkUrl"
              class="w-full text-sm focus:outline-none" />
            <Icon v-if="!isLoading" @click="updateLinkOnClick" class="cursor-pointer min-w-[17px]"
              :class="isMobile ? 'min-w-[23px]' : 'min-w-[17px]'" name="octicon:check"
              :size="isMobile ? '23' : '17'" color="#676B5F" />
            <span v-else class="loader"></span>
          </div>
          <div v-else class="flex items-center w-[calc(100%-2px)]">
            <div @click="startEditingLink" class="mr-2 truncate cursor-pointer" :class="isMobile ? 'text-lg' : 'text-sm'">
              {{ link.url }}
            </div>
            <Icon @click="startEditingLink" class="cursor-pointer min-w-[17px]"
              :class="isMobile ? 'min-w-[23px]' : 'min-w-[17px]'" name="octicon:pencil-24"
              :size="isMobile ? '23' : '17'" color="#676B5F" />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer and Delete Section -->
    <div id="FooterLinkDeleteSection" class="overflow-hidden" :class="[
      { 'max-h-[180px] transition-all duration-300 ease-in': isDelete },
      { 'max-h-0 transition-all duration-200 ease-out': !isDelete },
    ]">
      <button @click="isDelete = false" class="relative w-full bg-[#DFE2D9] py-1.5">
        <Icon name="mdi:close" class="absolute right-1 top-[6px] cursor-pointer" size="20" color="#45494A" />
        <div class="text-center text-sm font-bold text-[#45494A]">Delete</div>
      </button>
      <div class="flex items-center justify-center pt-3">
        Delete this forever?
      </div>
      <div class="w-full px-4 py-3">
        <div class="flex items-center gap-2 w-full">
          <button @click="deleteLink()"
            class="flex items-center border justify-center w-full py-3 rounded-full text-black font-semibold hover:bg-gray-100">
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Image Section -->
    <div id="FooterLinkBoxSection" class="overflow-hidden" :class="[
      { 'max-h-[180px] transition-all duration-300 ease-in': isUploadImage },
      { 'max-h-0 transition-all duration-200 ease-out': !isUploadImage },
    ]">
      <div class="relative w-full bg-[#DFE2D9] py-1.5">
        <Icon @click="isUploadImage = false" name="mdi:close" class="absolute right-1 top-[6px] cursor-pointer"
          size="20" color="#45494A" />
        <div class="text-center text-sm font-bold text-[#45494A]">
          Add Thumbnail
        </div>
      </div>
      <div class="w-full flex items-center justify-between px-4 py-5">
        <img class="rounded-lg w-[80px] aspect-square" :src="link.images?.logo" />
        <div class="w-full pl-3">
          <button @click="openCropper = true"
            class="flex items-center justify-center w-full py-3 rounded-full text-white font-semibold bg-[#8228D9] hover:bg-[#6c21b3] mb-2">
            Change
          </button>
        </div>
      </div>
    </div>

    <CropperModal v-if="openCropper" :linkId="link._id" @data="data = $event" @close="openCropper = false" />
  </div>
</template>

<script setup>
import _ from "lodash";
import { ref, computed, onMounted, watch, toRefs } from "vue";
import { useUserStore } from "~~/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { isMobile, updatedLinkId } = storeToRefs(userStore);

const props = defineProps({
  link: Object,
  selectedId: { type: String, default: "" },
  selectedStr: { type: String, default: "" },
});

const { link, selectedId, selectedStr } = toRefs(props);

const emit = defineEmits(["updatedInput"]);

let name = ref("");
let desc = ref("");
let data = ref(null);
let isDelete = ref(false);
let openCropper = ref(false);
let isUploadImage = ref(false);
let isEditingName = ref(false);
let isEditingLink = ref(false);
let linkUrl = ref("");
let linkName = ref("");
let isLoading = ref(false);

const subLinks = computed(() => _.get(userStore.allLinks, link.value._id, []));

onMounted(() => {
  name.value = link.value.name;
  desc.value = link.value.desc;
  linkUrl.value = link.value.url;
  linkName.value = link.value.linkName;

  document.addEventListener("mouseup", function (e) {
    let editNameInput = document.getElementById(`editNameInput-${link.value._id}`);
    if (editNameInput && !editNameInput.contains(e.target) && selectedStr.value === "isName" && link.value._id === selectedId.value) {
      editNameInput.blur();
      emit("updatedInput", { id: 0, str: "" });
    }
  });

  document.addEventListener("mouseup", function (e) {
    let editLinkInput = document.getElementById(`editLinkInput-${link.value._id}`);
    if (editLinkInput && !editLinkInput.contains(e.target) && selectedStr.value === "isLink" && link.value._id === selectedId.value) {
      editLinkInput.blur();
      emit("updatedInput", { id: 0, str: "" });
    }
  });
});

const startEditingName = () => {
  isEditingName.value = true;
  name.value = link.value.name;
  userStore.updatedLinkId = link.value._id;
};

const startEditingLink = () => {
  isEditingLink.value = true;
  linkUrl.value = link.value.url;
  userStore.updatedLinkId = link.value._id;
};

const removeLink = (linkId, easyLinkId) => {
  if (userStore.allLinks[easyLinkId]) {
    // Filter out the link with the specified linkId
    userStore.allLinks[easyLinkId] = userStore.allLinks[easyLinkId].filter(link => link._id !== linkId);

    // Optionally, remove the group if it becomes empty
    if (userStore.allLinks[easyLinkId].length === 0) {
      delete userStore.allLinks[easyLinkId];
    }
  }
};

const addLink = (newLink) => {
  const { easyLinkId } = newLink;

  // Check if the easyLinkId group already exists in allLinks
  if (!userStore.allLinks[easyLinkId]) {
    // If not, initialize it as an empty array
    userStore.allLinks[easyLinkId] = [];
  }

  // Add the new link to the appropriate group
  userStore.allLinks[easyLinkId].push(newLink);
};

const updateLinkOnClick = async () => {
  isLoading.value = true;
  try {
    removeLink(link.value._id, userStore.currentEasyLink._id);
    await userStore.deleteLink(link.value._id);

    const newLink = {
      _id: link.value._id,
      linkName: linkName.value,
      url: linkUrl.value,
      desc: desc.value,
      easyLinkId: userStore.currentEasyLink._id // Ensure this is the correct easyLinkId
    };

    addLink(newLink);
    await userStore.addLink(linkUrl.value, link.value.name, userStore.currentEasyLink._id);

    isEditingLink.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const updateLink = async () => {
  try {
    await userStore.updateLink(link.value._id, desc.value);
    await userStore.getAllLinks();
    emit('updatedInput', { id: '', str: '' });
  } catch (error) {
    console.log(error);
    errors.value = error.response.data.errors;
  }
};

const updateLinkImage = async () => {
  try {
    await userStore.updateLinkImage(data.value);
    await userStore.getAllLinks();
    setTimeout(() => (openCropper.value = false), 300);
  } catch (error) {
    console.log(error);
  }
};

const deleteLink = async () => {
  let res = confirm("Are you sure you want to delete this link?");
  try {
    if (res) {
      await userStore.deleteLink(link.value._id);
      await userStore.getAllLinks();
    }
  } catch (error) {
    console.log(error);
  }
};

watch(() => name.value, () => {
  if (name.value && name.value !== link.value.name) {
    updateLink();
  }
});

watch(() => selectedId.value, () => {
  if (selectedId.value) {
    if (selectedStr.value === "isName") {
      startEditingName();
    } else if (selectedStr.value === "isLink") {
      startEditingLink();
    }
  }
});

watch(() => selectedStr.value, () => {
  if (selectedStr.value) {
    if (selectedStr.value === "isName") {
      startEditingName();
    } else if (selectedStr.value === "isLink") {
      startEditingLink();
    }
  }
});

watch(() => updatedLinkId.value, (val) => {
  if (!val) {
    emit("updatedInput", { id: 0, str: "" });
  }
});

watch(() => data.value, async () => await updateLinkImage());
</script>


<style>
.loader {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #676B5F; /* Dark grey */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
