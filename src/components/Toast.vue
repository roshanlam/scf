<template>
    <div :class="['toast-container', toastClass]">
      <div class="icon">
        <svg v-if="type === ToastType.SUCCESS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <svg v-else-if="type === ToastType.ERROR" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
      </div>
      <span class="toast-text">{{ message }}</span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { ToastType } from '../types/index';
  
  const props = defineProps({
    type: {
      type: String,
      default: ToastType.ERROR,
      validator: (value) => Object.values(ToastType).includes(value)
    },
    message: {
      type: String,
      required: true
    }
  });
  
  const toastClass = computed(() => {
    switch (props.type) {
      case ToastType.SUCCESS:
        return 'toast-success';
      case ToastType.WARNING:
        return 'toast-warning';
      default:
        return 'toast-error';
    }
  });
  </script>
  
  <style scoped>
  .toast-container {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    border-radius: 5px;
    margin: 10px;
    color: white;
    font-size: 16px;
  }
  
  .icon {
    margin-right: 12px;
  }
  
  .toast-success {
    background-color: #28a745; /* Green for success */
  }
  
  .toast-error {
    background-color: #dc3545; /* Red for error */
  }
  
  .toast-warning {
    background-color: #ffc107; /* Yellow for warning */
  }
  
  .toast-text {
    flex: 1;
  }
  </style>
  