import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms'

import { LayoutComponent } from './/layout.component';
import { AppHeader } from './/app-header/app-header.component';
import { AppSidebar } from './/app-sidebar/app-sidebar.component';
import { AppFooter } from './/app-footer/app-footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
	  LayoutComponent,
	  AppHeader,
	  AppSidebar,
	  AppFooter,
	],
	exports: [
	  LayoutComponent,
	  AppHeader,
	  AppSidebar,
	  AppFooter,
	],
	imports: [
		RouterModule,
		FormsModule,
		CommonModule
	]
})
export class LayoutModule {
}