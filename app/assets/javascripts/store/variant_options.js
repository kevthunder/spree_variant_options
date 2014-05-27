VariantOptionWidget = {}

$.extend({
  keys: function(obj){
    var a = [];
    $.each(obj, function(k){ a.push(k) });
    return a;
  },
  values: function(obj){
    var a = [];
    $.each(obj, function(k,v){ a.push(v) });
    return a;
  },
  first: function(obj,funct){
    var res = null;
    $.each(obj, function(key,val){ 
      if(!funct || funct(val)) {
        res = val;
        return false;
      }
    });
    return res;
  },
  where: function(obj,funct){
    var res = {};
    $.each(obj, function(key,val){ if(funct(val,key)) res[key] = val });
    return res;
  },
  intersect_key: function(obj1,obj2){
    return $.where(obj1,function (val,key){ return obj2[key] });
  }
});

if (!Array.indexOf) Array.prototype.indexOf = function(obj) {
  for(var i = 0; i < this.length; i++){
    if(this[i] == obj) {
      return i;
    }
  }
  return -1;
}

/*if (!Array.find_matches) Array.find_matches = function(a) {
  var i, m = [];
  a = a.sort();
  i = a.length
  while(i--) {
    if (a[i - 1] == a[i]) {
      m.push(a[i]);
    }
  }
  if (m.length == 0) {
    return false;
  }
  return m;
}*/

function VariantOptions(params) {
  var self = this;
  this.params = params;
  // if(window.console){
  	// console.log(params);
  // }
  this.variant_options = {};
  this.widget_type = 'Buttons';
  this.bidirectional = false;
  
  var i = 0;
  $.each(params.options,function(key, value){
    self.variant_options[key] = new VariantOption(self,key,i);
    i++;
  });
  
  /*
  var options = params['options'];
  var i18n = params['i18n'];
  var allow_backorders = !params['track_inventory_levels'];
  var allow_select_outofstock = params['allow_select_outofstock'];
  var default_instock = params['default_instock'];

  var variant, divs, parent, index = 0;
  var selection = [];
  var buttons;*/


  this.init = function () {
    $.each(this.variant_options,function(key, variant_option){
      variant_option.init();
    });
    
    this.update();
    
    ////////// old stuff //////////
    /*divs = $('#product-variants .variant-options'); //remove
    disable(divs.find('a.option-value').addClass('locked'));
    update();
    enable(parent.find('a.option-value'));
    toggle();
    $('div.variant-options a.clear-button').hide().click(handle_clear);

    if (default_instock) {
      divs.each(function(){
        $(this).find("ul.variant-option-values li a.in-stock:first").click();
      });
    }*/
  }
  
  this.update = function(skip){
    $.each(this.variant_options,function(key, variant_option){
      if(!skip || skip.id != key){
        variant_option.update();
      }
    });
  }
  
  /*
  ////////// old stuff //////////
  function get_index(parent) {
    return parseInt($(parent).attr('class').replace(/[^\d]/g, ''));
  }

  function update(i) {
    index = isNaN(i) ? index : i;
    parent = $(divs.get(index));
    buttons = parent.find('a.option-value');
    parent.find('a.clear-button').hide();
  }

  function disable(btns) {
    return btns.removeClass('selected'); //done
  }

  function enable(btns) {
    bt = btns.not('.unavailable').removeClass('locked').unbind('click')
    if (!allow_select_outofstock && !allow_backorders)
      bt = bt.filter('.in-stock')
      
    return bt.click(handle_click) //done
        .filter('.auto-click').removeClass('auto-click').click();
  }

  function advance() {
    if(window.console){
    	console.log('advance');
    }
    index++
    update();
    inventory(buttons.removeClass('locked'));
    enable(buttons);
  }

  function inventory(btns) {
    var keys, variants, selected = {};
    var sels = $.map(divs.find('a.selected'), function(i) { return i.rel });
    $.each(sels, function(key, value) {
      key = value.split('-');
      var v = options[key[0]][key[1]];
      keys = $.keys(v);
      var m = Array.find_matches(selection.concat(keys));
      if (selection.length == 0) {
        selection = keys;
      } else if (m) {
        selection = m;
      }
    });
    var selectable = 0;
    btns.removeClass('in-stock out-of-stock unavailable').each(function(i, element) {
      //collect status
      var variants = get_variant_objects(element.rel);
      var keys = $.keys(variants);
      var available = (keys.length != 0);
      var in_stock = false;
      var auto_selected = false;
      if (available) {
        if (keys.length == 1) {
          in_stock = variants[keys[0]].in_stock;
          auto_selected = in_stock && selection.length == 1;
        } else if (allow_backorders) {
          in_stock = true;
        } else {
          $.each(variants, function(key, value) {
            if (value.in_stock) {
              in_stock = true;
              return false; //break the loop
            }
          });
        }
      }
      //apply DOM modification
      if (!available) disable($(element).addClass('unavailable locked').unbind('click'));
      if (in_stock) {
        selectable++;
        $(element).addClass("in-stock")
      } else if(available){
        $(element).addClass("out-of-stock")
      }
      if (auto_selected) $(element).addClass('auto-click')
    });
    
    var $parent = btns.first().parents('.variant-options:first');
    if(selectable > 0){
      $parent.removeClass("nothing-available");
    }else{
      $parent.addClass("nothing-available");
    }
  }

  function get_variant_objects(rels) {
    var i, ids, obj, variants = {};
    if (typeof(rels) == 'string') { rels = [rels]; }
    var otid, ovid, opt, opv;
    i = rels.length;
    try {
      while (i--) {
        ids = rels[i].split('-');
        otid = ids[0];
        ovid = ids[1];
        opt = options[otid];
        if (opt) {
          opv = opt[ovid];
          ids = $.keys(opv);
          if (opv && ids.length) {
            var j = ids.length;
            while (j--) {
              obj = opv[ids[j]];
              if (obj && $.keys(obj).length && 0 <= selection.indexOf(obj.id.toString())) {
                variants[obj.id] = obj;
              }
            }
          }
        }
      }
    } catch(error) {
      //console.log(error);
    }
    return variants;
  }

  function to_f(string) {
    return string ? parseFloat(string.replace(/[^\d\.]/g, '')) : 0;
  }

  // Find matching variants for selected option value
  // Set price or price range if matching variants have different prices.
  function find_variant() {
    var selected = divs.find('a.selected');
    var variants = get_variant_objects(selected.get(0).rel);
    if (selected.length == divs.length) {
      return variant = variants[selection[0]];
    } else {
      var prices = [];
      $.each(variants, function(key, value) { prices.push(value.price) });
      prices = $.unique(prices).sort(function(a, b) {
        return to_f(a) < to_f(b) ? -1 : 1;
      });
      if (prices.length == 1) {
        $('#product-price .price').html('<span class="price assumed">' + prices[0] + '</span>');
      } else {
        $('#product-price .price').html('<span class="price from">' + prices[0] + '</span> - <span class="price to">' + prices[prices.length - 1] + '</span>');
      }
      return variants;
    }
  }

  function toggle(variants) {
    if (variant) {
      $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]').val(variant.id);
      $('#product-price').removeClass('unselected').find('.price').text(variant.price);
      if (variant.in_stock)
        $('#cart-form button[type=submit]').attr('disabled', false).fadeTo(100, 1);
      $('form[data-form-type="variant"] button[type=submit]').attr('disabled', false).fadeTo(100, 1);
      try {
        show_variant_images(variant.id);
      } catch(error) {
        // depends on modified version of product.js
      }
    } else {

      if (variants) {
        variants_ids = $.keys(variants);
        show_variant_images(variants_ids);
      }

      $('#variant_id, form[data-form-type="variant"] input[name$="[variant_id]"]').val('');
      $('#cart-form button[type=submit], #inside-product-cart-form button[type=submit], form[data-form-type="variant"] button[type=submit]').attr('disabled', true).fadeTo(0, 0.5);
      price = $('#product-price').addClass('unselected').find('.price')
      // Replace product price by "(select)" only when there are at least 1 variant not out-of-stock
      variants = $("div.variant-options.index-0")
      if (variants.find("a.option-value.out-of-stock").length != variants.find("a.option-value").length)
        price.text(i18n.variant_options_select);
    }
  }

  function clear(i) {
    variant = null;
    update(i);
    enable(buttons.removeClass('selected'));
    toggle();
    parent.nextAll().each(function(index, element) {
      disable($(element).find('a.option-value').show().removeClass('in-stock out-of-stock').addClass('locked').unbind('click'));
      $(element).find('a.clear-button').hide();
      $(element).find('.selection').html('').removeClass('out-of-stock');
    });
    parent.find('.selection').html('').removeClass('out-of-stock');
    show_all_variant_images();
  }


  function handle_clear(evt) {
    evt.preventDefault();
    clear(get_index(this));
  }

  function handle_click(evt) {
    evt.preventDefault();
    variant = null;
    selection = [];
    var a = $(this);
    if (!parent.has(a).length) {
      clear(divs.index(a.parents('.variant-options:first')));
    }
    disable(buttons);
    var a = enable(a.addClass('selected'));
    parent.find('a.clear-button').css('display', 'inline-block');
    advance();
    handle_selected();

    variants = find_variant();
    toggle(variants);
  }

  function handle_selected() {
    var selected = divs.find('a.selected');
    selected.each(function(){
      $this = $(this)
      var selection = $this.parents('.variant-options').find('.selection')
      selection.html($this.attr('title'));

      if ($this.hasClass('out-of-stock'))
        selection.addClass('out-of-stock').attr('title', i18n.out_of_stock);
    });
  };
  
  */
  $(document).ready(function(){self.init()});
  
  if(window.console){
  	console.log(self);
  }
  
};
