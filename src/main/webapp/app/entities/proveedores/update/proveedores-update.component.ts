import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProveedores } from '../proveedores.model';
import { ProveedoresService } from '../service/proveedores.service';
import { ProveedoresFormGroup, ProveedoresFormService } from './proveedores-form.service';

@Component({
  standalone: true,
  selector: 'jhi-proveedores-update',
  templateUrl: './proveedores-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProveedoresUpdateComponent implements OnInit {
  isSaving = false;
  proveedores: IProveedores | null = null;

  protected proveedoresService = inject(ProveedoresService);
  protected proveedoresFormService = inject(ProveedoresFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProveedoresFormGroup = this.proveedoresFormService.createProveedoresFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proveedores }) => {
      this.proveedores = proveedores;
      if (proveedores) {
        this.updateForm(proveedores);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const proveedores = this.proveedoresFormService.getProveedores(this.editForm);
    if (proveedores.id !== null) {
      this.subscribeToSaveResponse(this.proveedoresService.update(proveedores));
    } else {
      this.subscribeToSaveResponse(this.proveedoresService.create(proveedores));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProveedores>>): void {
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

  protected updateForm(proveedores: IProveedores): void {
    this.proveedores = proveedores;
    this.proveedoresFormService.resetForm(this.editForm, proveedores);
  }
}
