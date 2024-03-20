import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncatePipe } from './pipes/truncate.pipe';
import { PyToAngularDateFormatConversionPipe } from './pipes/date-conversion.pipe';
import { ValuesPipe } from './pipes/object.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [TruncatePipe, PyToAngularDateFormatConversionPipe, ValuesPipe],
    exports: [TruncatePipe, PyToAngularDateFormatConversionPipe, ValuesPipe]
})
export class BiosysCoreModule {}
