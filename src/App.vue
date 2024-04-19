<script>
import PageTitle from './components/PageTitle.vue';
import Index from './pages/Index.vue';

export default {
  components: {
    PageTitle,
    Index
  }
}
</script>

<template>
  <div>
    <PageTitle title="Home" />
    <Index/>
  </div>
</template>
