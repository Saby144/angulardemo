import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './/app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LayoutModule } from './/layouts/layout.module';
import { ScriptLoaderService } from './_services/script-loader.service';
import { LoginService } from '../services/user.service'
import { ToastrModule } from 'ngx-toastr';
import { AppAdminInfo } from '../app/layouts/layout.model'
import { MenuService } from '../services/menu.service'
import { MenuModel } from '../services/menu.model';
import { CategoryService } from '../services/categoryaddedit.service';
import { Category } from '../services/categoryaddedit.model';
import { AccessToken } from '../services/accessToken';
import { environment } from '../environments/environment.prod';
if(environment.production)
{
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    HttpModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [ScriptLoaderService, LoginService, AppAdminInfo, MenuService, MenuModel, CategoryService, Category, AccessToken],
  bootstrap: [AppComponent]
})
export class AppModule { }
