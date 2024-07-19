<template>
    <div
        class="md:block hidden fixed right-0 lg:w-[500px] w-[310px] h-[calc(100%-20px)] mt-[20px] mx-auto border-l border-l-gray-300 pt-20 overflow-auto">
        <div>
            <button @click="toggleDropdown"
                class="flex items-center justify-center w-full py-2 rounded-full text-white font-semibold bg-[#8228D9] hover:bg-[#6c21b3]"
                :class="userStore.isMobile ? 'mt-6 text-lg' : 'mt-8 md:mt-6'">
                <span>{{ selectedLink || (userStore.isMobile ? 'Select a link' : 'Select a link') }}</span>
            </button>

            <div v-if="showDropdown" class="mt-2 bg-white rounded shadow-lg">
                <ul>
                    <li v-for="link in userStore.allEasyLinks" :key="link.id"
                        class="p-2 border-b border-gray-200 cursor-pointer" @click="selectLink(link)">
                        <span class="text-blue-500 hover:underline">{{ link.easyLinkURI }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="
                mx-auto
                mt-16
                mb-16
                flex 
                items-center 
                justify-center 
                w-full 
                lg:max-w-[230px] 
                max-w-[200px] 
                lg:h-[460px] 
                h-[400px] 
                p-3 
                rounded-3xl
                relative
            ">
            <img class="absolute z-10 pointer-events-none select-none" src="~/assets/images/mobile-case.png">

            <div class="w-full h-full absolute lg:max-w-[2250px] max-w-[195px] rounded-3xl z-0" />

            <div class="h-full mx-auto w-full overflow-auto z-10">
                <img class="rounded-full min-w-[60px] w-[60px] mx-auto mt-8">

                <div class="text-center text-sm font-semibold mt-4 break-words">
                    <span>{{ selectedLink || (userStore.isMobile ? 'Select a link' : 'Select a link') }}</span>
                </div>

                <div class="text-center text-[8px] font-semibold mt-2">
                    <div class="px-8 break-words">
                    </div>
                </div>

                <div class="mt-4  max-w-[180px] mx-auto">
                    <template v-if="currentLinks.length === 0">
                        <p class="text-center text-gray-500">No links found.</p>
                    </template>
                    <template v-else>
                        <div v-for="easyLink in currentLinks" :key="easyLink.id"
                            class="bg-white border rounded-xl p-2 mt-2 hover:bg-gray-100">
                            <a :href="easyLink.url" target="_blank"
                                class="block text-center py-2 px-4 truncate">{{ easyLink.linkName }}</a>
                        </div>
                    </template>
                </div>

                <div class="pb-12" />
            </div>
        </div>
    </div>
</template>

<script setup>

import { useUserStore } from '~~/stores/user'
const userStore = useUserStore()
const showDropdown = ref(false);
const selectedLink = ref(userStore.currentEasyLink || '');

const currentLinks = computed(() => {
    const selectedLinkId = userStore.currentEasyLink ? userStore.currentEasyLink._id : null;
    return selectedLinkId ? userStore.allLinks[selectedLinkId] || [] : [];
});


function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
}
function selectLink(link) {
    selectedLink.value = link.easyLinkURI;
    userStore.updateCurrentLink(link);
    showDropdown.value = false;

}

</script>
