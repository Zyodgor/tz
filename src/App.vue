<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});
</script>

<style>

.text-green {
  color: #2e7d32 ;
  font-weight: 500;
}

.text-orange {
  color: #f57c00;
  font-weight: 500;
}

.text-red {
  color: #c62828;
  font-weight: 500;
}

a {
  color: #00AEEF;
  text-decoration: none;
  transition: color 0.2s;
}

.v-btn--variant-tonal {
  background-color: rgba(11, 43, 92, 0.1);
}

.v-btn--variant-tonal:hover {
  background-color: rgba(0, 174, 239, 0.15);
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) ;
}

.v-table th {
  background-color: #F8F9FC ;
  color: #0B2B5C ;
  font-weight: 600;
}

.user-row:hover {
  background-color: rgba(0, 174, 239, 0.05);
}

.pagination-container {
  background-color: #FFFFFF;
  border-radius: 0 0 12px 12px;
}

</style>