<?php
session_start();
require_once '../modules/conf.php';
function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round($bytes / pow(1024, ($i = floor(log($bytes, 1024)))), $precision).' '.$unit[$i];
}

$sFileName = $_FILES['uploadedFile']['name'];
$sFileType = $_FILES['uploadedFile']['type'];
$imgExtension = array('jpg','jpe','jpeg','gif','png');
$image_name = pathinfo($_FILES['uploadedFile']['name']);
$extension = strtolower($image_name['extension']);
if(!in_array($extension,$imgExtension)){
    echo "Failed: not a valid image.";
}else{
  $sFileSize = bytesToSize1024($_FILES['uploadedFile']['size'], 1);
   
      $uploadSuccess = true;
     try{
         $objPDO = new PDO("mysql:dbname=" . DB_NAME . ";host=" . DB_HOST, DB_USER, DB_PASS);
         $objPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         $query = "Insert into filecounter (filename, creation_date, modified_by) values (:fn, curDate(), :mf)";
         $statement = $objPDO->prepare($query);
         $statement->bindParam(':fn', $sFileName);
         $statement->bindParam(':mf', $_SESSION['user_id']);
         $statement->execute();
         $fileid = $objPDO->lastInsertId();  
         $newFileName = $fileid . "." . $extension;
         if(@move_uploaded_file($_FILES["uploadedFile"]["tmp_name"], "cylinders/" . $newFileName)){
          $fn = $newFileName;
          $optimalHeight = 64;
          $source_image_path = 'cylinders/' . $fn;
          $thumbnail_image_path = "cylinders/thumbs/" . $fn;
          list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);
          switch ($source_image_type) {
          case IMAGETYPE_GIF:
            $source_gd_image = imagecreatefromgif($source_image_path);
            break;
          case IMAGETYPE_JPEG:
            $source_gd_image = imagecreatefromjpeg($source_image_path);
            break;
          case IMAGETYPE_PNG:
            $source_gd_image = imagecreatefrompng($source_image_path);
            break;
          }
          if ($source_gd_image === false) {
            echo "Failed - Invalid image.";         
          }
          $source_aspect_ratio = $source_image_width / $source_image_height;        
          if ($source_image_height > $optimalHeight) {
          $thumbnail_image_height = $optimalHeight;
          $thumbnail_image_width = (int) ($optimalHeight * $source_aspect_ratio);
          $thumbnail_gd_image = imagecreatetruecolor($thumbnail_image_width, $thumbnail_image_height);
          imagecopyresampled($thumbnail_gd_image, $source_gd_image, 0, 0, 0, 0, $thumbnail_image_width, $thumbnail_image_height, $source_image_width, $source_image_height);
          imagejpeg($thumbnail_gd_image, $thumbnail_image_path, 90);
          imagedestroy($thumbnail_gd_image);    
          }
          imagedestroy($source_gd_image);
            echo $newFileName; 
         }else{
            echo "Failed to upload file.";
         }
      }catch(PDOException $e){
         $objPDO = null;
         $error = array();
         $error['error'] = $e->getMessage();
         echo "Failed to upload file. " . $e->getMessage();
      } 
}
?>
