<?php
require_once 'conf.php';
class StockSummaryService{

  public function readStockSummary($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = " select p.item_name, uom, opening_qty, receipt_qty, issue_qty
                    from  

                   (select a.item_id,item_name, b.uom, qty as opening_qty
                   from item_master a
                   join uom_master b on a.uom_code = b.uom_code
                   join transaction c on a.item_id = c.item_id
                   where transaction_type ='O') p
                   
                   left join  

                   (select a.item_id,item_name, sum(qty) as receipt_qty
                   from item_master a
                   join transaction c on a.item_id = c.item_id
                   where transaction_type ='R') q on p.item_id = q.item_id

                   left join 

                   (select a.item_id,item_name, sum(qty) as issue_qty
                   from item_master a
                   join transaction c on a.item_id = c.item_id
                   where transaction_type ='I') r on p.item_id=r.item_id

                   ";
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":category_code", $data->category_code);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);         
         $statement->execute();
         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $statement->fetchAll();
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }
  

  public function readItemsForIndent($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "select * from

                   (

                   (select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   stock, party_name, lp_price, lp_qty
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code
                   join (select qty as stock, item_id 
                        from stock_in_hand 
                        where financial_year_id=:financial_year_id) c on a.item_id = c.item_id

                   left join (select item_id,docket_id, lp_party_id, lp_price, lp_qty
                              from item_last_purchase 
                              where financial_year_id=:financial_year_id) d on a.item_id=d.item_id
                   left join party_master e on d.lp_party_id=e.party_id
                   where a.item_group_code = :item_group_code
                   and stock_type_code = :stock_type_code
                   and stock>0
                   order by item_name)


                   UNION

                   (select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   stock, party_name, lp_price, lp_qty
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code
                   join (select qty as stock, item_id 
                        from stock_in_hand 
                        where financial_year_id=:financial_year_id) c on a.item_id = c.item_id

                   left join (select item_id,docket_id, lp_party_id, lp_price, lp_qty
                              from item_last_purchase 
                              where financial_year_id=:financial_year_id) d on a.item_id=d.item_id
                   left join party_master e on d.lp_party_id=e.party_id
                   where a.item_group_code = :item_group_code
                   and stock_type_code = :stock_type_code
                   and stock=0
                   order by item_name)
                   

                   
                   )a 

                   ";
       
                            
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":item_group_code", $data->item_group_code);
         $statement->bindParam(":stock_type_code", $data->stock_type_code);       
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);      
         $statement->execute();
         $materials=$statement->fetchAll();
         $items=array();
         foreach ($materials as $key => $value) {
          $tempRow = array();
          $tempRow['item_id'] = $value['item_id']; 
          $tempRow['item_name'] = utf8_encode($value['item_name']);
          $tempRow['item_description'] = utf8_encode($value['item_description']);
          $tempRow['max_level'] = utf8_encode($value['max_level']);
          $tempRow['min_level'] = utf8_encode($value['min_level']);
          $tempRow['reorder_level'] = utf8_encode($value['reorder_level']);
          $tempRow['reorder_qty'] = utf8_encode($value['reorder_qty']);
          $tempRow['location'] = utf8_encode($value['location']);
          $tempRow['party_name'] = utf8_encode($value['party_name']);
          
          $tempRow['item_group_code'] = $value['item_group_code'];
          $tempRow['uom_code'] = $value['uom_code'];
          $tempRow['item_group'] = $value['item_group'];
          $tempRow['stock_type_code'] = $value['stock_type_code'];
          $tempRow['stock'] = $value['stock'];
          $tempRow['lp_price'] = $value['lp_price'];
          $tempRow['lp_qty'] = $value['lp_qty'];
          $items[] = $tempRow;
         } 

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $items;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


   public function searchItems($data) {
    print_r($data);
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         
         $search_term=" like '%".$data->search_term."%'";

          $query = "select a.item_id,  a.item_name, a.item_group_code, uom_code, item_group,
                   stock_type_code, item_description,
                   max_level, min_level, reorder_level, reorder_qty, location,
                   stock, party_name, lp_price, lp_qty
                   from item_master a
                   join item_group_master b on a.item_group_code = b.item_group_code

                   join (select qty as stock, item_id 
                        from stock_in_hand 
                        where financial_year_id=:financial_year_id) c on a.item_id = c.item_id

                   left join (select item_id,docket_id, lp_party_id, lp_price, lp_qty
                              from item_last_purchase 
                              where financial_year_id=:financial_year_id) d on a.item_id=d.item_id

                   left join party_master e on d.lp_party_id=e.party_id
                   where (item_name " . $search_term . " or a.item_id=:item_id)
                   and stock_type_code='".$data->stock_type_code."' 
                   order by 2";          
                   
         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(':item_id', $data->search_term);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);     
         $statement->execute();
         $materials=$statement->fetchAll();
         $items=array();
         foreach ($materials as $key => $value) {
          $tempRow = array();
          $tempRow['item_id'] = $value['item_id']; 
          $tempRow['item_name'] = utf8_encode($value['item_name']);
          $tempRow['item_description'] = utf8_encode($value['item_description']);
          $tempRow['max_level'] = utf8_encode($value['max_level']);
          $tempRow['min_level'] = utf8_encode($value['min_level']);
          $tempRow['reorder_level'] = utf8_encode($value['reorder_level']);
          $tempRow['reorder_qty'] = utf8_encode($value['reorder_qty']);
          $tempRow['location'] = utf8_encode($value['location']);
          $tempRow['party_name'] = utf8_encode($value['party_name']);
          
          $tempRow['item_group_code'] = $value['item_group_code'];
          $tempRow['uom_code'] = $value['uom_code'];
          $tempRow['item_group'] = $value['item_group'];
          $tempRow['stock_type_code'] = $value['stock_type_code'];
          $tempRow['stock'] = $value['stock'];
          $tempRow['lp_price'] = $value['lp_price'];
          $tempRow['lp_qty'] = $value['lp_qty'];
          $items[] = $tempRow;
         } 

         $rdata = array();
         $rdata['status'] = "s";
         $rdata['items'] = $items;
         return $rdata;
      }catch(PDOException $e){
         $objPDO = null;
         $error['error'] = $e->getMessage();
         return $error;
      }
   }


}
?>
