# PM SETU role workspace and operational UX contract

Status: UX implementation contract. The sections below describe the target experience and are not a claim that every workflow is currently available.

## Workspace principles

- Show each signed-in user their role, assigned organisations and the tasks they can perform.
- Put the user's most common next action first: continue draft, complete missing information, submit report or review assigned submission.
- Keep public directories read-only and separate from authenticated operational forms.
- Display clear status labels, last-updated timestamps, validation messages and submission history.
- Never present a disabled or unconnected control as a working action.
- Explain permission boundaries in plain language; do not expose technical IDs as the primary label.

## Role workspace landing pages

| Role | Primary workspace sections |
|---|---|
| Super Admin | Platform overview, users, roles, organisation access, approvals, audit, content |
| State PMU Admin | State overview, cluster progress, submissions, escalations, reports |
| DET Content Admin | Documents, news, gallery, banners, public enquiries |
| Cluster Admin | Assigned cluster, institutes, institute submissions, cluster reports |
| Hub ITI User | Assigned Hub ITI, institute profile, personnel, trades, training, reports |
| Spoke ITI User | Assigned Spoke ITI, institute profile, personnel, trades, training, reports |
| AIP User | Assigned industry partner, activities, training partnerships, placements |
| SPV User | Assigned SPV, SPV profile, linked SIPs, implementation progress |
| Approving Authority | My approval queue, submission details, decision history |
| Dashboard Viewer | Read-only dashboards and reports |

## Simple navigation

Use a consistent page structure:
1. Breadcrumb and page title.
2. Short sentence explaining the user's task.
3. Assigned organisation selector only when multiple assignments exist.
4. Primary task card (continue draft / submit / review).
5. Secondary sections in tabs or grouped cards.
6. Recent activity and submission history.

Avoid making users navigate through the public directory to find an edit form. An assigned organisation card should open its authenticated workspace directly.

## Form behaviour

- Group fields into short sections with plain-language headings.
- Mark required fields and explain why they are needed.
- Validate on blur and on submit; preserve entered values after server validation errors.
- Use save-as-draft and submit-for-review as distinct actions.
- Confirm destructive actions and explain their consequences.
- Show a success message only after the server confirms the operation.
- Display read-only fields distinctly from editable fields.
- Support narrow screens and keyboard navigation.

## Submission status vocabulary

Use consistent labels:
- Draft
- Submitted
- Under scrutiny
- Revision requested
- Recommended
- Approved
- Rejected
- Implementation

A status change must come from a successful backend transition response. The frontend must not optimistically invent approval status.

## Role guide

Each workspace should include a concise "My responsibilities" help page with:
- what the role is responsible for;
- what data the user can edit;
- what they can view but not edit;
- who reviews their submissions;
- how to correct a returned submission;
- where to find decision and audit history.

The guide must be generated from the approved permission/workflow matrix and updated alongside API changes.

## Accessibility and usability checklist

- Visible keyboard focus and logical tab order.
- Inputs have persistent labels, not placeholder-only labels.
- Error summaries link to invalid fields.
- Status is communicated with text, not colour alone.
- Buttons have clear action verbs.
- Tables have responsive alternatives on mobile.
- Destructive actions require confirmation.
- Empty states explain the next useful action.

## Current limitations

This document is a UX contract only. It does not add forms, routes or API integration. Operational UI must be delivered together with working backend endpoints and server-side scope enforcement.
