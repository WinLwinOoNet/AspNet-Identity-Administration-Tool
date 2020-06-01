import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IRole } from './role';
import { RoleService } from './role.service';

import { GenericValidator } from '../shared/generic-validator';
import { AlertService } from '../core/alert/alert.service';
import { ModalService, IModalContent } from '../core/modal/modal.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'Edit Role';
  roleForm: FormGroup;

  role: IRole;
  private sub: Subscription;

  errors: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private alertService: AlertService,
    private modalService: ModalService) {
    this.validationMessages = {
      name: {
        required: 'Role name is required.',
        maxlength: 'Role name cannot exceed 256 characters.'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.roleForm = this.fb.group({
      name: [null,
        [Validators.required,
        Validators.maxLength(256)]
      ]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        this.getRole(id);
      }
    );
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.roleForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.errors = this.genericValidator.processMessages(this.roleForm);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getRole(id: string): void {
    if (id !== '0') {
      this.roleService
        .get<IRole>(id)
        .subscribe(user => {
          this.role = user;
          this.title = `Edit Role: ${this.role.name}`;

          this.roleForm.patchValue({
            name: this.role.name
          });
        }, error => this.alertService.danger(error));
    } else {
      this.title = 'Add New Role';
    }
  }

  save(event: Event): void {
    event.preventDefault();
    if (this.roleForm.valid) {
      if (this.roleForm.dirty) {
        const u = { ...this.role, ...this.roleForm.value };
        if (u.id !== undefined && u.id !== '0') {
          this.roleService.put<IRole>(u)
            .subscribe(_ => {
              this.alertService.success(`${this.role.name} role was updated successfully.`);
              this.onSaveComplete();
            }, error => this.alertService.danger(error));
        } else {
          this.roleService.post<IRole>(u)
            .subscribe(_ => {
              this.alertService.success(`${this.role.name} role was created successfully.`);
              this.onSaveComplete();
            }, error => this.alertService.danger(error));
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errors = this.genericValidator.processMessages(this.roleForm, true);
      this.alertService.danger('Please correct the validation errors.');
    }
  }

  cancel(event: Event): void {
    event.preventDefault();
    this.onSaveComplete();
  }

  delete(event: Event): void {
    event.preventDefault();
    const modalContent: IModalContent = {
      header: 'Delete Role',
      body: 'Are you sure you want to delete this role?',
      cancelButtonText: 'No',
      OKButtonText: 'Yes',
      cancelButtonVisible: true
    }
    this.modalService.show(modalContent)
      .subscribe(status => {
        if (status) {
          this.roleService.delete<IRole>(this.role.id)
            .subscribe(_ => {
              this.alertService.success(`${this.role.name} role was deleted successfully.`);
              this.onSaveComplete();
            }, error => this.alertService.danger(error));
        }
      });
  }

  onSaveComplete(): void {
    this.roleForm.reset();
    this.router.navigate(['/roles']);
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.roleForm.dirty) {
      return true;
    }

    // Dirty show display modal dialog to user to confirm leaving
    const modalContent: IModalContent = {
      header: 'Lose Unsaved Changes?',
      body: 'You have unsaved changes! Would you like to leave the page and lose them?',
      cancelButtonText: 'Cancel',
      OKButtonText: 'Leave'
    };
    return this.modalService.show(modalContent).toPromise();
  }
}
