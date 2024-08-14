import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'b-input',
  standalone: true,
  imports: [],
  templateUrl: './b-input.component.html',
  styleUrl: './b-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BInputComponent {

}
