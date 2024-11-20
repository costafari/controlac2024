import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProveedores } from '../proveedores.model';
import { ProveedoresService } from '../service/proveedores.service';

@Component({
  standalone: true,
  templateUrl: './proveedores-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProveedoresDeleteDialogComponent {
  proveedores?: IProveedores;

  protected proveedoresService = inject(ProveedoresService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.proveedoresService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
