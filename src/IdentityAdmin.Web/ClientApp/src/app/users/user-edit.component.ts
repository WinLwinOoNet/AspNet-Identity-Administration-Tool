import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { IUser } from './user';
import { UserService } from './user.service';

import { GenericValidator } from '../shared/generic-validator';
import { AlertService } from '../core/alert/alert.service';
import { ModalService, IModalContent } from '../core/modal/modal.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  title = 'Edit User';
  userForm: FormGroup;
  roles = ['Administrators', 'Managers'];

  user: IUser;
  private sub: Subscription;

  errors: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private modalService: ModalService) {

    this.validationMessages = {
      email: {
        required: 'Email is required.',
        email: 'Email address is invalid.',
        minlength: 'Email must be at least three characters.',
        maxlength: 'Email cannot exceed 256 characters.'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      email: [null,
        [Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(256)]
      ],
      phone: [null],
      roles: [null],
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        this.getUser(id);
      }
    );
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.userForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.errors = this.genericValidator.processMessages(this.userForm);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getUser(id: string): void {
    if (id !== '0') {
      this.userService
        .get<IUser>(id)
        .subscribe(user => {
          this.user = user;
          this.title = `Edit User: ${this.user.email}`;

          this.userForm.patchValue({
            email: this.user.email
          });
        }, error => this.alertService.danger(error));
    } else {
      this.title = 'Add New User';
    }
  }

  save(event: Event): void {
    event.preventDefault();
    if (this.userForm.valid) {
      if (this.userForm.dirty) {
        const u = { ...this.user, ...this.userForm.value };
        if (u.id !== undefined && u.id !== '0') {
          this.userService.put<IUser>(u)
            .subscribe(_ => {
              this.alertService.success('User was updated successfully.');
              this.onSaveComplete();
            }, error => this.alertService.danger(error));
        } else {
          this.userService.post<IUser>(u)
            .subscribe(_ => {
              this.alertService.success('User was created successfully.');
              this.onSaveComplete();
            }, error => this.alertService.danger(error));
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errors = this.genericValidator.processMessages(this.userForm, true);
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
      header: 'Delete User',
      body: 'Are you sure you want to delete this user?',
      cancelButtonText: 'No',
      OKButtonText: 'Yes',
      cancelButtonVisible: true
    }
    this.modalService.show(modalContent)
      .subscribe(status => {
        if (status) {
          this.onSaveComplete();
        }
      });
  }

  onSaveComplete(): void {
    this.userForm.reset();
    this.router.navigate(['/users']);
  }

  canDeactivate(): Promise<boolean> | boolean {
    if (!this.userForm.dirty) {
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
