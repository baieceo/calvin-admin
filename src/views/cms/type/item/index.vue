<style lang="scss" src="./styles.scss"></style>

<template>
  <div class="app-container">
    <div class="actions">
      <el-button
        @click="handleBack"
      >返回</el-button>

      <el-button 
        v-if="action === 'create' || action === 'modify'"
        type="primary"
        :loading="saveLoading"
        @click="handleSaveForm"
      >保存</el-button>
    </div>

    <el-tabs type="card">
      <el-tab-pane :label="actionName + '分类'">
        <div v-if="action === 'modify' || action === 'viewer'" class="summary">
          <div class="summary-item" v-if="formData.id">
            <label>分类ID：</label>
            <span>{{ formData.id }}</span>
          </div>
          <div class="summary-item" v-if="formData.create_account_name">
            <label>创建人：</label>
            <span>{{ formData.create_account_name }}</span>
          </div>
          <div class="summary-item" v-if="formData.create_time">
            <label>创建时间：</label>
            <span>{{ formData.create_time }}</span>
          </div>
          <div class="summary-item" v-if="formData.editor_account_name">
            <label>编辑人：</label>
            <span>{{ formData.editor_account_name }}</span>
          </div>
          <div class="summary-item" v-if="formData.editor_time">
            <label>编辑时间：</label>
            <span>{{ formData.editor_time }}</span>
          </div>
        </div>


        <el-alert
          title="请注意：分类创建后，分类目录及属性KEY、属性类型不可修改，属性只可新增，不可删除！"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px;"
        />

        
        <el-form 
          ref="typeForm"
          size="small"
          label-width="100px"
          :model="formData"
          :rules="formRules"
          :disabled="action === 'viewer'"
        >
          <el-form-item
            prop="path"
            label="分类目录"
          >
            <el-input v-model="formData.path" :disabled="action !== 'create'" />
          </el-form-item>
          <el-form-item
            prop="name"
            label="分类名称"
          >
            <el-input v-model="formData.name" />
          </el-form-item>

          <el-form-item label="属性列表" prop="props">
            <el-row v-for="(prop, index) in formData.props" :key="index" type="flex">
              <el-form-item required :label="'属性' + (index + 1)" label-width="80px" />
              <el-form-item 
                label="KEY"
                :prop="'props.' + index + '.key'" 
                :rules="[{
                  required: true, message: 'KEY不能为空', trigger: 'blur',
                }, { validator: validatePropKey, trigger: 'blur' }]"
              >
                <el-input v-model="prop.key" :disabled="prop.__exist" />
              </el-form-item>

              <el-form-item 
                label="名称"
                :prop="'props.' + index + '.label'" 
                :rules="{
                  required: true, message: '名称不能为空', trigger: 'blur'
                }"
              >
                <el-input v-model="prop.label" />
              </el-form-item>
              
              <el-form-item 
                label="类型"
                :prop="'props.' + index + '.type'" 
                :rules="{
                  required: true, message: '类型不能为空', trigger: 'change'
                }"
              >
                <el-select v-model="prop.type" :disabled="prop.__exist">
                  <el-option
                    v-for="(type, index) in typeOptions"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 10px;" v-if="action === 'create' || action === 'modify'">
                <el-button type="danger" icon="el-icon-delete" @click.prevent="handleRemoveProp(prop)" :disabled="prop.__exist">删除</el-button>
              </el-form-item>
            </el-row>

            <el-row v-if="action === 'create' || action === 'modify'">
              <el-col>
                <el-button type="primary" @click="handleAddProp">新增属性</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script src="./app.js"></script>
