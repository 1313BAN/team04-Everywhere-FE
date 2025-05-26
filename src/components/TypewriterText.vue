<template>
  <div class="typewriter-container" :class="containerClass">
    <transition name="slide-fade" mode="out-in">
      <p :key="currentTextIndex" class="typewriter-text" :class="textClass">
        <i v-if="showIcon" :class="iconClass"></i>
        <span>{{ currentText }}</span>
      </p>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    required: true,
  },
  changeInterval: {
    type: Number,
    default: 3000, // 텍스트 전환 간격 (ms)
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  iconClass: {
    type: String,
    default: 'pi pi-info-circle mr-2 text-[var(--accent-color)]',
  },
  containerClass: {
    type: String,
    default: '',
  },
  textClass: {
    type: String,
    default: 'text-sm text-white/80',
  },
})

const currentTextIndex = ref(0)
const currentText = ref(props.texts[0] || '')
const currentKey = ref(Date.now()) // transition-group에 key로 사용
const showText = ref(true)

let timer = null

const updateText = () => {
  showText.value = false // 사라지게

  setTimeout(() => {
    currentTextIndex.value = (currentTextIndex.value + 1) % props.texts.length
    currentText.value = props.texts[currentTextIndex.value]
    currentKey.value = Date.now()
    showText.value = true // 다시 보이게
  }, 300) // 사라진 후 잠깐 대기 (애니메이션 고려)
}

onMounted(() => {
  timer = setInterval(updateText, props.changeInterval)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.typewriter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  overflow: hidden;
  text-align: center;
}

.typewriter-text {
  display: block;
  text-align: center;
  white-space: nowrap;
}

/* 슬라이드 페이드 애니메이션 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
