function VariantOption(optionsObj,id,order){
  var self = this;
  this.optionsObj = optionsObj;
  this.id = id;
  this.order = order;
  this.params = optionsObj.params;
  this.variants = this.params.options[id];
  
  
  ////// create widget //////
  if( typeof optionsObj.widget_type === 'string' ) {
    this.widget_type = optionsObj.widget_type;
  }else{
    this.widget_type = optionsObj.widget_type[id];
  }
  var widgetClass = VariantOptionWidget[this.widget_type]
  if(typeof widgetClass === 'function') {
    this.widget = new widgetClass(this);
  }else{
    // error
    if(window.console){
    	console.log("The widget script could not be found");
    }
  }
  
  ////// create options values //////
  this.option_values = {};
  var i = 0;
  $.each(this.variants,function(key, value){
    self.option_values[key] = new VariantOptionValue(self,key,i);
    i++;
  });
  
  this._selected = null;
  
  this.init = function() {
    this.widget.init();
    
    $.each(this.option_values,function(key, option_value){
      option_value.init();
    });
  }
  
  this.update = function(){
    $.each(this.option_values,function(key, option_value){
      option_value.update();
    });
    
    var selectables = $.values(this.selectables());
    if(selectables.length == 1){
      selectables[0].try_select();
    }
  }
  
  this.previous_siblings = function(){
    return $.map(this.optionsObj.variant_options,function(variant_option, key){
      if(variant_option.order < self.order) return variant_option;
    });
  }
  
  this.siblings = function(){
    return $.map(this.optionsObj.variant_options,function(variant_option, key){
      if(variant_option.id != self.id) return variant_option;
    });
  }
  
  this.next_siblings = function(){
    return $.map(this.optionsObj.variant_options,function(variant_option, key){
      if(variant_option.order > self.order) return variant_option;
    });
  }
  
  this.selected = function(val){
    if(typeof val != 'undefined' && this._selected != val){
      var last = this._selected;
      this._selected = val;
      if(last){
        last.select_change();
      }
      if(this._selected){
        this._selected.select_change();
      }
      this.optionsObj.update(this);
      if(this.widget.select_change) this.widget.select_change();
    }
    return this._selected;
  }
  
  this.selectables = function(){
    return $.where(this.option_values,function(val){return val.selectable()});
  }
  
}