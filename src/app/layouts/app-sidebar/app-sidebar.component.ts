import { Component, OnInit } from '@angular/core';
import { AppAdminInfo } from '../layout.model';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: '[app-sidebar]',
  templateUrl: './app-sidebar.component.html'
})

export class AppSidebar implements OnInit {
  constructor(public appModel: AppAdminInfo, public menuService: MenuService) { }
  ngOnInit() {
    this.appModel.ClientName = localStorage.getItem('ClientName'); 
    this.appModel.ClientId =  localStorage.getItem('ClientId');
    this.appModel.ClientImage = localStorage.getItem('ClientLogo');
    this.appModel.LoadingImage = localStorage.getItem('LoadingImage');
    this.appModel.FaviconImage = localStorage.getItem('FavIcon');
    this.menuService.getMenuList(this.appModel.ClientId);
  }
}
