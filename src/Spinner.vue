<!-- eslint-disable vue/multi-word-component-names -->
// eslint-disable-next-line vue/multi-word-component-names
<template>
    <div class="spinner">
      <div class="spinner-icon"></div>
    </div>
</template>
  
  <style scoped>
  .spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .spinner-icon {
    border: 4px solid #3498db;
    border-top: 4px solid transparent;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  