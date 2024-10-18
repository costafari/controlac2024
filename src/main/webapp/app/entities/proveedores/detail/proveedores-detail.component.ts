import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IProveedores } from '../proveedores.model';

@Component({
  standalone: true,
  selector: 'jhi-proveedores-detail',
  templateUrl: './proveedores-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ProveedoresDetailComponent {
  proveedores = input<IProveedores | null>(null);

  previousState(): void {
    window.history.back();
  }
}
