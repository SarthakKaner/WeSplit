# Backend Implementation Notes for Expense Editing & Deletion

## Overview

The frontend now supports full CRUD operations for both regular and recurring expenses. The following backend implementations are required to complete the functionality.

## Required Backend Endpoints

### Regular Expenses

1. **PUT /api/groups/{groupId}/expenses/{expenseId}**

   - Update existing expense
   - Include validation for member permissions
   - Handle balance recalculation
   - Return updated expense data

2. **DELETE /api/groups/{groupId}/expenses/{expenseId}**
   - Delete expense (soft delete recommended)
   - Require member approval workflow (configurable)
   - Recalculate group balances
   - Create audit trail entry

### Recurring Expenses

1. **PUT /api/recurring-expenses/{recurringId}**

   - Update recurring expense template
   - Recalculate next due dates
   - Handle changes to cycle/start date
   - Update related future expenses if applicable

2. **DELETE /api/recurring-expenses/{recurringId}**
   - Delete recurring expense template
   - Handle orphaned future expenses
   - Require member approval if expenses already generated

## Security & Permissions

### Member Approval Workflow

- **Who can edit/delete**:
  - Original expense creator
  - Group administrators
  - All members (with approval)
- **Approval process**:
  - Send notifications to affected members
  - Require majority approval for deletion
  - Allow immediate edit for creator within X hours
  - Track approval status in database

### Audit Trail Requirements

- **Track changes**:
  - Original expense data
  - Modified fields
  - User who made changes
  - Timestamp of changes
  - Approval history
- **Storage**:
  - Separate audit table
  - Immutable records
  - Link to original expense

## Data Validation

### Edit Validation

- Ensure split members are still valid group members
- Validate amount changes don't break existing settlements
- Check if expense is already settled (prevent editing)
- Verify permissions based on time elapsed since creation

### Delete Validation

- Check if expense is part of completed settlement
- Validate user permissions
- Ensure all affected members are notified
- Handle recurring expense dependencies

## Balance Recalculation

### On Edit

- Calculate difference between old and new amounts
- Update member balances accordingly
- Recalculate group total balance
- Handle split method changes

### On Delete

- Reverse all balance effects
- Update member balances
- Recalculate group totals
- Handle settlement implications

## Notifications

### Required Notifications

- **Edit notifications**: "User X modified expense Y"
- **Delete requests**: "User X wants to delete expense Y"
- **Approval needed**: "Expense deletion requires your approval"
- **Changes approved**: "Expense changes have been approved"

### Notification Channels

- In-app notifications
- Email notifications (configurable)
- Push notifications (if mobile app)

## Recurring Expense Specifics

### Template vs Generated Expenses

- **Template changes**: Only affect future generations
- **Generated expense edits**: Should be treated as regular expenses
- **Cascade options**: Allow user to choose whether to update future instances

### Date Handling

- Recalculate next due date when cycle/start date changes
- Handle timezone considerations
- Manage leap years and month-end dates properly
- Support irregular cycles (every 2 weeks, every 3 months, etc.)

## Error Handling

### Common Error Scenarios

- User lacks permission to edit/delete
- Expense already settled/locked
- Invalid member selections
- Concurrent modification conflicts
- Network connectivity issues

### Frontend Error Display

- Clear, actionable error messages
- Suggest alternative actions when appropriate
- Maintain form state during errors
- Provide retry mechanisms

## Database Schema Changes

### Expenses Table

```sql
ALTER TABLE expenses ADD COLUMN last_modified TIMESTAMP;
ALTER TABLE expenses ADD COLUMN modified_by VARCHAR(255);
ALTER TABLE expenses ADD COLUMN version INTEGER DEFAULT 1;
```

### Audit Trail Table

```sql
CREATE TABLE expense_audit (
  id UUID PRIMARY KEY,
  expense_id UUID REFERENCES expenses(id),
  action VARCHAR(50), -- 'created', 'updated', 'deleted'
  user_id UUID,
  changes JSONB, -- Store old and new values
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### Approval Workflow Table

```sql
CREATE TABLE expense_approvals (
  id UUID PRIMARY KEY,
  expense_id UUID REFERENCES expenses(id),
  action VARCHAR(50), -- 'edit', 'delete'
  requested_by UUID,
  approved_by UUID[],
  status VARCHAR(50), -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Priority

1. **High Priority**:

   - Basic edit/delete functionality
   - Permission validation
   - Balance recalculation

2. **Medium Priority**:

   - Member approval workflow
   - Basic audit trail
   - Error handling

3. **Low Priority**:
   - Advanced notifications
   - Detailed audit features
   - Complex recurring patterns

## Testing Requirements

### Unit Tests

- Edit/delete operations
- Permission validation
- Balance calculations
- Date handling for recurring expenses

### Integration Tests

- End-to-end edit/delete workflows
- Member approval processes
- Notification delivery
- Concurrent modification handling

### User Acceptance Tests

- Complete user workflows
- Error scenario handling
- Mobile responsiveness
- Accessibility compliance
