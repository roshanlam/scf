<script>
import PageTitle from './components/PageTitle.vue';
import Index from './pages/Index.vue';

export default {
  components: {
    PageTitle,
    HomeHero,
    HomeSteps
  }
}
</script>

<template>
  <div>
    <PageTitle title="Home" />
    <Index/>
  </div>
</template>
