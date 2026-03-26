<template>
  <div>
    <AppBar title="Управление пользователями" />

    <v-container fluid class="pa-2 pa-sm-4">
      <v-row class="mt-2">
        <v-col cols="12">
          <v-text-field
            v-model="searchQuery"
            label="Поиск по имени, email или телефону"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            variant="outlined"
            hide-details
            @update:model-value="handleSearch"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-text class="pa-0">
              <div class="desktop-table">
                <v-table hover class="users-table">
                  <thead>
                    <tr>
                      <th
                        v-for="header in headers"
                        :key="header.key"
                        @click="header.sortable && handleSort(header.key)"
                        :class="{ sortable: header.sortable }"
                      >
                        {{ header.title }}
                        <v-icon
                          v-if="header.sortable && sortKey === header.key"
                          size="small"
                          class="ml-1"
                        >
                          {{
                            sortOrder === "asc"
                              ? "mdi-arrow-up"
                              : "mdi-arrow-down"
                          }}
                        </v-icon>
                      </th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td
                        :colspan="headers.length + 1"
                        class="text-center py-8"
                      >
                        <v-progress-circular indeterminate color="primary" />
                        <div class="mt-2">Загрузка пользователей...</div>
                      </td>
                    </tr>
                    <tr
                      v-else-if="!paginatedUsers || paginatedUsers.length === 0"
                    >
                      <td
                        :colspan="headers.length + 1"
                        class="text-center py-8"
                      >
                        <v-icon size="48" class="mb-2">mdi-account-off</v-icon>
                        <div>Пользователи не найдены</div>
                      </td>
                    </tr>
                    <tr
                      v-else
                      v-for="user in paginatedUsers"
                      :key="user.id"
                      class="user-row"
                      @click="goToUser(user.id)"
                    >
                      <td class="font-weight-medium">{{ user.id }}</td>
                      <td>
                        <div class="d-flex align-center">
                          <v-avatar size="32" class="mr-2">
                            <v-img :src="user.image" :alt="user.firstName" />
                          </v-avatar>
                          <div>
                            <div class="font-weight-medium">
                              {{ user.firstName }} {{ user.lastName }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ user.email }}
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
                      <td :class="getColorClass(user.age)">
                        {{ formatDate(user.birthDate) }}
                        <div class="text-caption">{{ user.age }} лет</div>
                      </td>
                      <td>
                        <v-btn
                          :color="
                            isFavorite(user.id) ? 'amber-darken-2' : 'grey'
                          "
                          :icon="
                            isFavorite(user.id)
                              ? 'mdi-star'
                              : 'mdi-star-outline'
                          "
                          variant="text"
                          size="small"
                          @click.stop="toggleFavorite(user)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>

              <div class="mobile-cards">
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="primary"
                  class="d-block mx-auto my-8"
                />

                <div
                  v-else-if="!paginatedUsers || paginatedUsers.length === 0"
                  class="text-center py-8"
                >
                  <v-icon size="48" class="mb-2">mdi-account-off</v-icon>
                  <div>Пользователи не найдены</div>
                </div>

                <v-card
                  v-else
                  v-for="user in paginatedUsers"
                  :key="user.id"
                  class="mb-3 user-card"
                  @click="goToUser(user.id)"
                >
                  <div class="d-flex pa-3">
                    <v-avatar size="50" class="mr-3">
                      <v-img :src="user.image" :alt="user.firstName" />
                    </v-avatar>

                    <div class="flex-grow-1">
                      <div class="d-flex justify-space-between align-start">
                        <div>
                          <div class="font-weight-bold text-body-1">
                            {{ user.firstName }} {{ user.lastName }}
                          </div>
                          <div class="text-caption text-grey">
                            ID: {{ user.id }}
                          </div>
                        </div>
                        <v-btn
                          :color="
                            isFavorite(user.id) ? 'amber-darken-2' : 'grey'
                          "
                          :icon="
                            isFavorite(user.id)
                              ? 'mdi-star'
                              : 'mdi-star-outline'
                          "
                          variant="text"
                          size="small"
                          @click.stop="toggleFavorite(user)"
                        />
                      </div>

                      <div class="mt-2">
                        <div class="d-flex align-center text-caption mb-1">
                          <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                          <a
                            :href="`tel:${user.phone}`"
                            class="text-decoration-none"
                            @click.stop
                          >
                            {{ user.phone }}
                          </a>
                        </div>
                        <div class="d-flex align-center text-caption">
                          <v-icon size="14" class="mr-1">mdi-cake</v-icon>
                          <span :class="getColorClass(user.age)">
                            {{ formatDate(user.birthDate) }} ({{ user.age }}
                            лет)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>

              <v-divider />

              <div class="pagination-container pa-3 pa-sm-4">
                <div class="pagination-items-per-page">
                  <span class="text-caption">Показывать:</span>
                  <v-select
                    v-model="itemsPerPage"
                    :items="itemsPerPageOptions"
                    density="compact"
                    variant="outlined"
                    hide-details
                    class="items-per-page-select ml-2"
                    @update:model-value="handleItemsPerPageChange"
                  />
                </div>

                <div class="pagination-info text-caption">
                  {{ startIndex + 1 }}-{{ endIndex }} из
                  {{ filteredUsers.length }}
                </div>

                <div class="pagination-buttons">
                  <v-btn
                    :disabled="currentPage === 1"
                    @click="prevPage"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-chevron-left"
                  >
                    Назад
                  </v-btn>

                  <v-btn
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                    variant="tonal"
                    size="small"
                    append-icon="mdi-chevron-right"
                  >
                    Вперед
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
    
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useFavoritesStore } from "../stores/favorites";
import { useUsers } from "../composables/useUsers";
import { useDateFormat } from "../composables/useDateFormat";
import { useAgeColor } from "../composables/useAgeColor";
import AppBar from "../components/AppBar.vue";

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const {
  loading,
  searchQuery,
  sortKey,
  sortOrder,
  itemsPerPage,
  currentPage,
  paginatedUsers,
  filteredUsers,
  totalPages,
  startIndex,
  endIndex,
  loadUsers,
  nextPage,
  prevPage,
  setItemsPerPage,
  setSearchQuery,
  setSort,
} = useUsers();

const { formatDate } = useDateFormat();
const { getColorClass } = useAgeColor(0);

const itemsPerPageOptions = [5, 10, 20, 50];

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Имя пользователя", key: "firstName", sortable: true },
  { title: "Телефон", key: "phone", sortable: true },
  { title: "Дата рождения", key: "birthDate", sortable: true },
];

function goToUser(userId: number) {
  router.push(`/users/${userId}`);
}

function isFavorite(userId: number) {
  return favoritesStore.isFavorite(userId);
}

function toggleFavorite(user: any) {
  if (isFavorite(user.id)) {
    favoritesStore.removeFavorite(user.id);
  } else {
    favoritesStore.addFavorite({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthDate: user.birthDate,
      image: user.image,
    });
  }
}

function handleSearch() {
  setSearchQuery(searchQuery.value);
}

function handleItemsPerPageChange(value: number) {
  setItemsPerPage(value);
}

function handleSort(key: string) {
  setSort(key as any);
}

onMounted(() => {
  if (authStore.user?.id) {
    favoritesStore.loadFavorites(authStore.user.id);
  }
  loadUsers();
});

watch(
  () => authStore.user?.id,
  (newId) => {
    if (newId) {
      favoritesStore.loadFavorites(newId);
    }
  }
);
</script>

<style scoped>
.desktop-table {
  display: block;
  overflow-x: auto;
}

.mobile-cards {
  display: none;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .user-card {
    cursor: pointer;
    transition: all 0.2s;
  }

  .user-card:active {
    transform: scale(0.98);
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.user-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-row:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.text-green {
  color: #4caf50;
  font-weight: 500;
}

.text-orange {
  color: #ff9800;
  font-weight: 500;
}

.text-red {
  color: #f44336;
  font-weight: 500;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-items-per-page {
  display: flex;
  align-items: center;
}

.items-per-page-select {
  width: 82px;
}

.pagination-info {
  color: rgba(0, 0, 0, 0.6);
}

.pagination-buttons {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-items-per-page {
    justify-content: center;
  }

  .pagination-buttons {
    justify-content: center;
  }

  .pagination-info {
    text-align: center;
  }
}
</style>