<style src="./filter-table.scss" lang="scss" scoped></style>

<template>
  <div class="aui-filter-table">
    <filter-form
      v-model="value"
      :hide-reset="hideReset"
      :hide-filter="hideFilter"
      :label-width="labelWidth"
      :loading="filterLoading"
      @change="filterFormChange"
      @submit="submit"
      @reset="resetFilter"
    />

    <slot />
  </div>
</template>

<script src="./filter-table.js"></script>
