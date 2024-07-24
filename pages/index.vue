<template>
    <AuthLayout>
        <div class="mt-10">
            <h1 class="lg:text-5xl text-3xl text-center font-extrabold">
                Log in to your Linktree
            </h1>

            <form 
                class="mt-12" 
                @submit.prevent="login()"
            >
                <div>
                    <TextInput 
                        placeholder="Email: link@gmail.com"
                        v-model:input="email"
                        inputType="email"
                        :error="errors && errors.email ? errors.email[0] : ''"
                    />
                    <p v-if="errors && errors.email" class="text-red-500">{{ errors.email[0] }}</p>
                </div>

                <div class="mt-4">
                    <TextInput 
                        placeholder="Password"
                        v-model:input="password"
                        inputType="password"
                        :error="errors && errors.password ? errors.password[0] : ''"
                    />
                    <p v-if="errors && errors.password" class="text-red-500">{{ errors.password[0] }}</p>
                </div>

                <div class="mt-10">
                    <button
                        type="submit"
                        class="rounded-full w-full p-3 font-bold"
                        :disabled="(!email || !password) || isLoading"
                        :class="
                            (email && password && !isLoading) 
                                ? 'bg-[#8228D9] hover:bg-[#6c21b3] text-white' 
                                : 'bg-[#EFF0EB] text-[#A7AAA2]'
                        "
                    >
                        <span v-if="isLoading">Loading...</span>
                        <span v-else>Log in</span>
                    </button>
                </div>
            </form>

            <div class="text-[14px] text-center pt-12">
                Don't have an account?
                <NuxtLink 
                    to="/register"
                    class="text-[#8228D9] underline"
                >
                    Sign up
                </NuxtLink>
            </div>
        </div>
    </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import AuthLayout from '~/layouts/AuthLayout.vue';

import { useUserStore } from '~~/stores/user';
const userStore = useUserStore();

const router = useRouter();

// definePageMeta({ middleware: 'is-logged-in' })

let email = ref(null);
let password = ref(null);
let errors = ref(null);
const isLoading = ref(false);

const login = async () => {
    errors.value = null;
    isLoading.value = true;

    try {
        await userStore.login(email.value, password.value);
        await userStore.getAllLinks();
        router.push('/admin');
    } catch (error) {
        errors.value = error;
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};
</script>
