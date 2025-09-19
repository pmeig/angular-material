import { NgModule } from '@angular/core';
import { BTableDirective } from './directives/b-table.directive';
import { BTableColorDirective } from './directives/b-table-color.directive';
import { BTableCaptionDirective } from './directives/b-table-caption.directive';
import { BTableDividerDirective } from './directives/b-table-divider.directive';
import { BTableContentOptionsDirective } from './directives/b-table-content.options.directive';

const TABLE_EXPORTS = [BTableDirective, BTableColorDirective, BTableCaptionDirective,
  BTableDividerDirective, BTableContentOptionsDirective];

@NgModule({
  imports: TABLE_EXPORTS,
  exports: TABLE_EXPORTS,
})
export class TableMaterial {}
