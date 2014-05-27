VariantOptionWidget.Buttons = function(optionObj){
  var self = this;
  
  this.optionObj = optionObj;
  
  this.init = function(){
    this.$container = $("#option_type_" + this.optionObj.id);
    this.optionObj.order = this.$container.attr('class').match(/index-([0-9]+)/)[1];
  }
  
  this.ValueWidget = function(option_value){
    var self = this;
    this.option_value = option_value;
    this.main_widget = option_value.optionObj.widget;
    
    this.init = function(){
      var rel = this.main_widget.optionObj.id+"-"+this.option_value.id;
      this.$bt = $("a.option-value[rel='"+rel+"']",this.main_widget.$container);
      this.$bt.bind("click.variant_option",function(e){ self.click(e) });

      this.select_change();
      this.available_change();
      this.in_stock_change();
    }
    
    this.click = function(e){
      e.preventDefault();
      this.option_value.try_select();
    }
    
    this.select_change = function(){
      if(this.option_value.selected()){
        this.$bt.addClass('selected');
      }else{
        this.$bt.removeClass('selected');
      }
    }
    
    this.available_change = function(){
      if(this.option_value.available()){
        this.$bt.removeClass('unavailable locked');
      }else{
        this.$bt.addClass('unavailable locked');
      }
    }
    
    this.in_stock_change = function(){
      if(this.option_value.in_stock()){
        this.$bt.removeClass('out-of-stock');
      }else{
        this.$bt.addClass('out-of-stock');
      }
    }
    
  }
  
}