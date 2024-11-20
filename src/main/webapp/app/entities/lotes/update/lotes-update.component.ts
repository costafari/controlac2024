import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProveedores } from 'app/entities/proveedores/proveedores.model';
import { ProveedoresService } from 'app/entities/proveedores/service/proveedores.service';
import { ILotes } from '../lotes.model';
import { LotesService } from '../service/lotes.service';
import { LotesFormGroup, LotesFormService } from './lotes-form.service';

@Component({
  standalone: true,
  selector: 'jhi-lotes-update',
  templateUrl: './lotes-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LotesUpdateComponent implements OnInit {
  isSaving = false;
  lotes: ILotes | null = null;

  proveedoresCollection: IProveedores[] = [];

  protected lotesService = inject(LotesService);
  protected lotesFormService = inject(LotesFormService);
  protected proveedoresService = inject(ProveedoresService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LotesFormGroup = this.lotesFormService.createLotesFormGroup();

  compareProveedores = (o1: IProveedores | null, o2: IProveedores | null): boolean => this.proveedoresService.compareProveedores(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lotes }) => {
      this.lotes = lotes;
      if (lotes) {
        this.updateForm(lotes);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lotes = this.lotesFormService.getLotes(this.editForm);
    if (lotes.id !== null) {
      this.subscribeToSaveResponse(this.lotesService.update(lotes));
    } else {
      this.subscribeToSaveResponse(this.lotesService.create(lotes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILotes>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(lotes: ILotes): void {
    this.lotes = lotes;
    this.lotesFormService.resetForm(this.editForm, lotes);

    this.proveedoresCollection = this.proveedoresService.addProveedoresToCollectionIfMissing<IProveedores>(
      this.proveedoresCollection,
      lotes.proveedores,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.proveedoresService
      .query({ filter: 'lotes-is-null' })
      .pipe(map((res: HttpResponse<IProveedores[]>) => res.body ?? []))
      .pipe(
        map((proveedores: IProveedores[]) =>
          this.proveedoresService.addProveedoresToCollectionIfMissing<IProveedores>(proveedores, this.lotes?.proveedores),
        ),
      )
      .subscribe((proveedores: IProveedores[]) => (this.proveedoresCollection = proveedores));
  }
}
