function VariantOptionValue(optionObj,id,order){
  this.optionObj = optionObj;
  this.id = id;
  this.order = order;
  this.params = optionObj.params;
  this.variants = optionObj.variants[id];
  
  this.selectable = this.in_stock = false;
}