<script>
  export default {
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue']
  }
</script>
  
<template>
    <div class="mb-4">
        <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="input input-bordered w-full max-w-xs"
        />
    </div>
</template>