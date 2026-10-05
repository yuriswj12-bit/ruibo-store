alter table inquiries add column if not exists matched_oe text not null default '';
alter table sample_orders add column if not exists matched_oe text not null default '';
