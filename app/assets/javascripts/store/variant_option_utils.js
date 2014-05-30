VariantOptions.Utils = {
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
      var fres;
      if(!funct || (fres = funct(val,key))) {
        if(funct && fres !== true){
          res = fres;
        }else{
          res = val;
        }
        return false;
      }
    });
    return res;
  },
  filter: function(obj,funct){
    var res = {};
    $.each(obj, function(key,val){ if(funct(val,key)) res[key] = val });
    return res;
  },
  intersect_key: function(obj1,obj2){
    return VariantOptions.Utils.filter(obj1,function (val,key){ return obj2[key] });
  },
  union : function(arr1,arr2){
    var res = arr1;
    $.each(arr2,function(key,val){
      if(res.indexOf(val) == -1){
        res.push(val);
      }
    });
    return res;
  },
  to_f : function(string) {
    return string ? parseFloat(string.replace(/[^\d\.]/g, '')) : 0;
  }
}