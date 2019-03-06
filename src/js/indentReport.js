function IndentReport() {
  riot.observable(this) // Riot provides our event emitter.
  var self = this

  self.on('read_indent_date_wise', function(start_date,end_date,status) {
    console.log("calling here")
    let req = {}
    req.action = 'readIndentDateWise'
    req.start_date=start_date
    req.end_date=end_date
    req.status=status
    // return;
    $.ajax({
      url:'api/indent-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_indent_date_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total)
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

  self.on('read_indent_report', function(start_date,end_date,status) {
    console.log("calling here")
    let req = {}
    req.action = 'readIndentReport'
    req.start_date=start_date
    req.end_date=end_date
    req.status=status
    // return;
    $.ajax({
      url:'api/indent-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_indent_report_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total)
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

   self.on('read_indent_item_wise', function(start_date,end_date,status,selected_item_id) {
    console.log("calling here")
    let req = {}
    req.action = 'readIndentItemWise'
    req.start_date=start_date
    req.end_date=end_date
    req.status=status
    req.selected_item_id=selected_item_id
    // return;
    $.ajax({
      url:'api/indent-report',
        type:"POST",
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType:"json",
        success: function(data){
          console.log("calling here1")
          if(data.status == 's'){
            self.trigger('read_indent_item_wise_changed', data.mainArray, data.qty_grand_total, data.item_value_grand_total)
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
