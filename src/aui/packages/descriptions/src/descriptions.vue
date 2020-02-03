<style src="./descriptions.scss" lang="scss" scoped></style>

<template>
  <div :class="['aui-descriptions', 'aui-descriptions-' + size, { 'aui-descriptions-bordered': bordered }]">
    <div
      v-if="title"
      class="aui-descriptions-title"
    >{{ title }}</div>
    <div class="aui-descriptions-view">
      <div hidden>
        <slot />
      </div>
      <template v-if="layout === 'horizontal'">
        <DescriptionsTable
          :value="fields"
          :column="column"
          :layout="layout"
          :label-width="labelWidth"
          :label-color="labelColor"
          :content-width="contentWidth"
        />
      </template>
    </div>
  </div>
</template>

<script src="./descriptions.js"></script>
