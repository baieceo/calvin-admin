<template>
  <div class="app-container">
    <div v-perm="'button.role.create'" class="actions">
      <el-button 
        type="primary"
        :disabled="role.id !== 1 || !hasPerm('button.role.create')"
        @click="handleCreate"
      >创建角色</el-button>
    </div>

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
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="role.id !== 1 || !hasPerm('button.role.modify')" @click="handleModify(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" :disabled="role.id === scope.row.id || !hasPerm('button.role.remove')" @click="handleRemove(scope.row)">删除</el-button>
          <el-button type="default" size="mini" :disabled="role.id !== 1 || !hasPerm('button.role.view')" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="roleFormTitle"
      :visible.sync="canVisibleRoleDialog"
    >
      <el-form
        ref="roleForm"
        label-width="6em"
        :model="roleFormData"
        :rules="roleFormRules"
        :disabled="action === 'view'"
        style="width: 500px;"
      >
        <el-form-item prop="roleName" label="名称">
          <el-input type="text" v-model="roleFormData.roleName" />
        </el-form-item>

        <el-form-item prop="rolePerms" label="权限">
          <el-checkbox-group v-model="roleFormData.rolePerms">
            <el-checkbox
              v-for="(item, index) in permOptions"
              :key="item.data.id"
              :label="item.data.id"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisibleRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSave" :loading="postLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>
