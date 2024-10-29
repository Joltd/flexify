alter table branches add column created_at timestamp;
alter table branches add column updated_at timestamp;
update branches set created_at = now(), updated_at = now();
alter table branches alter column created_at set not null;
alter table branches alter column updated_at set not null;

alter table employees add column created_at timestamp;
alter table employees add column updated_at timestamp;
update employees set created_at = now(), updated_at = now();
alter table employees alter column created_at set not null;
alter table employees alter column updated_at set not null;

alter table merge_requests add column created_at timestamp;
alter table merge_requests add column updated_at timestamp;
update merge_requests set created_at = now(), updated_at = now();
alter table merge_requests alter column created_at set not null;
alter table merge_requests alter column updated_at set not null;

alter table repositories add column created_at timestamp;
alter table repositories add column updated_at timestamp;
update repositories set created_at = now(), updated_at = now();
alter table repositories alter column created_at set not null;
alter table repositories alter column updated_at set not null;

alter table sprints add column created_at timestamp;
update sprints set created_at = now(), updated_at = now();
alter table sprints alter column created_at set not null;

alter table sprint_tasks add column created_at timestamp;
update sprint_tasks set created_at = now(), updated_at = now();
alter table sprint_tasks alter column created_at set not null;

alter table tasks add column created_at timestamp;
update tasks set created_at = now(), updated_at = now();
alter table tasks alter column created_at set not null;

alter table workspaces add column created_at timestamp;
alter table workspaces add column updated_at timestamp;
update workspaces set created_at = now(), updated_at = now();
alter table workspaces alter column created_at set not null;
alter table workspaces alter column updated_at set not null;

alter table merge_requests add column status text;
update merge_requests set status = 'WAITING';