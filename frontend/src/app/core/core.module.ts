import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  exports: [MainPageComponent]
})
export class CoreModule { }
