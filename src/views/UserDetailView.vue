<template>
  <div>
    <AppBar title="Карточка пользователя" icon="mdi-account-details" />

    <v-container fluid class="pa-2 pa-sm-4">
      <v-row class="mt-2">
        <v-col cols="12">
          <v-btn
            @click="goBack"
            prepend-icon="mdi-arrow-left"
            variant="tonal"
            size="small"
          >
            Назад
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="loading">
        <v-col cols="12" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="64" />
          <div class="mt-4">Загрузка данных пользователя...</div>
        </v-col>
      </v-row>

      <v-row v-else-if="user">
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-img
              :src="user.image"
              height="300"
              cover
              class="bg-grey-lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5" />
                </v-row>
              </template>
            </v-img>

            <v-card-title class="text-h5">
              {{ user.firstName }} {{ user.lastName }}
            </v-card-title>

            <v-card-subtitle class="mt-1">
              <v-chip
                size="small"
                :color="user.gender === 'male' ? 'primary' : 'secondary'"
                variant="tonal"
              >
                <v-icon size="small" class="mr-1">
                  {{
                    user.gender === "male"
                      ? "mdi-gender-male"
                      : "mdi-gender-female"
                  }}
                </v-icon>
                {{ user.gender === "male" ? "Мужчина" : "Женщина" }}
              </v-chip>
            </v-card-subtitle>

            <v-divider class="my-2" />

            <v-card-actions>
              <v-btn
                :color="isFavorite ? 'amber-darken-2' : 'grey'"
                :variant="isFavorite ? 'flat' : 'tonal'"
                block
                @click="toggleFavorite"
                :prepend-icon="isFavorite ? 'mdi-star' : 'mdi-star-outline'"
              >
                {{
                  isFavorite ? "Удалить из избранного" : "Добавить в избранное"
                }}
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-bold">
              <v-icon class="mr-2">mdi-contact-mail</v-icon>
              Контактная информация
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div class="contact-item mb-3">
                <div class="text-caption text-grey mb-1">Email</div>
                <a
                  :href="`mailto:${user.email}`"
                  class="contact-link"
                  @click.stop
                >
                  <v-icon size="small" class="mr-2">mdi-email</v-icon>
                  {{ user.email }}
                </a>
              </div>

              <div class="contact-item">
                <div class="text-caption text-grey mb-1">Телефон</div>
                <a :href="`tel:${user.phone}`" class="contact-link" @click.stop>
                  <v-icon size="small" class="mr-2">mdi-phone</v-icon>
                  {{ user.phone }}
                </a>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title class="text-subtitle-1 font-weight-bold">
              <v-icon class="mr-2">mdi-account-details</v-icon>
              Персональная информация
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-grey">Полное имя</div>
                    <div class="font-weight-medium">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                  </div>

                  <div class="info-item mt-3">
                    <div class="text-caption text-grey">Дата рождения</div>
                    <div
                      :class="getAgeColor(user.age)"
                      class="font-weight-medium"
                    >
                      {{ formatFullDate(user.birthDate) }}
                      <span class="text-caption ml-1"
                        >({{ user.age }} лет)</span
                      >
                    </div>
                  </div>

                  <div class="info-item mt-3">
                    <div class="text-caption text-grey">Возраст</div>
                    <div class="font-weight-medium">{{ user.age }} лет</div>
                  </div>
                </v-col>

                <v-col cols="12" sm="6">
                  <div class="info-item">
                    <div class="text-caption text-grey">Пол</div>
                    <div class="font-weight-medium">
                      {{ user.gender === "male" ? "Мужской" : "Женский" }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title class="text-subtitle-1 font-weight-bold">
              <v-icon class="mr-2">mdi-domain</v-icon>
              Информация о компании
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <div class="info-item">
                    <div class="text-caption text-grey">Компания</div>
                    <div class="font-weight-medium">
                      {{ user.company.name }}
                    </div>
                  </div>

                  <div class="info-item mt-3">
                    <div class="text-caption text-grey">Отдел</div>
                    <div class="font-weight-medium">
                      {{ user.company.department }}
                    </div>
                  </div>

                  <div class="info-item mt-3">
                    <div class="text-caption text-grey">Должность</div>
                    <div class="font-weight-medium">
                      {{ user.company.title }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title class="text-subtitle-1 font-weight-bold">
              <v-icon class="mr-2">mdi-post</v-icon>
              Посты пользователя
              <v-chip
                v-if="posts.length"
                size="small"
                class="ml-2"
                color="primary"
              >
                {{ posts.length }} {{ getPostsWord(posts.length) }}
              </v-chip>
            </v-card-title>
            <v-divider />

            <v-card-text v-if="postsLoading">
              <div class="text-center py-4">
                <v-progress-circular indeterminate size="40" />
                <div class="mt-2">Загрузка постов...</div>
              </div>
            </v-card-text>

            <v-card-text v-else-if="posts.length === 0">
              <div class="text-center py-8">
                <v-icon size="64" class="mb-2 text-grey"
                  >mdi-post-outline</v-icon
                >
                <div class="text-h6 text-grey">Нет постов</div>
                <div class="text-subtitle-2 text-grey-lighten-1">
                  У пользователя пока нет опубликованных постов
                </div>
              </div>
            </v-card-text>

            <v-list v-else lines="two" class="posts-list">
              <v-list-item
                v-for="post in posts"
                :key="post.id"
                :title="post.title"
                :subtitle="post.body"
                class="post-item"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" size="48" class="mr-3">
                    <v-icon color="white" size="24">mdi-post</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:append>
                  <v-chip size="small" variant="tonal">
                    Пост #{{ post.id }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-else type="error" class="mt-4" variant="tonal">
        <v-icon class="mr-2">mdi-alert</v-icon>
        Пользователь не найден
      </v-alert>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useFavoritesStore } from "../stores/favorites";
import { useUserDetail } from "../composables/useUserDetail";
import { useDateFormat } from "../composables/useDateFormat";
import { useAgeColor } from "../composables/useAgeColor";
import AppBar from "../components/AppBar.vue";

const router = useRouter();
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const {
  user,
  posts,
  loading,
  postsLoading,
  loadUser,
  loadPosts,
  getPostsWord,
} = useUserDetail();
const { formatFullDate } = useDateFormat();
const { getAgeColor } = useAgeColor(0);

const isFavorite = computed(() => {
  if (!user.value) return false;
  return favoritesStore.isFavorite(user.value.id);
});

function toggleFavorite() {
  if (!user.value) return;

  if (isFavorite.value) {
    favoritesStore.removeFavorite(user.value.id);
  } else {
    favoritesStore.addFavorite({
      id: user.value.id,
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      phone: user.value.phone,
      birthDate: user.value.birthDate,
      image: user.value.image,
    });
  }
}

function goBack() {
  router.back();
}

onMounted(() => {
  if (authStore.user?.id) {
    favoritesStore.loadFavorites(authStore.user.id);
  }
  loadUser();
  loadPosts();
});
</script>

<style scoped>
.text-green {
  color: #2e7d32;
}

.text-orange {
  color: #f57c00;
}

.text-red {
  color: #c62828;
}

.contact-item {
  padding: 8px 0;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
  transition: color 0.2s;
}

.contact-link:hover {
  color: #0b5ca3;
  text-decoration: underline;
}

.info-item {
  padding: 4px 0;
}

.posts-list {
  max-height: 500px;
  overflow-y: auto;
}

.post-item {
  transition: background-color 0.2s;
}

.post-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>