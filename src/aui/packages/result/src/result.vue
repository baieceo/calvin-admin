<style src="./result.scss" lang="scss" scoped></style>

<template>
  <div :class="['aui-result', 'aui-result-' + status]">
    <div class="aui-result-icon">
      <template v-if="!hasOwnSlot('icon')">
        <i
          v-if="status === 'info'"
          class="el-icon-info"
          style="color: #409EFF"
        />

        <i
          v-else-if="status === 'success'"
          class="el-icon-success"
          style="color: #67C23A"
        />

        <i
          v-else-if="status === 'error'"
          class="el-icon-error"
          style="color: #F56C6C"
        />

        <i
          v-else-if="status === 'warning'"
          class="el-icon-warning"
          style="color: #E6A23C"
        />

        <i
          v-else-if="status === '404'"
          class="el-icon-question"
          style="color: #409EFF"
        />

        <i
          v-else-if="status === '403'"
          class="el-icon-lock"
          style="color: #409EFF"
        />

        <i
          v-else-if="status === '500'"
          class="el-icon-warning"
          style="color: #F56C6C"
        />
      </template>
      <template v-else>
        <slot name="icon" />
      </template>
    </div>

    <div
      v-if="title"
      class="aui-result-title"
    >{{ title }}</div>
    <div
      v-if="subTitle"
      class="aui-result-subtitle"
    >{{ subTitle }}</div>
    <div
      v-if="hasOwnSlot('extra')"
      class="aui-result-extra"
    >
      <slot name="extra" />
    </div>
  </div>
</template>

<script src="./result.js"></script>
