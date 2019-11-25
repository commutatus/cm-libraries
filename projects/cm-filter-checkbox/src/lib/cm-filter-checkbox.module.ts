import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmFilterCheckboxComponent } from './cm-filter-checkbox.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        CmFilterCheckboxComponent,
    ],
    exports: [
        CommonModule,
        CmFilterCheckboxComponent
    ]
})
export class CmFilterCheckboxModule {
}
