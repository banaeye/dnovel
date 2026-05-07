import type { Condition } from '../types/scene';
import type { FlagMap } from '../types/flag';

export interface ConditionContext {
  flags: FlagMap;
  inventory: string[];
  locationId: string;
}

export function evaluateCondition(
  condition: Condition | null | undefined,
  ctx: ConditionContext,
): boolean {
  if (!condition) return true;

  if (condition.and) {
    return condition.and.every((c) => evaluateCondition(c, ctx));
  }

  if (condition.or) {
    return condition.or.some((c) => evaluateCondition(c, ctx));
  }

  let result = true;

  if (condition.flag !== undefined) {
    const actual = ctx.flags[condition.flag];
    const expected = condition.value;
    if (expected !== undefined) {
      result = result && actual === expected;
    }
    if (condition.min !== undefined) {
      result = result && typeof actual === 'number' && actual >= condition.min;
    }
    if (condition.max !== undefined) {
      result = result && typeof actual === 'number' && actual <= condition.max;
    }
  }

  if (condition.has_item !== undefined) {
    result = result && ctx.inventory.includes(condition.has_item);
  }

  if (condition.item_count !== undefined) {
    const targets = new Set(condition.item_count.items);
    const count = ctx.inventory.filter((itemId) => targets.has(itemId)).length;
    if (condition.item_count.min !== undefined) {
      result = result && count >= condition.item_count.min;
    }
    if (condition.item_count.max !== undefined) {
      result = result && count <= condition.item_count.max;
    }
  }

  if (condition.location_id !== undefined) {
    result = result && ctx.locationId === condition.location_id;
  }

  if (condition.negate) {
    result = !result;
  }

  return result;
}
