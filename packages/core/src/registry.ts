import type { BlockDefinition, BlockType } from "./blocks"

export type BlockRegistry = {
  register: <T extends Record<string, unknown>>(def: BlockDefinition<T>) => void
  get: (type: BlockType) => BlockDefinition | undefined
  list: () => readonly BlockDefinition[]
}

export function createBlockRegistry(): BlockRegistry {
  const map = new Map<BlockType, BlockDefinition>()
  return {
    register(def) {
      map.set(def.type, def)
    },
    get(type) {
      return map.get(type)
    },
    list() {
      return [...map.values()]
    },
  }
}
