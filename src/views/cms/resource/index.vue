<style src="./styles.scss" lang="scss" scoped></style>

<template>
  <div class="app-container">
    <div class="actions">
      <el-button 
        type="default"
        icon="el-icon-upload"
        :disabled="role.id !== 1 || !hasPerm('button.cms.resource.create')"
        @click="canVisibleUploadDialog = true"
      >上传文件</el-button>
      <el-button 
        type="primary"
        icon="el-icon-folder-add"
        :disabled="role.id !== 1 || !hasPerm('button.cms.resource.create')"
        @click="canVisibleAddFolderDialog = true"
      >新建文件夹</el-button>
    </div>

    <div class="resources">
      <div class="resources-nav">
        <ul class="resources-nav-list">
          <li class="resources-nav-item" v-for="(item, index) in navs" @click="handleNavClick(item)"><span v-if="index">{{ index ? '/' : '' }}</span><span class="text">{{ item.label || item.name }}</span></li>
        </ul>
      </div>
      <div  v-loading="listLoading">
        <ul v-if="list.length" class="resources-list">
          <li class="resources-item" v-for="(item, index) in list" :key="index" :title="item.name">
            <div class="resources-thumb">
              <template v-if="item.isDirectory">
                <i class="el-icon-folder"></i>
              </template>

              <template v-else-if="item.isFile">
                <i class="el-icon-document"></i>
              </template>

              <template v-else-if="item.isImage">
                <div class="resources-image" :style="{ 'background-image': 'url(' + item.url + ')' }" @click="handlePicturePreview(item)"></div>
              </template>
            </div>
            <div class="resources-title">
              {{ item.name }}
            </div>

            <div class="resources-actions">
                <template v-if="item.type === 'file'">
                  <a class="link" :href="item.url" target="_blank">
                    <el-button type="primary" size="mini" icon="el-icon-view" plain></el-button>
                  </a>
                </template>

                <template v-if="item.type === 'directory'">
                  <a class="link" href="javascript:;">
                    <el-button type="primary" size="mini" icon="el-icon-view" plain @click="handleDirectory(item)" :disabled="role.id !== 1 || !hasPerm('button.cms.resource.view')"></el-button>
                  </a>
                </template>
                
                <a class="link" href="javascript:;"><el-button type="info" size="mini" icon="el-icon-edit" plain @click="handleRename(item)" :disabled="role.id !== 1 || !hasPerm('button.cms.resource.modify')"></el-button></a>

                <a class="link" href="javascript:;"><el-button type="danger" size="mini" icon="el-icon-delete" plain @click="handleRemove(item)" :disabled="role.id !== 1 || !hasPerm('button.cms.resource.remove')"></el-button></a>
            </div>
          </li>
        </ul>
        <div v-else class="tips">空文件夹</div>
      </div>
      
      
    </div>


    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-dialog
      title="新建文件夹"
      :visible.sync="canVisibleAddFolderDialog"
    >
      <el-form ref="folderForm" :model="folderFormData" :rules="folderFormRules" label-width="8em">
        <el-form-item label="文件夹名称" prop="name">
          <el-input v-model="folderFormData.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisibleAddFolderDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddFolder" :loading="postLoading" :disabled="role.id !== 1 || !hasPerm('button.cms.resource.create')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="重命名"
      :visible.sync="canVisibleRenameDialog"
    >
      <el-form ref="renameForm" :model="renameFormData" :rules="renameFormRules" label-width="8em">
        <el-form-item label="名称" prop="name">
          <el-input v-model="renameFormData.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisibleRenameDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRenameSubmit" :loading="postLoading" :disabled="role.id !== 1 || !hasPerm('button.cms.resource.modify')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="上传文件"
      :visible.sync="canVisibleUploadDialog"
    >
      <el-form ref="uploadForm" :model="uploadFormData" :rules="uploadFormRules" label-width="8em">
        <el-form-item label="选择文件" prop="file">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :limit="1"
            :http-request="uploadFileHttpRequest"
            :file-list="uploadFormData.file">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canVisibleUploadDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleUploadFile" :loading="postLoading" :disabled="role.id !== 1 || !hasPerm('button.cms.resource.create')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./app.js"></script>
