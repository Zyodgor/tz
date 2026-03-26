<template>
  <div>
    <AppBar title="Избранное" icon="mdi-star" />

    <v-container fluid class="pa-2 pa-sm-4">
      <v-row class="mt-2">
        <v-col cols="12">
          <v-text-field
            v-model="searchQuery"
            label="Поиск по имени или телефону"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card v-if="filteredFavorites.length" class="desktop-favorites">
            <v-card-text class="pa-0">
              <v-table hover>
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Дата рождения</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in filteredFavorites"
                    :key="user.id"
                    style="cursor: pointer"
                    @click="goToUser(user.id)"
                    class="favorite-row"
                  >
                    <td>
                      <div class="d-flex align-center">
                        <v-avatar size="32" class="mr-2">
                          <v-img
                            v-if="user.image"
                            :src="user.image"
                            :alt="user.firstName"
                          />
                          <v-icon v-else color="primary">mdi-account</v-icon>
                        </v-avatar>
                        <div>
                          <div class="font-weight-medium">
                            {{ user.firstName }} {{ user.lastName }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        :href="`tel:${user.phone}`"
                        class="text-decoration-none"
                        @click.stop
                      >
                        {{ user.phone }}
                      </a>
                    </td>
                    <td :class="getAgeColor(calculateAge(user.birthDate))">
                      {{ formatDate(user.birthDate) }}
                      <div class="text-caption">
                        {{ calculateAge(user.birthDate) }} лет
                      </div>
                    </td>
                    <td>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        size="small"
                        @click.stop="removeFromFavorites(user.id)"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>

          <div v-if="filteredFavorites.length" class="mobile-favorites">
            <v-card
              v-for="user in filteredFavorites"
              :key="user.id"
              class="mb-3 favorite-card"
              @click="goToUser(user.id)"
            >
              <div class="d-flex pa-3">
                <v-avatar size="50" class="mr-3">
                  <v-img
                    v-if="user.image"
                    :src="user.image"
                    :alt="user.firstName"
                  />
                  <v-icon v-else size="40" color="primary"
                    >mdi-account-circle</v-icon
                  >
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <div class="font-weight-bold">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-caption text-grey">{{ user.phone }}</div>
                    </div>
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click.stop="removeFromFavorites(user.id)"
                    />
                  </div>

                  <div class="mt-2">
                    <div
                      :class="getAgeColor(calculateAge(user.birthDate))"
                      class="text-caption"
                    >
                      <v-icon size="12" class="mr-1">mdi-cake</v-icon>
                      {{ formatDate(user.birthDate) }} ({{
                        calculateAge(user.birthDate)
                      }}
                      лет)
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </div>

          <v-card v-else class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">
              mdi-star-outline
            </v-icon>
            <div class="text-h6 text-grey">
              У вас пока нет избранных пользователей
            </div>
            <div class="text-subtitle-1 text-grey-lighten-1 mt-2">
              Добавьте пользователей в избранное из списка или карточки
              пользователя
            </div>
            <v-btn
              color="primary"
              class="mt-4"
              to="/"
              prepend-icon="mdi-account-group"
            >
              Перейти к списку пользователей
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
    
    <script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useFavoritesStore } from "../stores/favorites";
import AppBar from "../components/AppBar.vue";

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const searchQuery = ref("");

const filteredFavorites = computed(() => {
  if (!searchQuery.value) return favoritesStore.favorites;

  const query = searchQuery.value.toLowerCase();
  return favoritesStore.favorites.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.phone.includes(query)
  );
});

function goToUser(userId: number) {
  router.push(`/users/${userId}`);
}

function removeFromFavorites(userId: number) {
  favoritesStore.removeFavorite(userId);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getAgeColor(age: number) {
  if (age < 30) return "text-green";
  if (age <= 50) return "text-orange";
  return "text-red";
}

onMounted(() => {
  if (authStore.user?.id) {
    favoritesStore.loadFavorites(authStore.user.id);
  }
});
</script>
    
    <style scoped>
.desktop-favorites {
  display: block;
}

.mobile-favorites {
  display: none;
}

.favorite-row {
  transition: background-color 0.2s;
}

.favorite-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.text-green {
  color: #2e7d32;
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

@media (max-width: 768px) {
  .desktop-favorites {
    display: none;
  }

  .mobile-favorites {
    display: block;
  }

  .favorite-card {
    cursor: pointer;
    transition: all 0.2s;
  }

  .favorite-card:active {
    transform: scale(0.98);
  }
}
</style>