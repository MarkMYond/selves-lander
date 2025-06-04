<template>
  <div class="my-6">
    <h4 v-if="block.title" class="font-semibold text-lg mb-3">
      {{ block.title }}
    </h4>
    <ul v-if="block.tasks && block.tasks.length > 0" class="space-y-2">
      <li
        v-for="task in block.tasks"
        :key="task.id"
        class="flex items-center"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          class="mr-2 h-4 w-4 rounded border-brand-primary text-primary focus:ring-primary disabled:opacity-50" <!-- Changed border-gray-300 to border-brand-primary -->
          disabled
        />
        <!-- Keep checkbox disabled for display purposes -->
        <span :class="{ 'line-through text-gray-500': task.completed }">
          {{ task.text }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// Define the structure for a single task item
interface TaskItem {
  id?: string; // Array items often have an 'id' from Payload
  text: string;
  completed?: boolean;
}

// Assuming structure for TaskListBlock data from Payload
interface TaskListBlockData {
  id?: string;
  blockType: 'taskListBlock';
  title?: string;
  tasks: TaskItem[];
}

const props = defineProps({
  block: {
    type: Object as PropType<TaskListBlockData>,
    required: true,
  },
})

// Note: The checkboxes are disabled as this is a display component.
// If interactivity is needed later, state management and API updates would be required.
</script>

<style scoped>
/* Add specific list styling if needed */
</style>
