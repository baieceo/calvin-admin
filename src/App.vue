<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
.aui-filter {
	background: #F5F5F5;
	padding: 10px;
	margin-bottom: 10px;
}

.actions {
	display: flex;
	justify-content: flex-end;
	padding-bottom: 20px;
}

.pagination {
	text-align: center;
	padding: 10px;
}
</style>

<script>
export default {
  name: 'App'
}
</script>
