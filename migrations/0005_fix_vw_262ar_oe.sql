-- Page 6 prints 06K, not 06A, on RBVW-262AR. 0004 already applied the misread.
update oe_refs
set raw_oe = '06K906262CF', normalized_oe = '06K906262CF'
where normalized_oe = '06A906262CF'
  and product_id in (select id from products where factory_id = 'fac_xinda' and sku = 'RBVW-262AR');

update oe_refs
set raw_oe = '06K906262BA', normalized_oe = '06K906262BA'
where normalized_oe = '06A906262BA'
  and product_id in (select id from products where factory_id = 'fac_xinda' and sku = 'RBVW-262AR');
