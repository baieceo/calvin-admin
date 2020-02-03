<template>
  <div class="app-container">
    <div :disabled="role.id !== 1 || !hasPerm('button.cms.page.create')" class="actions">
      <el-button 
        type="primary"
        @click="handleCreate"
      >创建页面</el-button>
    </div>

    <aui-filter-table
      v-model="filterForm"
      class="app-filter"
      label-width="7em"
      :loading="filterLoading"
      @submit="filterQuery({ page: 1 })"
      @reset="filterReset"
    />

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="页面ID" fixed="left" width="200">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="页面标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="role.id !== 1 || !hasPerm('button.cms.page.modify')" @click="handleModify(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" :disabled="role.id !== 1 || !hasPerm('button.cms.page.remove')" @click="handleRemove(scope.row)">删除</el-button>
          <el-button type="default" size="mini" :disabled="role.id !== 1 || !hasPerm('button.cms.page.view')" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="Number(pagination.page)"
        :page-size="Number(pagination.size)"
        :total="pagination.total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script src="./app.js"></script>
