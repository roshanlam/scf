<script>
import PageTitle from './components/PageTitle.vue';
import Index from './pages/Index.vue';

export default {
  
}
</script>

<template>
  <div id="app">
    <PageTitle title="Home" />
    <main>
      <router-view />
    </main>
  </div>
</template>
