import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ILotes } from '../lotes.model';

@Component({
  standalone: true,
  selector: 'jhi-lotes-detail',
  templateUrl: './lotes-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LotesDetailComponent {
  lotes = input<ILotes | null>(null);

  previousState(): void {
    window.history.back();
  }
}
