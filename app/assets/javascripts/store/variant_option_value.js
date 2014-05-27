function VariantOptionValue(optionObj,id,order){
  this.optionObj = optionObj;
  this.optionsObj = optionObj.optionsObj;
  this.id = id;
  this.order = order;
  this.params = optionObj.params;
  this.variants = optionObj.variants[id];
  
  if(this.optionObj.widget.ValueWidget){
    this.value_widget = new this.optionObj.widget.ValueWidget(this);
  }
  
  this._in_stock = this._available = false;
  
  this.init = function() {
    if(this.value_widget){
      this.value_widget.init();
    }
  }
  
  this.selectable = function(){
    return this._available && this._in_stock;
  }
  
  this.selected = function(val){
    if(typeof val != 'undefined' && this.selected() != val){
      if(val) {
        this.optionObj.selected(this);
      }else{
        this.optionObj.selected(false);
      }
    }
    return this.optionObj.selected() === this;
  }
  
  this.select_change = function(){
    if(this.value_widget && this.value_widget.select_change) this.value_widget.select_change();
  }
  
  this.in_stock = function(val){
    if(typeof val != 'undefined' && this._in_stock != val){
      this._in_stock = val;
      if(this.value_widget && this.value_widget.in_stock_change) this.value_widget.in_stock_change();
    }
    return this._in_stock;
  }
  
  this.available = function(val){
    if(typeof val != 'undefined' && this._available != val){
      this._available = val;
      if(this.value_widget && this.value_widget.available_change) this.value_widget.available_change();
    }
    return this._available;
  }
  
  this.update = function(){
    var variants = this.available_variantes();
    this.available($.first(variants) !== null || (!this.optionsObj.bidirectional && this.optionObj.order == 0));
    var stock_variants = (this.available()) ? variants : this.variants;
    this.in_stock($.first(stock_variants,function(v){ return v.in_stock }) !== null);
    if(!this.selectable() && this.selected()){
      this.selected(false);
    }
  }
  
  this.available_variantes = function(){
    var selected_option_values = []
    var options = (this.optionsObj.bidirectional)? this.optionObj.siblings() : this.optionObj.previous_siblings();
    selected_option_values = $.map(options,function(s) { if(s.selected()) return s.selected()})
    var variants = this.variants;
    $.each(selected_option_values,function(key,option_value){
      variants = $.intersect_key(variants,option_value.variants);
    });
    return variants;
  }
  
  this.try_select = function(){
    if((this.optionsObj.bidirectional || this.selectable()) && this.in_stock()){
      this.selected(true);
      return true;
    }
    return false;
  }
}