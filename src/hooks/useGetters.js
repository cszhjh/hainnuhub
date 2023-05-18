import { mapGetters, createNamespacedHelpers } from "vuex";
import { useMapper } from "./useMapper";

export function useGetters(moduleName, mapper) {
  let mapperFn = mapGetters;

  if (moduleName && typeof moduleName === "string") {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters;
  } else {
    mapper = moduleName;
  }

  return useMapper(mapper, mapperFn);
}
