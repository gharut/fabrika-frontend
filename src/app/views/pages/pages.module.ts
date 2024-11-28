import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageInvoiceComponent } from "../../pages/invoice/invoice.component";
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PageInvoiceComponent,
    Page404Component,
    Page500Component
  ],
  imports: [
    PagesRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    SharedModule
  ]
})
export class PagesModule {
}
