# Cluster Admin workspace guide

Cluster Admin users see only their assigned clusters. The workspace provides:
- Cluster overview and institute counts.
- A queue of Hub/Spoke ITI reports submitted by institutes in the assigned cluster.
- Review actions for submitted ITI reports: approve, request revision or reject, with required remarks.
- Cluster progress report creation, draft tracking and submission to State PMU.
- Status and reviewer feedback for cluster reports.

The workspace is separate from the public cluster directory. Access is granted through the authenticated workspace route and is enforced again by the backend for each resource ID.

The backend workflow endpoints and migration must be deployed before enabling this frontend.
