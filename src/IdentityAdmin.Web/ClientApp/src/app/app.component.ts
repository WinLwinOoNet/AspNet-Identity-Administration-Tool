import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isOpened = true;

  constructor() { }

  ngOnInit(): void { }

  toggleSideNav(evt) {
    this.isOpened = !this.isOpened;
  }
}
