import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatTableModule,
  MatStepperModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatToolbarModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatProgressBarModule,
  MatRippleModule,
  MatCardModule,
  MatBadgeModule,
  MatExpansionModule,
} from '@angular/material';

@NgModule({
  exports: [
    MatTableModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBadgeModule,
    MatExpansionModule,

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MaterialModule {}
