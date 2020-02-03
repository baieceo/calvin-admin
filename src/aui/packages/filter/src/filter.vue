<style lang="scss" src="./filter.scss" scoped></style>

<template>
  <div class="aui-filter">
    <div class="aui-filter-wrapper">
      <div class="aui-filter-form">
        <el-form
          :inline="true"
          :model="filterFormModel"
          class="aui-filter-form-inline"
        >
          <template v-for="(formItem, formIndex) of value">
            <el-form-item
              v-if="!hideFilter.includes(formItem.name)"
              :key="formIndex"
              :label="formItem.label"
              :label-width="labelWidth"
            >
              <!-- 输入框 start -->
              <template v-if="formItem.type === 'input'">
                <el-input
                  v-model="filterFormModel[formItem.name].value"
                  :placeholder="formItem.placeholder || '请输入'"
                  :disabled="formItem.disabled"
                  :clearable="formItem.clearable"
                  :style="formItem.itemWidth ? { width: formItem.itemWidth } : {}"
                />
              </template>
              <!-- 输入框 end -->

              <!-- 下拉框 start -->
              <template v-if="formItem.type === 'select'">
                <el-select
                  v-model="filterFormModel[formItem.name].value"
                  :placeholder="formItem.placeholder || '请选择'"
                  :loading="formItem.loading"
                  :loading-text="formItem.loadingText"
                  :disabled="formItem.disabled"
                  :clearable="formItem.clearable"
                  :style="formItem.itemWidth ? { width: formItem.itemWidth } : {}"
                >
                  <el-option
                    v-for="(selectItem, selectIndex) of filterFormModel[formItem.name].options"
                    :key="selectIndex"
                    :label="selectItem.label"
                    :value="selectItem.value"
                  />
                </el-select>
              </template>
              <!-- 下拉框 end -->

              <!-- 日期范围 start -->
              <template v-if="formItem.type === 'daterange'">
                <el-date-picker
                  v-model="filterFormModel[formItem.name].value"
                  type="daterange"
                  :value-format="formItem.valueFormat || 'yyyy/MM/dd'"
                  :disabled="formItem.disabled"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :clearable="formItem.clearable"
                  :style="formItem.itemWidth ? { width: formItem.itemWidth } : {}"
                />
              </template>
              <!-- 日期范围 end -->

              <!-- 日期时间范围 start -->
              <template v-if="formItem.type === 'datetimerange'">
                <el-date-picker
                  v-model="filterFormModel[formItem.name].value"
                  type="datetimerange"
                  :value-format="formItem.valueFormat || 'yyyy/MM/dd HH:mm:ss'"
                  :disabled="formItem.disabled"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :clearable="formItem.clearable"
                  :style="formItem.itemWidth ? { width: formItem.itemWidth } : {}"
                />
              </template>
              <!-- 日期时间范围 end -->

              <!-- 日期 start -->
              <template v-if="formItem.type === 'date'">
                <el-date-picker
                  v-model="filterFormModel[formItem.name].value"
                  type="date"
                  :value-format="formItem.valueFormat || 'yyyy/MM/dd'"
                  :disabled="formItem.disabled"
                  :placeholder="formItem.placeholder || '请选择'"
                  :clearable="formItem.clearable"
                  :style="formItem.itemWidth ? { width: formItem.itemWidth } : {}"
                />
              </template>
              <!-- 日期 end -->

              <!-- 时间 start -->
              <template v-if="formItem.type === 'time'">
                <el-time-select
                  v-model="filterFormModel[formItem.name].value"
                  :disabled="formItem.disabled"
                  :placeholder="formItem.placeholder || '请选择'"
                  :picker-options="formItem.options"
                  :clearable="formItem.clearable"
                  :style="formItem.itemWidth ? { width: formItem.itemWidth } : {}"
                />
              </template>
              <!-- 时间 end -->
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div class="aui-filter-side">
        <el-button
          type="primary"
          size="small"
          plain
          :loading="filterLoading"
          @click="filterTable"
        >查询</el-button>
        <el-button
          v-if="!hideReset"
          size="small"
          plain
          @click="resetFilter"
        >重置</el-button>
      </div>
    </div>
  </div>
</template>

<script src="./filter.js"></script>
