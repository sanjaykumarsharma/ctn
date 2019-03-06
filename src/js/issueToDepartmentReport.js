function IssueToDepartmentReport() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_issue_to_department_date_wise', function(start_date,end_date,stock_type_code,stock_adjustment) {
    console.log("calling here")
    let req = {}
    req.action = 'readIssueToDepartmentDateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.stock_adjustment=stock_adjustment
    // return;
    $.ajax({
      url:'api/issuetodepartment-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_issue_to_department_date_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total)
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

   self.on('read_issue_to_department_item_wise', function(start_date,end_date,stock_type_code,selected_item_id,stock_adjustment) {
    console.log("calling here")
    let req = {}
    req.action = 'readIssueToDepartmentItemWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_item_id=selected_item_id
    req.stock_adjustment=stock_adjustment
    // return;
    $.ajax({
      url:'api/issuetodepartment-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_issue_to_department_item_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total)
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

  self.on('read_issue_to_department_dept_wise', function(start_date,end_date,stock_type_code,selected_department_id,stock_adjustment) {
    console.log("calling here")
    let req = {}
    req.action = 'readIssueToDepartmentDeptWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_department_id=selected_department_id
    req.stock_adjustment=stock_adjustment
    // return;
    $.ajax({
      url:'api/issuetodepartment-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_issue_to_department_dept_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total)
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

  self.on('read_issue_to_department_location_wise', function(start_date,end_date,stock_type_code,selected_location_id,stock_adjustment) {
    console.log("calling here")
    let req = {}
    req.action = 'readIssueToDepartmentLocationWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_location_id=selected_location_id
    req.stock_adjustment=stock_adjustment
    // return;
    $.ajax({
      url:'api/issuetodepartment-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_issue_to_department_location_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total)
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
  
  self.on('read_issue_to_department_chargehead_wise', function(start_date,end_date,stock_type_code,selected_chargehead_id,stock_adjustment) {
    console.log("calling here")
    let req = {}
    req.action = 'readIssueToDepartmentChargeHeadWise'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    req.selected_chargehead_id=selected_chargehead_id
    req.stock_adjustment=stock_adjustment
    // return;
    $.ajax({
      url:'api/issuetodepartment-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_issue_to_department_chargehead_wise_changed', data.mainArray, data.qty_grand_total, data.amount_grand_total)
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


  /*Stock Adjustment Report Receive*/

  self.on('read_receive_for_stock_adjustment_report', function(start_date,end_date,stock_type_code) {
    console.log("calling here")
    let req = {}
    req.action = 'readReceiveForStockAdjustment'
    req.start_date=start_date
    req.end_date=end_date
    req.stock_type_code=stock_type_code
    // return;
    $.ajax({
      url:'api/issuetodepartment-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_receive_for_stock_adjustment_report_changed', data.mainArray)
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
