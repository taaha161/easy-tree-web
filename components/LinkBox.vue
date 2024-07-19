<template>
    <div :id="`LinkBox${link._id}`" class="w-full bg-white rounded-3xl px-8 py-5 flex flex-col gap-2">
        <div id="MainLinkBoxSection">
            <!-- <div class="flex items-center justify-between py-1">
                <div class="flex items-center w-full">
                    <input v-if="editName(selectedId, selectedStr)" :id="`editNameInput-${link._id}`" type="text"
                        v-model="name" maxlength="18" class="w-full text-sm font-semibold focus:outline-none" />
                    <div v-else class="flex items-center w-full gap-2">
                        <div @click="
                            name = link.header;
                        $emit('updatedInput', { id: link._id, str: 'isName' });
                        " class="font-semibold mr-2 cursor-pointer" :class="isMobile ? 'text-xl' : 'text-sm'">
                            {{ link.header }}
                        </div>
                        <Icon @click="$emit('updatedInput', { id: link._id, str: 'isName' })" class="cursor-pointer"
                            name="octicon:pencil-24" :size="isMobile ? '23' : '17'" color="#676B5F" />
                    </div>
                </div>
                <div class="flex items-center">
                    <Icon class="cursor-pointer" :class="isMobile ? 'min-w-[23px]' : 'min-w-[17px]'"
                        name="mdi:bell-outline" :size="isMobile ? '25' : '20'" color="#676B5F" />
                </div>
            </div> -->

            <div>
           {{ link.linkName }}
            </div>


            <div class="flex items-center justify-between py-1">
                <div class="flex items-center w-full">
                    <div v-if="editLink" class="flex items-center justify-between gap-2">
                        <input :id="`editLinkInput-${link._id}`" type="text" v-model="desc"
                            class="w-full text-sm focus:outline-none" />
                        <Icon @click="updateLinkOnClick" class="cursor-pointer min-w-[17px]"
                            :class="isMobile ? 'min-w-[23px]' : 'min-w-[17px]'" name="octicon:check"
                            :size="isMobile ? '23' : '17'" color="#676B5F" />
                    </div>
                    <div v-else class="flex items-center w-[calc(100%-2px)]">
                        <div @click="
                            desc = link.desc;
                        $emit('updatedInput', { id: link._id, str: 'isLink' });
                        " class="mr-2 truncate cursor-pointer" :class="isMobile ? 'text-lg' : 'text-sm'">
                            {{ link.url }}
                        </div>
                        <Icon @click="$emit('updatedInput', { id: link._id, str: 'isLink' })"
                            class="cursor-pointer min-w-[17px]" :class="isMobile ? 'min-w-[23px]' : 'min-w-[17px]'"
                            name="octicon:pencil-24" :size="isMobile ? '23' : '17'" color="#676B5F" />
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between py-1 mt-4">
                <div class="flex items-center w-full relative">
                    <div class="flex items-center px-1.5 py-[2px] absolute -left-[6px] rounded-md"
                        :class="isUploadImage ? 'bg-[#8228D9]' : 'hover:bg-gray-200'">
                        <Icon @click="editImage()" class="cursor-pointer" name="icon-park-twotone:collect-picture"
                            :size="isMobile ? '23' : '17'" :color="isUploadImage ? '#FFFFFF' : '#676B5F'" />
                    </div>
                </div>
                <div v-if="!isMobile" class="flex items-center">
                    <div class="flex items-center px-1.5 py-[2px] rounded-md relative">
                        <button @click="
                            isDelete = true;
                        isUploadImage = false;
                        " class="flex items-center px-1.5 py-[2px] absolute -right-[6px] rounded-md"
                            :class="isDelete ? 'bg-[#8228D9]' : 'hover:bg-gray-200'">
                            <Icon class="cursor-pointer" name="carbon:trash-can" size="20"
                                :color="isDelete ? '#FFFFFF' : '#676B5F'" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

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

        <!-- <div v-if="!_.isEmpty(subLinks)" id="SubLinksSection" class="w-full flex flex-col gap-2">
            <div @close="isLinkOpen = false" class="overflow-hidden border-t-2" :class="[
                { 'max-h-screen transition-all duration-300 ease-in': isLinkOpen },
                { 'max-h-0 transition-all duration-300 ease-out': !isLinkOpen },
            ]">
                <ul v-for="subLink in _.orderBy(subLinks, ['placement'], ['asc'])" class="mt-4">
                    <li>
                        <p>
                            <a class="text-[#8228D9] underline cursor-pointer truncate" :href="subLink.url"
                                target="_blank" rel="noopener noreferrer">{{ subLink.linkName }}</a>
                        </p>
                    </li>
                </ul>
            </div>

            <div class="flex items-center justify-center">
                <Icon class="rounded-md cursor-pointer" :class="isLinkOpen ? 'bg-[#8228D9]' : 'hover:bg-gray-200'"
                    :name="isLinkOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" @click="() => (isLinkOpen = !isLinkOpen)"
                    :size="isMobile ? '25' : '20'" :color="isLinkOpen ? '#FFFFFF' : '#676B5F'" />
            </div>
        </div> -->

        <CropperModal v-if="openCropper" :linkId="link._id" @data="data = $event" @close="openCropper = false" />
    </div>
</template>

<script setup>
import _ from "lodash";
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
let isLinkOpen = ref(false);
let subLinks = computed(() => _.get(userStore.allLinks, link.value._id, []));

onMounted(() => {
    name.value = link.value.name;
    desc.value = link.value.desc;

    document.addEventListener("mouseup", function (e) {
        let editNameInput = document.getElementById(
            `editNameInput-${link.value.id}`
        );
        if (
            editNameInput &&
            !editNameInput.contains(e.target) &&
            selectedStr.value == "isName" &&
            link.value.id == selectedId.value
        ) {
            editNameInput.blur();
            emit("updatedInput", { id: 0, str: "" });
        }
    });

    document.addEventListener("mouseup", function (e) {
        let editLinkInput = document.getElementById(
            `editLinkInput-${link.value.id}`
        );
        if (
            editLinkInput &&
            !editLinkInput.contains(e.target) &&
            selectedStr.value == "isLink" &&
            link.value.id == selectedId.value
        ) {
            editLinkInput.blur();
            emit("updatedInput", { id: 0, str: "" });
        }
    });
});

const updateLink = async () => {
    try {
        await userStore.updateLink(link.value._id, desc.value);
        await userStore.getAllLinks();
        emit('updatedInput', { id: '', str: '' });
    } catch (error) {
        console.log(error);
        errors.value = error.response.data.errors;
    }
}


const changeInput = (str, linkIdNameString) => {
    if (selectedId.value == link.value.id && selectedStr.value == str) {
        setTimeout(() => {
            document.getElementById(`${linkIdNameString}-${link.value.id}`).focus();
            return;
        }, 100);
    }
};

const editName = (selectedId, selectedStr) => {
    if (userStore.isMobile) {
        userStore.updatedLinkId = selectedId;
        return false;
    } else if (selectedId == link.value.id && selectedStr == "isName") {
        return true;
    }
    return false;
};

const editLink = computed(() => {
    if (userStore.isMobile) {
        userStore.updatedLinkId = selectedId.value;
        return false;
    } else if (selectedId.value === link.value._id && selectedStr.value === "isLink") {
        return true;
    }
    return false;
});


const editImage = () => {
    if (userStore.isMobile) {
        userStore.updatedLinkId = link.value.id;
    } else {
        isUploadImage.value = true;
        isDelete.value = false;
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

watch(
    () => name.value,
    () => {
        if (name.value && name.value !== link.value.name) {
            updateLink();
        }
    }
);

const updateLinkOnClick = () => {
    if (desc.value && desc.value !== link.value.desc) {
        updateLink();
    }
}

watch(
    () => selectedId.value,
    () => {
        if (selectedId.value) {
            changeInput("isName", "editNameInput");
            changeInput("isLink", "editLinkInput");
        }
    }
);

watch(
    () => selectedStr.value,
    () => {
        if (selectedStr.value) {
            changeInput("isName", "editNameInput");
            changeInput("isLink", "editLinkInput");
        }
    }
);

watch(
    () => updatedLinkId.value,
    (val) => {
        if (!val) {
            emit("updatedInput", { id: 0, str: "" });
        }
    }
);

watch(
    () => data.value,
    async () => await updateLinkImage()
);
</script>
