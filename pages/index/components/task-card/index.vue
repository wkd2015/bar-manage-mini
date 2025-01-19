<script setup>
import { defineProps } from "vue"

const props = defineProps({
  task: {
    type: Object,
    default: {
      id: '',
      publisher: '',
      publisher_id: '',
      executor: '',
      executor_id: '',
      level: 0,
      create_time: '',
      end_time: '',
      name: '',
      status: 0,
      description: ''
    }
  }
})
</script>

<template>
  <view class="task-card">
    <view class="task-card-header">
      <view class="task-card-header-name">
        {{ task.name }}
      </view>
      <view class="task-card-header-status">
        {{ task.status }}
      </view>
    </view>
    <view class="task-card-content">
      {{ task.description }}
    </view>
    <view class="task-card-footer">
      <view class="task-card-footer-time">
        {{ task.create_time }}
      </view>
      <view class="task-card-footer-time">
        {{ task.end_time }}
      </view>
    </view>
  </view>
</template>