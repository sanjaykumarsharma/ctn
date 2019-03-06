<stock-summary>

<div show={opening_stock_view =='stock_summry_home'}>
 <div class="container">
  <div class="row">
    <div class="col-md-9">
      <h4>Stock Summary</h4>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-3">
      <div class="form-group">
        <label for="selectItemGroupInput">Item Group</label>
        <select name="selectItemGroupInput" class="form-control" style="min-width:250px">
          <option each={item_groups} value={item_group_code}>{item_group}</option>
        </select>
      </div>
    </div>  
    <div class="col-sm-3">
      <div class="form-group">
        <label for="selectCategoryInput">Category</label>
        <select name="selectCategoryInput" class="form-control" style="min-width:250px">
          <option each={categories} value={category_code}>{category}</option>
        </select>
      </div>
    </div>
    <div class="col-sm-3">  
      <div class="form-group">
        <label for="selectStockTypeInput">Stock Type</label>
        <select name="selectStockTypeInput" class="form-control" style="min-width:250px">
          <option each={stock_types} value={stock_type_code}>{stock_type}</option>
        </select>
      </div>
    </div>
    <div class="col-sm-3">  
      <div class="form-group">
        <button type="button" class="btn btn-primary" onclick={getStockSummary} style="margin-top: 32px;">Go</button>
      </div>
    </div>
  </div>

  <div class="row">
    <table class="table table-bordered">
        <tr>
          <th class="serial-col">#</th>
          <th>Material</th>
          <th>Opening Qty</th>
          <th>Receipt Qty</th>
          <th>Issue Qty</th>
          <th>Closing Qty</th>
          <th>UOM</th>
        </tr>
        <tr each={c, i in stockSummary}>
          <td>{i+1}</td>
          <td>{c.item_name}</td>
          <td>{c.opening_qty}</td>
          <td>{c.receipt_qty}</td>
          <td>{c.issue_qty}</td>
          <td>{c.closing_qty}</td>
          <td>{c.uom}</td>
        </tr>
      </table>
   </div>
 </div>
</div>

<script>
    var self = this
    self.on("mount", function(){
      RiotControl.trigger('read_stock_types')
      RiotControl.trigger('read_item_groups')
      RiotControl.trigger('read_categories')
      self.opening_stock_view='stock_summry_home'
      self.update()

    })

    self.getStockSummary = () => {
      RiotControl.trigger('read_stock_summary',self.selectItemGroupInput.value,self.selectCategoryInput.value,self.selectStockTypeInput.value)
    } 

    /*method change callback from store*/
    RiotControl.on('item_groups_changed', function(item_groups) {
      self.item_groups = item_groups
      self.update()
    })

    RiotControl.on('categories_changed', function(categories) {
      self.categories = categories
      self.update()
    })

    RiotControl.on('stock_types_changed', function(stock_types) {
      self.stock_types = stock_types
      self.update()
    })
    
    RiotControl.on('read_stock_summary_changed', function(items) {
      self.loading = false
      self.stockSummary=[]
      self.stockSummary = items
      self.update()
    })
    
 </script>
</stock-summary>
