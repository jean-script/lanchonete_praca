

const formatCurrency = (value:Number, currency:string)=>{
    return value.toLocaleString('pt-br',{
      style: 'currency',currency
    });
  }; 
  
  export default formatCurrency;