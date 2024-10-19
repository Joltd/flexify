alter table sprint_tasks add column performed boolean default false;

update sprint_tasks set performed = false where performed is null;