<style lang="scss" src="./styles.scss"></style>

<template>
  <div class="app-container">
    <div class="actions">
      <a :href="formData.url" target="_blank" style="margin-right: 10px;"><el-button
        v-if="formData.url"
        icon="el-icon-view"
      >预览</el-button></a>

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
      <el-tab-pane :label="actionName + '页面'">
        <div v-if="action === 'modify' || action === 'viewer'" class="summary">
          <div class="summary-item" v-if="formData.id">
            <label>页面ID：</label>
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

        <div v-if="formData.url" class="summary">
          <div class="summary-item" v-if="formData.id">
            <label>页面地址：</label>
            <span><a :href="formData.url" target="_blank">{{ formData.url }}</a></span>
          </div>
        </div>


        <el-alert
          title="请注意：页面创建后不可修改所属分类"
          type="info"
          show-icon
          :closable="false"
          style="margin-bottom: 20px;"
        />

        
        <el-form 
          ref="pageForm"
          size="small"
          label-width="100px"
          :model="formData"
          :rules="formRules"
          :disabled="action === 'viewer'"
        >
          <el-form-item
            prop="title"
            label="页面标题"
          >
            <el-input v-model="formData.title" />
          </el-form-item>

          <el-form-item
            prop="type"
            label="所属分类"
          >
            <el-select v-model="formData.type" :disabled="action !== 'create'" @change="handleTypeChange">
              <el-option
                v-for="(item, index) in typeListOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-form label-width="100px" :disabled="action === 'viewer'">
          <el-form-item
            v-for="prop in formData.props"
            size="small"
            :key="prop.key"
            :label="prop.label"
          >
            <template v-if="prop.type === 1">
              <el-input v-model="prop.value" />
            </template>

            <template v-if="prop.type === 2">
              <el-input type="textarea" :rows="3" v-model="prop.value" />
            </template>

            <template v-if="prop.type === 3">
              <el-row 
                v-for="(item, index) in prop.value" 
                :key="'prop-' + prop.type + '-' + index" 
                class="flex" 
                style="margin-bottom: 15px"
              >
                <label class="label">文本{{ index + 1 }}</label>
                <el-input class="flex-primary" v-model="prop.value[index]" />
                <el-button type="danger" icon="el-icon-delete" @click.prevent="handleRemoveItem(prop, index)" style="margin-left: 15px;">删除</el-button>
              </el-row>
              
              <el-row>
                <el-button 
                  type="primary" 
                  @click="handleAddItem(prop)"
                >
                  新增文本
                </el-button>
              </el-row>
            </template>

            <template v-if="prop.type === 5">
              <div class="thumb">
                <div class="thumb-img" :style="{ 'background-image': 'url(' + prop.value + ')' }">
                  <input
                    v-if="action === 'create' || action === 'modify'"
                    type="file"
                    class="thumb-input"
                    :action="`${prop.key}`"
                    accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                    multiple="multiple"
                    @change="handlePictureRequest"
                  />

                  <i v-if="!prop.value" class="el-icon-plus"></i>
                </div>
                
                <el-button type="danger" icon="el-icon-delete" @click.prevent="handleRemoveItem(prop)" class="thumb-btn">删除</el-button>
              </div>
            </template>

            <template v-if="prop.type === 6">
              <div v-for="(item, index) in prop.value" :key="'prop-' + prop.type + '-' + index" class="upload">
                <div class="thumb">
                  <div class="thumb-img" :style="{ 'background-image': 'url(' + item + ')' }">
                    <input
                      v-if="action === 'create' || action === 'modify'"
                      type="file"
                      class="thumb-input"
                      :action="`${prop.key}&${index}`"
                      accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                      multiple="multiple"
                      @change="handlePictureRequest"
                    />

                    <i v-if="!item" class="el-icon-plus"></i>
                  </div>
                  
                  <el-button type="danger" icon="el-icon-delete" @click.prevent="handleRemoveItem(prop, index)" class="thumb-btn">图片{{ index + 1 }}</el-button>
                </div>
              </div>

              <el-row>
                <el-button 
                  type="primary" 
                  
                  @click="handleAddItem(prop)"
                >
                  新增图片
                </el-button>
              </el-row>
              
            </template>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>
