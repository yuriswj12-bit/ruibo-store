-- Catalog page prints 1K0998262H on RBAU-2862H. 0004 stored 06D906262H.
update oe_refs
set raw_oe = '1K0998262H', normalized_oe = '1K0998262H'
where normalized_oe = '06D906262H'
  and product_id in (select id from products where factory_id = 'fac_xinda' and sku = 'RBAU-2862H');
