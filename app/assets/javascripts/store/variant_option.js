function VariantOption(optionsObj,id,order){
  var self = this;
  this.optionsObj = optionsObj;
  this.id = id;
  this.order = order;
  this.params = optionsObj.params;
  this.variants = this.params.options[id];
  if(window.console){
  	console.log(id);
  	console.log(this.params.options);
  }
  this.option_values = [];
  $.each(this.variants,function(key, value){
    self.option_values.push(new VariantOptionValue(self,self.option_values.length))
  });
  
  this.init = function() {
  }
  
}