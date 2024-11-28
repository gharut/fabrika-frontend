import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent} from "./views/login/login.component";
import { RegisterComponent } from './views/pages/register/register.component';
import {AuthGuard} from "./guards/auth.guard";
import {ResetPasswordComponent} from "./pages/reset-password/reset-password.component";
import { PageInvoiceComponent } from "./pages/invoice/invoice.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'invoice/:uuid',
    component: PageInvoiceComponent,
    data: {
      title: 'Order Invoice Page',
    },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then((m) => m.ProfileModule)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./pages/roles/roles.module').then((m) => m.RolesModule),
        data: {
          permission: 'list-roles'
        }
      },
      {
        path: 'consumables',
        loadChildren: () =>
          import('./pages/consumable/consumable.module').then((m) => m.ConsumableModule),
        data: {
          permission: 'list-consumables'
        }
      },
      {
        path: 'inout',
        loadChildren: () =>
          import('./pages/inout/inout.module').then((m) => m.InoutModule),
        data: {
          permission: 'list-inout'
        }
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./pages/suppliers/suppliers.module').then((m) => m.SuppliersModule),
        data: {
          permission: 'list-suppliers'
        }
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./pages/services/services.module').then((m) => m.ServicesModule),
        data: {
          permission: 'list-services'
        }
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./pages/clients/clients.module').then((m) => m.ClientsModule),
        data: {
          permission: 'list-clients'
        }
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./pages/orders/orders.module').then((m) => m.OrdersModule),
        data: {
          permission: 'list-orders'
        }
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
