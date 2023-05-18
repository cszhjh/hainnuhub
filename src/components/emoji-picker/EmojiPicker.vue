<template>
  <div class="emoji-picker">
    <div class="picker-container">
      <div
        class="category"
        v-for="category in categories"
        :key="`category-${category}`"
      >
        <span>{{ category }}</span>
        <div class="emojis-container">
          <button
            @click="handleEmojiClick($event, emoji)"
            v-for="(emoji, index) in categoryEmojis(category)"
            :key="`emoji-${index}`"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
    <div class="bottom-arrow" v-if="showArrow"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import data from "./emojis-data.json";

/**
 * Emoji Picker
 * Load emojis and  categories from the json file 'emojis-data.json'
 * Events:
 *  - 'emojiClick' event is fires when the user clicks on an emoji. The emoji is sent as event payload.
 * Props:
 * 	- 'showArrow' boolean to show or not the arrow at the bottom of the picker. True by default.
 */
const props = defineProps({
  showArrow: {
    type: Boolean,
    required: false,
    default: false
  }
});
const categories = computed(() => {
  return Object.keys(data);
});

const categoryEmojis = computed(() => (category) => {
  return Object.values(data[category]);
});

const emit = defineEmits(["emojiClick"]);
const handleEmojiClick = (e, emoji) => {
  e.preventDefault();
  emit("emojiClick", emoji);
};
</script>

<style lang="scss" scoped>
.emoji-picker {
  position: absolute;
  left: 0;
  top: 30px;
  display: flex;
  flex-direction: column;
  height: 20rem;
  width: 20rem;
  .picker-container {
    border-radius: 0.5rem;
    background: white;
    position: relative;
    padding: 1rem;
    overflow: auto;
    z-index: 1;
    .emojis-container {
      display: flex;
      flex-wrap: wrap;
    }
    .category {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      color: rgb(169, 169, 169);
      button {
        margin: 0.5rem;
        margin-left: 0;
        background: inherit;
        border: none;
        font-size: 1.75rem;
        padding: 0;
      }
    }
  }

  .bottom-arrow {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0.75rem;
    height: 0.75rem;
    transform: translate(-50%, 50%) rotate(45deg);
    background: white;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  }
}
</style>
