<template>
  <v-app-bar color="primary" density="compact" flat>

    <v-spacer />
    <div class="desktop-nav">
      <v-btn to="/" variant="text" prepend-icon="mdi-account-group">
        Пользователи
      </v-btn>

      <v-btn to="/favorites" variant="text" prepend-icon="mdi-star">
        Избранное
      </v-btn>

      <v-btn @click="logout" variant="text" prepend-icon="mdi-logout">
        Выйти
      </v-btn>
    </div>

    <div class="mobile-nav">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-menu"
            variant="text"
            class="text-white"
          />
        </template>

        <v-list>
          <v-list-item to="/" prepend-icon="mdi-account-group">
            <v-list-item-title>Пользователи</v-list-item-title>
          </v-list-item>

          <v-list-item to="/favorites" prepend-icon="mdi-star">
            <v-list-item-title>Избранное</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout" prepend-icon="mdi-logout">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

function logout() {
  authStore.logout();
}
</script>

<style scoped>
.desktop-nav {
  display: flex;
  gap: 4px;
}

.mobile-nav {
  display: none;
}

.text-white {
  color: white !important;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}
</style>