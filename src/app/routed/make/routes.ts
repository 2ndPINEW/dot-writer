import { Routes } from "@angular/router";
import { IndexComponent } from "./pages/index/index.component";

export const ROUTES: Routes = [{
  path: '',
  pathMatch: 'prefix',
  children: [
    {
      path: '',
      component: IndexComponent
    }
  ]
}];