/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import { observer } from "mobx-react";
// types
import type { TIssue } from "@plane/types";
// components
import { StateDropdown } from "@/components/dropdowns/state/dropdown";
// helpers
import { canTransitionIssueState } from "@/helpers/state-transition";
// hooks
import { useProjectState } from "@/hooks/store/use-project-state";

type Props = {
  issue: TIssue;
  onClose: () => void;
  onChange: (issue: TIssue, data: Partial<TIssue>, updates: any) => void;
  disabled: boolean;
};

export const SpreadsheetStateColumn = observer(function SpreadsheetStateColumn(props: Props) {
  const { issue, onChange, disabled, onClose } = props;
  const { getStateById } = useProjectState();

  return (
    <div className="h-11 border-b-[0.5px] border-subtle">
      <StateDropdown
        projectId={issue.project_id ?? undefined}
        value={issue.state_id}
        onChange={(data) => {
          if (!canTransitionIssueState({ targetStateId: data, assigneeIds: issue.assignee_ids, getStateById })) return;
          onChange(issue, { state_id: data }, { changed_property: "state", change_details: data });
        }}
        disabled={disabled}
        buttonVariant="transparent-with-text"
        buttonClassName="text-left rounded-none group-[.selected-issue-row]:bg-accent-primary/5 group-[.selected-issue-row]:hover:bg-accent-primary/10 px-page-x"
        buttonContainerClassName="w-full"
        onClose={onClose}
        showTooltip
      />
    </div>
  );
});
