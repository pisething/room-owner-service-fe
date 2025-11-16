import { Component } from '@angular/core';
import { TitleComponent } from "../title/title.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [TitleComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
