<template>
  <div class="app-container">
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
      <el-table-column label="ID" width="60" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="申请ID" width="80" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.apply_id }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="手机" width="110" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="微信" width="150" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.wechat }}
        </template>
      </el-table-column>
      <el-table-column label="年级" width="100">
        <template slot-scope="scope">
          {{ scope.row.grade }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope" width="100">
          {{ scope.row.status ? '已读' : '未读' }}
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.editor_time }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="!hasPerm('button.message.modify')" @click="handleModify(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" :disabled="!hasPerm('button.message.remove')" @click="handleRemove(scope.row)">删除</el-button>
          <el-button type="default" size="mini" :disabled="!hasPerm('button.message.remove')" @click="handleView(scope.row)">查看</el-button>
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
      :title="applyFormTitle"
      :visible.sync="canVisibleApplyDialog"
      width="800px"
    >
      <el-form
        ref="applyForm"
        label-width="6em"
        v-loading="applyLoading"
        label-suffix=":"
        :model="applyFormData"
        :rules="applyFormRules"
        :disabled="action === 'view'"
        style="width: 750px;"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="ID">
              {{ applyFormData.id }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="申请ID">
              {{ applyFormData.apply_id }}
            </el-form-item>
          </el-col>
        
          <el-col :span="8">
            <el-form-item label="姓名">
              {{ applyFormData.name }}
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="邮箱">
              {{ applyFormData.email }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="手机">
              {{ applyFormData.mobile }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="微信">
              {{ applyFormData.wechat }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="年级">
              {{ applyFormData.grade }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="申请时间">
              {{ applyFormData.create_time }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="操作人员">
              {{ applyFormData.editor_name }}
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="操作时间">
              {{ applyFormData.editor_time }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容">
          {{ applyFormData.content }}
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="applyFormData.status">
            <el-option label="未处理" :value="0" />
            <el-option label="已处理" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" resize="none" :rows="2" v-model="applyFormData.remarks" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisibleApplyDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSave" :loading="postLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>
