import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPipe'
})
export class CurrencyPipePipe implements PipeTransform {

  transform(value: any): string {
    if(!value) {
      return '0,00';
    }
    value = +value.toString().replace(/\D/g,'');
    if(value < 99) {
      return `0,${value.toString().padStart(2, '0')}`;
    }
    if(value > 99) {
      let stringValue = value.toString();
      let integer = stringValue.slice(0, stringValue.length -2);
      let decimal = stringValue.slice(stringValue.length -2, stringValue.length);
      return `${integer},${decimal.padStart(2, '0')}`;
    }
    return value;
  }

}
