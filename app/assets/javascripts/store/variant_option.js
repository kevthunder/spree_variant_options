VariantOptions.Option = function(optionsObj,id,order){
  var utl = VariantOptions.Utils
  var self = this;
  this.optionsObj = optionsObj;
  this.id = id;
  this.order = order;
  this.params = optionsObj.params;
  this.variants = this.params.options[id];
  
  
  ////// create widget //////
  if( typeof optionsObj.widget_types === 'string' ) {
    this.widget_type = optionsObj.widget_types;
  }else if( typeof optionsObj.widget_types['option'] === 'string' ) {
    this.widget_type = optionsObj.widget_types['option'];
  }else{
    this.widget_type = optionsObj.widget_types['option'][id];
  }
  var widgetClass = VariantOptions.Widgets[this.widget_type].Option
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
    self.option_values[key] = new VariantOptions.Value(self,key,i);
    i++;
  });
  
  this._selected = null;
  this._auto_select = true;
  
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
    
    var selectables = utl.values(this.selectables());
    if(this._auto_select && selectables.length == 1){
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
    }).sort(function(a, b){return b.order-a.order});
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
        this._auto_select = true;
        this._selected.select_change();
      }
      this.optionsObj.update(this.siblings());
      if(this.widget.select_change) this.widget.select_change();
      if(this.optionsObj.widget.any_select_change) this.optionsObj.widget.any_select_change();
    }
    return this._selected;
  }
  
  this.clear = function(){
    this._auto_select = false;
    this.selected(false);
  }
  
  this.selectables = function(){
    return utl.filter(this.option_values,function(val){return val.selectable()});
  }
  
}