<script>
import PageTitle from './components/PageTitle.vue';
import HomeHero from './pages/HomeHero.vue';
import HomeSteps from './pages/HomeSteps.vue';

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
    <HomeHero />
    <HomeSteps />
  </div>
</template>
