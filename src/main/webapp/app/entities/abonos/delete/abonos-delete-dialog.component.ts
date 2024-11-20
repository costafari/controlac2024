import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAbonos } from '../abonos.model';
import { AbonosService } from '../service/abonos.service';

@Component({
  standalone: true,
  templateUrl: './abonos-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AbonosDeleteDialogComponent {
  abonos?: IAbonos;

  protected abonosService = inject(AbonosService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.abonosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
