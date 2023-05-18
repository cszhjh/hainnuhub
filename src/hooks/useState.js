import { mapState, createNamespacedHelpers } from "vuex";
import { useMapper } from "./useMapper";

export function useState(moduleName, mapper) {
  let mapperFn = mapState;

  if (moduleName && typeof moduleName === "string") {
    mapperFn = createNamespacedHelpers(moduleName).mapState;
  } else {
    mapper = moduleName;
  }

  return useMapper(mapper, mapperFn);
}
