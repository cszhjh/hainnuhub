import { computed } from "vue";
import { useStore } from "vuex";

export function useMapper(mapper, mapFn) {
  const $store = useStore();
  const storeFns = mapFn(mapper);

  const storeMap = {};
  Object.keys(storeFns).forEach((fnKey) => {
    const fn = storeFns[fnKey].bind({ $store });
    storeMap[fnKey] = computed(fn);
  });

  return storeMap;
}
