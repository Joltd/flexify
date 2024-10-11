alter table branches add column properties jsonb;

alter table workspaces add column properties jsonb;

alter table tasks add column properties jsonb;

alter table workspaces drop column task_tracker;