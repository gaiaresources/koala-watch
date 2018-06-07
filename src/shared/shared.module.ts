import { NgModule } from '@angular/core';
import { PyToIonicDateFormatConversionPipe } from './pipes/date-conversion.pipe';

@NgModule({
    declarations: [PyToIonicDateFormatConversionPipe],
    exports: [PyToIonicDateFormatConversionPipe]
})
export class SharedModule {}
