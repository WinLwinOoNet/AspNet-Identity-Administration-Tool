import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  matMenu;
  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.onToggleSideNav.emit();
  }
}
