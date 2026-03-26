<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="Username"
                name="username"
                type="text"
                required
                :loading="loading"
              />
              <v-text-field
                v-model="password"
                label="Password"
                name="password"
                type="password"
                required
                :loading="loading"
              />
              <v-alert v-if="error" type="error" class="mt-2">
                {{ error }}
              </v-alert>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" type="submit" :loading="loading">
                  Login
                </v-btn>
              </v-card-actions>
            </v-form>
            <div class="mt-4 text-caption text-grey">
              Test credentials:<br />
              Username: emilys<br />
              Password: emilyspass
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";

  const result = await authStore.login(username.value, password.value);

  if (result.success) {
    await router.replace("/");
  } else {
    error.value = result.error || "Login failed";
  }

  loading.value = false;
}
</script>