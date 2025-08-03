<template>
  <div class="skeleton-container">
    <!-- Card skeleton -->
    <q-card
      v-if="type === 'card'"
      class="skeleton-card"
      flat
      bordered
    >
      <q-card-section>
        <div class="row items-center">
          <q-skeleton
            type="QAvatar"
            :size="avatarSize"
            class="col-auto"
          />
          <div class="col q-ml-md">
            <q-skeleton
              type="text"
              :width="titleWidth"
              class="text-subtitle1"
            />
            <q-skeleton
              type="text"
              :width="subtitleWidth"
              class="text-caption"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="showContent">
        <q-skeleton
          type="text"
          class="text-body1"
          v-for="line in contentLines"
          :key="line"
        />
      </q-card-section>

      <q-card-actions v-if="showActions" align="right">
        <q-skeleton type="QBtn" />
        <q-skeleton type="QBtn" />
      </q-card-actions>
    </q-card>

    <!-- Table skeleton -->
    <q-table
      v-else-if="type === 'table'"
      flat
      bordered
      :rows="[]"
      :columns="tableColumns"
      row-key="id"
      :pagination="{ rowsPerPage: rowsPerPage }"
    >
      <template v-slot:body>
        <q-tr v-for="row in rowsPerPage" :key="row">
          <q-td v-for="col in tableColumns" :key="col.name">
            <q-skeleton type="text" />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- List skeleton -->
    <q-list v-else-if="type === 'list'" bordered>
      <q-item
        v-for="item in listItems"
        :key="item"
        class="q-py-md"
      >
        <q-item-section avatar>
          <q-skeleton type="QAvatar" :size="avatarSize" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" width="60%" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="40%" />
          </q-item-label>
        </q-item-section>

        <q-item-section side v-if="showListActions">
          <q-skeleton type="QBtn" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Form skeleton -->
    <q-form v-else-if="type === 'form'" class="q-gutter-md">
      <div v-for="field in formFields" :key="field" class="q-mb-md">
        <q-skeleton type="text" width="20%" class="q-mb-xs" />
        <q-skeleton type="QInput" />
      </div>

      <div class="row q-gutter-sm q-mt-lg">
        <q-skeleton type="QBtn" />
        <q-skeleton type="QBtn" />
      </div>
    </q-form>

    <!-- Dashboard skeleton -->
    <div v-else-if="type === 'dashboard'" class="q-gutter-md">
      <!-- Stats cards -->
      <div class="row q-gutter-md q-mb-xl">
        <div
          v-for="stat in 4"
          :key="stat"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <q-skeleton type="text" width="60%" />
                  <q-skeleton type="text" width="40%" class="text-h4" />
                </div>
                <div class="col-auto">
                  <q-skeleton type="QAvatar" size="50px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts -->
      <div class="row q-gutter-md">
        <div class="col-12 col-md-8">
          <q-card flat bordered>
            <q-card-section>
              <q-skeleton type="text" width="30%" class="text-h6" />
              <q-skeleton type="rect" height="300px" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <q-skeleton type="text" width="40%" class="text-h6" />
              <q-skeleton type="circle" size="200px" class="q-mt-md q-mx-auto" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Default text skeleton -->
    <div v-else>
      <q-skeleton
        type="text"
        v-for="line in textLines"
        :key="line"
        :width="getRandomWidth()"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'card', 'table', 'list', 'form', 'dashboard'].includes(value)
  },
  lines: {
    type: Number,
    default: 3
  },
  avatarSize: {
    type: String,
    default: '40px'
  },
  titleWidth: {
    type: String,
    default: '60%'
  },
  subtitleWidth: {
    type: String,
    default: '40%'
  },
  showContent: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showListActions: {
    type: Boolean,
    default: true
  },
  contentLines: {
    type: Number,
    default: 3
  },
  listItems: {
    type: Number,
    default: 5
  },
  formFields: {
    type: Number,
    default: 5
  },
  tableColumns: {
    type: Array,
    default: () => [
      { name: 'col1', label: 'Column 1', field: 'col1' },
      { name: 'col2', label: 'Column 2', field: 'col2' },
      { name: 'col3', label: 'Column 3', field: 'col3' },
      { name: 'col4', label: 'Column 4', field: 'col4' }
    ]
  },
  rowsPerPage: {
    type: Number,
    default: 10
  }
})

const textLines = computed(() => props.lines)

const getRandomWidth = () => {
  const widths = ['100%', '90%', '80%', '70%', '85%', '95%']
  return widths[Math.floor(Math.random() * widths.length)]
}
</script>

<style scoped>
.skeleton-container {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-card {
  margin-bottom: 16px;
}
</style>
