<template>
  <div v-if="isVisible" class="share-popup-overlay">
    <div class="share-popup">
      <h3>分享链接</h3>
      <div class="share-link">
        <input type="text" :value="shareUrl" ref="linkInput" />
        <button @click="copyLink">复制</button>
      </div>
      <p v-if="copySuccess" class="copy-success">链接已成功复制!</p>
      <button class="close-button" @click="closePopup">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  shareUrl: String
})

const emit = defineEmits(['update:isVisible'])

const linkInput = ref(null)
const copySuccess = ref(false)

const copyLink = () => {
  if (linkInput.value) {
    linkInput.value.select()
    document.execCommand('copy')
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

const closePopup = () => {
  emit('update:isVisible', false)
}
</script>

<style scoped>
.share-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.share-popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  color: black;
}

.share-link {
  display: flex;
  margin-bottom: 15px;
}

.share-link input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}

.share-link button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.close-button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.copy-success {
  color: #4caf50;
  margin-top: 10px;
}
</style>
