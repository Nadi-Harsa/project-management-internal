/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { IState, TStateGroups } from "@plane/types";

const GATED_STATE_GROUPS: TStateGroups[] = ["started", "completed"];

/**
 * Returns true if moving to `targetStateId` is allowed given the current
 * assignees. If the target state's group is Started or Completed and the
 * issue has no assignees, the transition is blocked and a toast is shown.
 */
export function canTransitionIssueState(params: {
  targetStateId: string | null | undefined;
  assigneeIds: string[] | null | undefined;
  getStateById: (stateId: string | null | undefined) => IState | undefined;
}): boolean {
  const { targetStateId, assigneeIds, getStateById } = params;
  if (!targetStateId) return true;
  const targetState = getStateById(targetStateId);
  if (!targetState || !GATED_STATE_GROUPS.includes(targetState.group)) return true;
  const hasAssignee = Array.isArray(assigneeIds) && assigneeIds.length > 0;
  if (hasAssignee) return true;

  setToast({
    type: TOAST_TYPE.ERROR,
    title: "Assignee required",
    message: `Add at least one assignee before moving this work item to ${targetState.name}.`,
  });
  return false;
}
