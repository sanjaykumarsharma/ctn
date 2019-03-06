<?php

DELIMITER $$
CREATE TRIGGER items_after_insert
AFTER INSERT ON item_master
FOR EACH ROW
BEGIN 
INSERT INTO stock_in_hand(item_id)
VALUES(new.item_id);
END$$
DELIMITER ;


$query21 = " select sum(r_qty-i_qty-rp_qty+o_qty+rs_qty) as qty from
          (
            select COALESCE(sum(qty),0) as r_qty, '' as i_qty, '' as rp_qty, '' as o_qty ,'' as rs_qty  from transaction where item_id=:item_id and transaction_type='R'
            UNION All
            select ''as r_qty, COALESCE(sum(qty),0) as i_qty, '' as rp_qty, '' as o_qty, '' as rs_qty from transaction where item_id=:item_id and transaction_type='I'
            UNION All
            select ''as r_qty, '' as i_qty, COALESCE(sum(qty),0) as rp_qty, '' as o_qty, '' as rs_qty from transaction where item_id=:item_id and transaction_type='RP'
            UNION All
            select ''as r_qty, '' as i_qty, '' as rp_qty, COALESCE(sum(qty),0) as o_qty, '' as rs_qty from transaction where item_id=:item_id and transaction_type='O'
            UNION All
            select ''as r_qty, '' as i_qty, '' as rp_qty, '' as o_qty, COALESCE(sum(qty),0) as rs_qty  from transaction where item_id=:item_id and transaction_type='RS'
          )a";
?>
