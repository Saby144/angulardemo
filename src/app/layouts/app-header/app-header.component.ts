import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppAdminInfo } from '../../layouts/layout.model'

@Component({
  selector: '[app-header]',
  templateUrl: './app-header.component.html',
})
export class AppHeader implements OnInit, AfterViewInit {

  constructor(public appModel: AppAdminInfo) { }
  ngOnInit() {
    this.appModel.ClientName = localStorage.getItem('ClientId');
    this.appModel.ClientImage = localStorage.getItem('ClientLogo');
    this.appModel.Username = localStorage.getItem('Username');
  }

  ngAfterViewInit()  {
	}
}
