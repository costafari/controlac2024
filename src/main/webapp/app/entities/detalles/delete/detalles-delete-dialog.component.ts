import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDetalles } from '../detalles.model';
import { DetallesService } from '../service/detalles.service';

@Component({
  standalone: true,
  templateUrl: './detalles-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DetallesDeleteDialogComponent {
  detalles?: IDetalles;

  protected detallesService = inject(DetallesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.detallesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
