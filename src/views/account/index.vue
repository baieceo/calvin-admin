<style lang="scss" scoped>
  .avatar {
    width: 25px;
    height: 25px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    border: 1px solid #F5F5F5;
  }
</style>

<template>
  <div class="app-container">
    <div v-perm="'button.account.create'" class="actions">
      <el-button 
        type="primary"
        @click="handleCreate"
      >创建账户</el-button>
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
      <el-table-column label="账户ID">
        <template slot-scope="scope">
          {{ scope.row.account_id }}
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="avatar" :style="{ 'background-image': 'url(' + scope.row.account_avatar + ')' }" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="(scope.row.account_id !== name || !hasPerm('button.account.modify')) && role.id !== 1" @click="handleModify(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" :disabled="scope.row.account_id === name || !hasPerm('button.account.remove')" @click="handleRemove(scope.row)">删除</el-button>
          <el-button type="defalut" size="mini" :disabled="(scope.row.account_id !== name || !hasPerm('button.account.pwd')) && role.id !== 1" @click="handleChangePwd(scope.row)">修改密码</el-button>
          <el-button type="defalut" size="mini" v-perm="'button.account.view'" :disabled="!hasPerm('button.account.view')" @click="handleView(scope.row)">查看</el-button>
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
      :title="accountFormTitle"
      :visible.sync="canVisibleAccountDialog"
    >
      <el-form
        ref="accountForm"
        label-width="6em"
        :model="accountFormData"
        :rules="accountFormRules"
        :disabled="action === 'view'"
      >
        <el-form-item prop="accountId" label="账户ID">
          <el-input type="text" v-model="accountFormData.accountId" />
        </el-form-item>

        <el-form-item prop="accountPwd" label="账户密码" v-if="action === 'create'">
          <el-input type="password" v-model="accountFormData.accountPwd" />
        </el-form-item>

        <el-form-item prop="accountPwdConfirm" label="确认密码" v-if="action === 'create'">
          <el-input type="password" v-model="accountFormData.accountPwdConfirm" />
        </el-form-item>

        <el-form-item prop="accountAvatar" label="账户头像">
          <el-input type="text" v-model="accountFormData.accountAvatar" />
        </el-form-item>

        <el-form-item prop="accountRoleId" label="账户角色">
          <el-select v-model="accountFormData.accountRoleId" placeholder="请选择">
            <el-option
              v-for="(item, index) in roleOptions"
              :label="item.role_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="accountPerms" label="权限" v-if="accountFormData.accountRoleId">
          <el-checkbox-group v-model="accountFormData.accountPerms">
            <el-checkbox
              v-for="(item, index) in permOptions"
              :key="item.id"
              :label="item.id"
            >
              {{ item.perm_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisibleAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSave" :loading="postLoading">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      :title="`修改密码 <${accountFormData.accountId}>`"
      :visible.sync="canVisiblePwdDialog"
    >
      <el-form
        ref="pwdForm"
        label-width="6em"
        :model="accountFormData"
        :rules="accountFormRules"
      >
        <el-form-item prop="accountPwdOld" label="原始密码">
          <el-input type="password" v-model="accountFormData.accountPwdOld" />
        </el-form-item>

        <el-form-item prop="accountPwd" label="新密码">
          <el-input type="password" v-model="accountFormData.accountPwd" />
        </el-form-item>

        <el-form-item prop="accountPwdConfirm" label="确认密码">
          <el-input type="password" v-model="accountFormData.accountPwdConfirm" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisiblePwdDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePwdSave" :loading="postLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>
