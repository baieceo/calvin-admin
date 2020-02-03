<template>
  <div class="app-container">
    <div :disabled="role.id !== 1 || !hasPerm('button.perm.create')" class="actions">
      <el-button 
        type="primary"
        @click="handleCreate"
      >创建权限</el-button>
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
      <el-table-column label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="权限KEY">
        <template slot-scope="scope">
          {{ scope.row.perm_key }}
        </template>
      </el-table-column>
      <el-table-column label="权限名称">
        <template slot-scope="scope">
          {{ scope.row.perm_name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="role.id !== 1 || !hasPerm('button.perm.modify')" @click="handleModify(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" :disabled="role.id !== 1 || !hasPerm('button.perm.remove')" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :total="pagination.total"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog
      :title="permFormTitle"
      :visible.sync="canVisiblePermDialog"
      :before-close="handleClose">
      <el-form
        ref="permForm"
        label-width="6em"
        :model="permFormData"
        :rules="permFormRules"
        style="width: 500px;"
      >
        <el-form-item prop="permKey" label="KEY">
          <el-input type="text" v-model="permFormData.permKey" />
        </el-form-item>

        <el-form-item prop="permName" label="名称">
          <el-input type="text" v-model="permFormData.permName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisiblePermDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSave" :loading="postLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>
