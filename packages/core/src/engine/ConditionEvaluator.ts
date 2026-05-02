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
    result = result && actual === expected;
  }

  if (condition.has_item !== undefined) {
    result = result && ctx.inventory.includes(condition.has_item);
  }

  if (condition.location_id !== undefined) {
    result = result && ctx.locationId === condition.location_id;
  }

  if (condition.negate) {
    result = !result;
  }

  return result;
}
