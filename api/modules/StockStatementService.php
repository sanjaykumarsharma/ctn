<?php
require_once 'conf.php';
class StockStatementService{

  public function readStockStatement($data) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

         $query = "select a.item_id, item_name, qty, running_balance, uom_code,
                   transaction_type, date_format(transaction_date,'%d/%m/%Y') as tdate,
                   reject_to_party_qty, return_to_stock_qty
                   from transaction a
                   join item_master b on a.item_id=b.item_id
                   and financial_year_id=:financial_year_id
                   where  a.item_id=:item_id
                   order by transaction_date asc,transaction_id asc";

         $statement = $objPDO->prepare($query);
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->bindParam(":item_id", $data->item_id);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']);
         $statement->execute();
         $row=$statement->fetchAll();
        
         $items=array();
         foreach ($row as $key => $value) {
          $obj=array();
          if($value['transaction_type']=='RP'){
            $obj['qty']=$value['reject_to_party_qty'];
          }else if($value['transaction_type']=='RS'){
            $obj['qty']=$value['return_to_stock_qty'];
          }else{
            $obj['qty']=$value['qty'];
          }
          
          $obj['running_balance']=$value['running_balance'];  
          $obj['transaction_date']=$value['tdate'];  
          $obj['transaction_type']=$value['transaction_type'];  
          $obj['uom_code']=$value['uom_code'];  

            $items[]=$obj;
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


   public function readPendingPO($d) {
      try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          
          /*$query = "select * from (

                    select distinct a.po_id,po_no,date_format(po_date,'%d/%m/%Y')as po_date,
                    a.stock_type_code
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    join indent_material_map c on b.indent_material_map_id=c.indent_material_map_id
                    join item_master d on d.item_id=c.material_id
                    where d.stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id=:financial_year_id
                    and (b.po_qty-docket_po_qty)>0

                    UNION

                    select distinct a.po_id,po_no,date_format(po_date,'%d/%m/%Y')as po_date,
                    a.stock_type_code
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    join item_master d on d.item_id=b.item_id
                    where d.stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id=:financial_year_id
                    and (b.po_qty-docket_po_qty)>0
                    and po_without_indent='Y'
                    
                    )a";*/

            $query = "select * from (

                    select distinct distinct a.po_id,po_no,date_format(po_date,'%d/%m/%Y')as po_date,a.stock_type_code
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    where stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id=:financial_year_id
                    and (b.po_qty-docket_po_qty)>0

                    UNION

                    select distinct a.po_id,po_no,date_format(po_date,'%d/%m/%Y')as po_date,a.stock_type_code
                    from purchase_order a
                    join po_materials b on a.po_id=b.po_id
                    where stock_type_code=:stock_type_code
                    and status='C'
                    and a.financial_year_id=:financial_year_id
                    and (b.po_qty-docket_po_qty)>0
                    and po_without_indent='Y'
                    
                    )a";          
 

         $statement = $objPDO->prepare($query);
         $statement->bindParam(":stock_type_code", $d->stock_type_code);
         $statement->bindParam(':financial_year_id', $_SESSION['NTC_FINANCIAL_YEAR_ID']); 
         $statement->setFetchMode(PDO::FETCH_ASSOC);
         $statement->execute();
         $poids=$statement->fetchAll();

         $poData=array();          
          $ids='';
         foreach ($poids as $key => $value) {
           if($ids==''){
            $ids=$value['po_id'];
           }else{
            $ids=$ids.','.$value['po_id'];
           }

           $obj=array();
           $obj['po_no']=$value['stock_type_code'].'-'.$value['po_no'];
           $obj['po_date']=$value['po_date'];
           $poData[$value['po_id']]=$obj;
         }

         // print_r($poData);
         // echo $ids;

         $purchaseOrders=array();

         if($ids!=''){
            $query1 = "select a.po_id,c.item_id, a.indent_material_map_id, item_name, uom_code, location,
                 a.po_qty, (a.po_qty-docket_po_qty) as actual_pending_po, a.unit_value,
                 discount_percentage, discount_amount,
                 p_and_f_charges, sub_total, duty_id, duty, amount_after_duty,
                 tax_one_id, tax_one, tax_two_id, tax_two, cess_id, cess, docket_po_qty
                 from po_materials a
                 join item_master c on a.item_id = c.item_id
                 where po_id in (".$ids.")
                 and (a.po_qty-docket_po_qty)>0
                 order by po_id";        

             $statement1 = $objPDO->prepare($query1);
             $statement1->setFetchMode(PDO::FETCH_ASSOC);
             $statement1->execute();
             $row=$statement1->fetchAll();


             foreach ($row as $key => $value) {
               $obj=array();
               $obj['po_no']=$poData[$value['po_id']]['po_no'];
               $obj['po_date']=$poData[$value['po_id']]['po_date'];
               
               $obj['item_name']=$value['item_name'].'-(Code:'.$value['item_id'].')';
               $obj['po_qty']=$value['po_qty'];
               $obj['docket_po_qty']=$value['docket_po_qty'];
                
                $purchaseOrders[]=$obj;
             }
         }

         


         

        
          $data = array();
          $data['status'] = "s";
          $data['purchaseOrders'] = $purchaseOrders;
         return $data;
      }catch(PDOException $e){
         $objPDO = null;
         $error['status'] = "e";
         $error['error'] = $e->getMessage();
         return $error;
      }
   }



}
?>
