import { Component } from '@angular/core';

import { navItems } from './_nav';
import {AccountService} from "../../services/account.service";
import {ICustomNavData} from "./_nav";

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {


  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  public accountService: AccountService

  constructor(accountService: AccountService) {
    this.accountService = accountService
    this.navItems.forEach((item: ICustomNavData , index:number) =>{
      if(item.can && item.can.length > 0) {
        if(typeof item.can === "string"){
          if(!this.accountService.can(item.can)){
            navItems[index].attributes = {hidden: true}
          }
        }else if(Array.isArray(item.can)){
          if(item.can.includes("all")) {
            const filtered = item.can.filter(function(e) { return e !== 'all' })
            if(!this.accountService.canAll(filtered)){
              navItems[index].attributes = {hidden: true}
            }
          }else{
            if(!this.accountService.canOneOf(item.can)){
              navItems[index].attributes = {hidden: true}
            }
          }
        }
      }
    })
  }
}
