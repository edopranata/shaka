<template>
  <q-btn
    flat
    round
    dense
    class="menu-toggle"
    @click="$emit('toggle')"
    aria-label="Toggle Menu"
  >
    <div class="hamburger" :class="{ active: isOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <q-tooltip class="bg-grey-8">
      {{ isOpen ? $t('navigation.closeMenu') : $t('navigation.openMenu') }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.menu-toggle {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  padding: 8px;
}

.menu-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.3s ease-in-out;
  cursor: pointer;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: currentColor;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 8px;
}

.hamburger span:nth-child(3) {
  top: 16px;
}

.hamburger.active span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.active span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}
</style>
