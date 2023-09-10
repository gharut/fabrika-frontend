import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import {AccountService} from "../../../services/account.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  public avatar = ""
  public name = ""

  constructor(private classToggler: ClassToggleService, private accountService: AccountService) {
    super();
    this.accountService.account.subscribe(account => {
      this.avatar = account?.avatar ? environment.webUrl+account?.avatar : "";
      this.name = account?.name ?? "";
    })
  }
}
