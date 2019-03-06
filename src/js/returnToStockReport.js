function ReturnToStockReport() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_return_to_stock_date_wise', function(start_date,end_date,stock_type_code) {
    console.log("calling here")
    let req = {}
    req.action = 'readReturnToStockDateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/returntostock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_return_to_stock_date_wise_changed', data.mainArray)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_return_to_stock_item_wise', function(start_date,end_date,stock_type_code,selected_item_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readReturnToStockItemWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_item_id=selected_item_id
    // return;
    $.ajax({
      url:'api/returntostock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_return_to_stock_item_wise_changed', data.mainArray)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })

  self.on('read_return_to_stock_dept_wise', function(start_date,end_date,stock_type_code,selected_department_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readReturnToStockDepartmentWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_department_id=selected_department_id
    // return;
    $.ajax({
      url:'api/returntostock-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_return_to_stock_dept_wise_changed', data.mainArray)
          }else if(data.status == 'e'){
            showToast("Somthing went wrong", data)
            self.loading=false
          }
        },
        error: function(data){
          showToast("", data)
        }
      })
  })
 
}
