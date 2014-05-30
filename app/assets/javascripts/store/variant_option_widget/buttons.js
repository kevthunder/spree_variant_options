VariantOptions.Widgets.Buttons = {
  Options:function(optionsObj){
    var utl = VariantOptions.Utils
    var self = this;
    this.optionsObj = optionsObj;
    
    this.init = function(){
      this.$priceDisplay = $('#product-price .price');
      this.$varianteInput = $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]');
      this.$btSubmit = $('#cart-form button[type=submit], #cart-form input[type=submit], #inside-product-cart-form button[type=submit], #inside-product-cart-form input[type=submit], form[data-form-type="variant"] button[type=submit], form[data-form-type="variant"] input[type=submit]');
      
      this.any_select_change();
    }
    
    this.variante_change = function(){
      var variante = this.optionsObj.variante();
      if(window.console){
      	console.log(variante);
      }
      this.$varianteInput.val(variante);
      if(variante){
        this.$btSubmit.attr('disabled', false).removeClass('disabled');
      }else{
        this.$btSubmit.attr('disabled', true).addClass('disabled');
      }
    }
    
    this.any_select_change = function(){
      var variants = this.optionsObj.possible_variants();
      var prices = $.map(variants,function(v){return v.price});
      prices = $.unique(prices).sort(function(a, b) {
        return utl.to_f(a) < utl.to_f(b) ? -1 : 1;
      });
      if(prices.length == 1){
        this.$priceDisplay.html(prices[0]);
      }else if(prices.length > 1){
        this.$priceDisplay.html('<span class="from">' + prices[0] + '</span> - <span class="to">' + prices[prices.length - 1] + '</span>');
      }else{
        this.$priceDisplay.text(this.optionsObj.params.i18n.variant_options_select);
      }
      
    }
    
  },
  Option:function(optionObj){
    var self = this;
    
    this.optionObj = optionObj;
    
    this.init = function(){
      this.$container = $("#option_type_" + this.optionObj.id);
      this.optionObj.order = this.$container.attr('class').match(/index-([0-9]+)/)[1];
      $(".clear-button",this.$container).bind("click.variant_option",function(e){ self.clear_click(e) });
    }
    this.clear_click = function(e){
      e.preventDefault();
      this.optionObj.clear();
    }
    this.select_change = function(){
      var $selection = $('.selection',this.$container);
      $selection.removeClass('out-of-stock').attr('title', '');
      if(window.console){
        console.log($(".clear-button",this.$container));
      }
      if(this.optionObj.selected()){
        $selection.text(this.optionObj.selected().value_widget.$bt.attr('title'));
        if (!this.optionObj.selected().in_stock())
          $selection.addClass('out-of-stock').attr('title', i18n.out_of_stock);
        $(".clear-button",this.$container).show();
      }else{
        $selection.text('');
        $(".clear-button",this.$container).hide();
      }
    }
  },
  Value: function(option_value){
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