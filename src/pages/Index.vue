<script>
import BaseInput from '../components/BaseInput.vue';
import Button from '../components/Button.vue';

export default {
  components: {
    BaseInput,
    Button
  },
  data() {
    return {
      todo: {
        title: '',
        description: ''
      }
    };
  },
  methods: {
    submitTodo() {
      this.$emit('add-todo', {...this.todo});
      this.resetForm();
    },
    resetForm() {
      this.todo.title = '';
      this.todo.description = '';
    }
  }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-10">
      <form @submit.prevent="submitTodo">
        <div class="mb-4">
          <BaseInput
            v-model="todo.title"
            placeholder="Title"
            class="mb-2"
          />
        </div>
        <div class="mb-4">
          <BaseInput
            v-model="todo.description"
            placeholder="Description"
            type="text"
          />
        </div>
        <BaseButton
          variant="primary"
          type="submit"
        >
          Add Todo
        </BaseButton>
      </form>
    </div>
  </template>

  