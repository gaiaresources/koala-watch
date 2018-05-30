import { Component } from "@angular/core";
import { DataList } from "../data-list/data-list";
import { HomeMapPage } from "../home-map/home-map";

// This page consists of a tabbar with two sub-pages - datalist and homemappage...

@Component({
    selector: 'home-tabs',
    templateUrl: 'home-tabs.html'
})

export class HomeTabsPage {
    listRoot = DataList;
    mapRoot = HomeMapPage;
    
    constructor() {
    }
}
