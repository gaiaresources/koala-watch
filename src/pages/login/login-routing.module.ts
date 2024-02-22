import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from "./login";

const routes: Routes = [
    {
        path: 'login',
        component: LoginPage,
        children: [
            { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
        ]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class LoginRoutingModule {}
