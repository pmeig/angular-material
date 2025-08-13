import { NgModule } from '@angular/core';
import { PaginationComponent } from './pagination/pagination.component';

const PAGINATION_EXPORTS = [PaginationComponent];

@NgModule({
  imports: PAGINATION_EXPORTS,
  exports: PAGINATION_EXPORTS,
})
export class PaginationMaterial { }
